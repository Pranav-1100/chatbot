const express = require('express');
const { Conversation, Message } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Start a new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const conversation = await Conversation.create({
      ...req.body,
      endUserId: req.user.id
    });
    res.status(201).send(conversation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all conversations for the user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({ 
      where: { endUserId: req.user.id } 
    });
    res.send(conversations);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific conversation with messages
router.get('/conversations/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: { id: req.params.id, endUserId: req.user.id },
      include: [Message]
    });
    if (!conversation) {
      return res.status(404).send({ error: 'Conversation not found' });
    }
    res.send(conversation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Send a message in a conversation
router.post('/conversations/:id/messages', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: { id: req.params.id, endUserId: req.user.id }
    });
    if (!conversation) {
      return res.status(404).send({ error: 'Conversation not found' });
    }
    const message = await Message.create({
      ...req.body,
      conversationId: conversation.id,
      chatUser: 'agent' // Assuming the user is always the 'agent' in this context
    });
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;