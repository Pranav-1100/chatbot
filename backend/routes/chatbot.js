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
// Toggle chatbot online status
router.post('/:id/toggle-online', auth, async (req, res) => {
    try {
      const chatbot = await Chatbot.findOne({ where: { id: req.params.id, userId: req.user.id } });
      if (!chatbot) {
        return res.status(404).send({ error: 'Chatbot not found' });
      }
      chatbot.isOnline = !chatbot.isOnline;
      await chatbot.save();
      res.send(chatbot);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Update chatbot configuration
  router.patch('/:id/config', auth, async (req, res) => {
    try {
      const chatbot = await Chatbot.findOne({ where: { id: req.params.id, userId: req.user.id } });
      if (!chatbot) {
        return res.status(404).send({ error: 'Chatbot not found' });
      }
      chatbot.config = req.body.config;
      await chatbot.save();
      res.send(chatbot);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // Get chatbot analytics
  router.get('/:id/analytics', auth, async (req, res) => {
    try {
      const chatbot = await Chatbot.findOne({ 
        where: { id: req.params.id, userId: req.user.id },
        include: [{ model: Conversation, include: [Message] }]
      });
      if (!chatbot) {
        return res.status(404).send({ error: 'Chatbot not found' });
      }
      
      const totalConversations = chatbot.Conversations.length;
      const totalMessages = chatbot.Conversations.reduce((sum, conv) => sum + conv.Messages.length, 0);
      const avgMessagesPerConversation = totalMessages / totalConversations || 0;
  
      res.send({
        totalConversations,
        totalMessages,
        avgMessagesPerConversation
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;