const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');

// @route   GET api/resume
// @desc    Get user resume
// @access  Private
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
// @desc    Create or update user resume
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne({ userId: req.user.id });

    if (resume) {
      // Update
      resume.resumeData = req.body;
      resume.updatedAt = Date.now();
      await resume.save();
      return res.json(resume.resumeData);
    }

    // Create
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
// @desc    Proxy LaTeX compilation to avoid CORS and provide custom filename
// @access  Public (or Private if you prefer, keeping public for easier direct link if needed)
router.post('/download-pdf', async (req, res) => {
  const { latexCode, filename } = req.body;

  if (!latexCode) {
    return res.status(400).json({ msg: 'LaTeX code is required' });
  }

  try {
    const compileUrl = `https://latexonline.cc/compile?text=${encodeURIComponent(latexCode)}`;
    const response = await fetch(compileUrl);

    if (!response.ok) {
      throw new Error('LaTeX compilation failed');
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'resume.pdf'}"`);
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error during PDF generation');
  }
});

module.exports = router;