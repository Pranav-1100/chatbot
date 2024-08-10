const express = require('express');
const { Chatbot } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new chatbot
router.post('/', auth, async (req, res) => {
  try {
    const chatbot = await Chatbot.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).send(chatbot);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all chatbots for the user
router.get('/', auth, async (req, res) => {
  try {
    const chatbots = await Chatbot.findAll({ where: { userId: req.user.id } });
    res.send(chatbots);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific chatbot
router.get('/:id', auth, async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!chatbot) {
      return res.status(404).send({ error: 'Chatbot not found' });
    }
    res.send(chatbot);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a chatbot
router.patch('/:id', auth, async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!chatbot) {
      return res.status(404).send({ error: 'Chatbot not found' });
    }
    Object.assign(chatbot, req.body);
    await chatbot.save();
    res.send(chatbot);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a chatbot
router.delete('/:id', auth, async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    if (!chatbot) {
      return res.status(404).send({ error: 'Chatbot not found' });
    }
    await chatbot.destroy();
    res.send({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;