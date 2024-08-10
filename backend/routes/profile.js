const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  res.send(req.user);
});

// Update user profile
router.patch('/', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete user profile
router.delete('/', auth, async (req, res) => {
  try {
    await req.user.destroy();
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;