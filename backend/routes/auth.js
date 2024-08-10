const express = require('express');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const isPasswordMatch = await user.comparePassword(req.body.password);
    if (!isPasswordMatch) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
    }
    const token = user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/logout', auth, async (req, res) => {
  try {
    // In a more complex system, you might want to invalidate the token here
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;