const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

const pdfCache = new Map();
const MAX_CACHE = 50;
const compilationQueue = new Map();

function hashLatex(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function evictOldest() {
  if (pdfCache.size >= MAX_CACHE) {
    const oldest = pdfCache.keys().next().value;
    pdfCache.delete(oldest);
  }
}

const { spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

async function compileLocalPDF(latexCode) {
  const tmpDir = path.join(__dirname, '..', '.tectonic_cache', crypto.randomBytes(8).toString('hex'));
  await fs.mkdir(tmpDir, { recursive: true });
  
  const texPath = path.join(tmpDir, 'resume.tex');
  const pdfPath = path.join(tmpDir, 'resume.pdf');
  await fs.writeFile(texPath, latexCode);

  return new Promise((resolve, reject) => {
    const tectonicPath = path.join(__dirname, '..', 'tectonic');
    const tectonicCacheDir = path.join(__dirname, '..', '.tectonic_cache');
    const homeDir = path.join(__dirname, '..', '.home');

    const proc = spawn(tectonicPath, [texPath], {
      cwd: tmpDir,
      env: {
        ...process.env,
        TECTONIC_CACHE_DIR: tectonicCacheDir,
        HOME: homeDir
      }
    });

    proc.on('close', async (code) => {
      if (code === 0) {
        try {
          const buffer = await fs.readFile(pdfPath);
          await fs.rm(tmpDir, { recursive: true, force: true });
          resolve(buffer);
        } catch (err) {
          reject(err);
        }
      } else {
        await fs.rm(tmpDir, { recursive: true, force: true });
        reject(new Error(`Tectonic compilation failed with code ${code}`));
      }
    });
  });
}

async function getOrCompilePDF(latexCode) {
  const hash = hashLatex(latexCode);

  // Check cache first
  if (pdfCache.has(hash)) {
    return { buffer: pdfCache.get(hash), cached: true };
  }

  // Check if already being compiled
  if (compilationQueue.has(hash)) {
    try {
      const buffer = await compilationQueue.get(hash);
      return { buffer, cached: true };
    } catch (err) {
      // If previous compilation failed, we might want to try again
      compilationQueue.delete(hash);
      throw err;
    }
  }

  // Start new compilation
  const compilationPromise = (async () => {
    try {
      const buffer = await compileLocalPDF(latexCode);

      evictOldest();
      pdfCache.set(hash, buffer);
      return buffer;
    } finally {
      compilationQueue.delete(hash);
    }
  })();

  compilationQueue.set(hash, compilationPromise);
  const buffer = await compilationPromise;
  return { buffer, cached: false };
}

// @route   GET api/resume
router.get('/', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ msg: 'Resume not found' });
    }
    res.json(resume.resumeData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resume
router.post('/', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (resume) {
      resume.resumeData = req.body;
      resume.updatedAt = Date.now();
      await resume.save();
      return res.json(resume.resumeData);
    }

    resume = new Resume({
      userId: req.user.id,
      resumeData: req.body
    });

    await resume.save();
    res.json(resume.resumeData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resume/download-pdf
router.post('/download-pdf', async (req, res) => {
  const { latexCode, filename } = req.body;

  if (!latexCode) {
    return res.status(400).json({ msg: 'LaTeX code is required' });
  }

  try {
    const { buffer, cached } = await getOrCompilePDF(latexCode);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'resume.pdf'}"`);
    res.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error during PDF generation');
  }
});

// @route   POST api/resume/pre-compile
router.post('/pre-compile', async (req, res) => {
  const { latexCode } = req.body;

  if (!latexCode) {
    return res.status(400).json({ msg: 'LaTeX code is required' });
  }

  try {
    const { cached } = await getOrCompilePDF(latexCode);
    res.json({ msg: 'Compilation finished', cached });
  } catch (err) {
    console.error('Pre-compilation error:', err);
    res.status(500).json({ msg: 'Pre-compilation failed' });
  }
});

module.exports = router;
