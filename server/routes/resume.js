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

module.exports = router;