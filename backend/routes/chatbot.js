const express = require('express');
const ChatbotService = require('../services/chatbotService');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new chatbot
router.post('/', auth, async (req, res) => {
  try {
    const chatbot = await ChatbotService.createChatbot(req.user.id, req.body);
    res.status(201).send(chatbot);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all chatbots for the user
router.get('/', auth, async (req, res) => {
  try {
    const chatbots = await ChatbotService.getChatbots(req.user.id);
    res.send(chatbots);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific chatbot
router.get('/:id', auth, async (req, res) => {
  try {
    const chatbot = await ChatbotService.getChatbot(req.params.id, req.user.id);
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
    const chatbot = await ChatbotService.updateChatbot(req.params.id, req.user.id, req.body);
    res.send(chatbot);
  } catch (error) {
    if (error.message === 'Chatbot not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(400).send(error);
    }
  }
});

// Delete a chatbot
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await ChatbotService.deleteChatbot(req.params.id, req.user.id);
    res.send(result);
  } catch (error) {
    if (error.message === 'Chatbot not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send(error);
    }
  }
});

// Toggle chatbot online status
router.post('/:id/toggle-online', auth, async (req, res) => {
  try {
    const chatbot = await ChatbotService.toggleOnline(req.params.id, req.user.id);
    res.send(chatbot);
  } catch (error) {
    if (error.message === 'Chatbot not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(400).send(error);
    }
  }
});

// Update chatbot configuration
router.patch('/:id/config', auth, async (req, res) => {
  try {
    const chatbot = await ChatbotService.updateConfig(req.params.id, req.user.id, req.body.config);
    res.send(chatbot);
  } catch (error) {
    if (error.message === 'Chatbot not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(400).send(error);
    }
  }
});

// Get chatbot analytics
router.get('/:id/analytics', auth, async (req, res) => {
  try {
    const analytics = await ChatbotService.getAnalytics(req.params.id, req.user.id);
    res.send(analytics);
  } catch (error) {
    if (error.message === 'Chatbot not found') {
      res.status(404).send({ error: error.message });
    } else {
      res.status(500).send(error);
    }
  }
});

module.exports = router;