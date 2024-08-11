const express = require('express');
const ProfileService = require('../services/profileService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await ProfileService.getProfile(req.user.id);
    res.send(profile);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update user profile
router.patch('/', auth, async (req, res) => {
  try {
    const updatedProfile = await ProfileService.updateProfile(req.user.id, req.body);
    res.send(updatedProfile);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete user profile
router.delete('/', auth, async (req, res) => {
  try {
    const result = await ProfileService.deleteProfile(req.user.id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get user's chatbots
router.get('/chatbots', auth, async (req, res) => {
  try {
    const chatbots = await ProfileService.getChatbots(req.user.id);
    res.send(chatbots);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;