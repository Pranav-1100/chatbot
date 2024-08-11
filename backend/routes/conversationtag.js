const express = require('express');
const { ConversationTag, Chatbot } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new conversation tag
router.post('/', auth, async (req, res) => {
  try {
    const { name, chatbotId } = req.body;
    const chatbot = await Chatbot.findOne({ where: { id: chatbotId, userId: req.user.id } });
    if (!chatbot) {
      return res.status(404).send({ error: 'Chatbot not found' });
    }
    const tag = await ConversationTag.create({ name, chatbotId });
    res.status(201).send(tag);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tags for a specific chatbot
router.get('/chatbot/:chatbotId', auth, async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ where: { id: req.params.chatbotId, userId: req.user.id } });
    if (!chatbot) {
      return res.status(404).send({ error: 'Chatbot not found' });
    }
    const tags = await ConversationTag.findAll({ where: { chatbotId: req.params.chatbotId } });
    res.send(tags);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a tag
router.patch('/:id', auth, async (req, res) => {
  try {
    const tag = await ConversationTag.findOne({ 
      where: { id: req.params.id },
      include: [{ model: Chatbot, where: { userId: req.user.id } }]
    });
    if (!tag) {
      return res.status(404).send({ error: 'Tag not found' });
    }
    Object.assign(tag, req.body);
    await tag.save();
    res.send(tag);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a tag
router.delete('/:id', auth, async (req, res) => {
  try {
    const tag = await ConversationTag.findOne({ 
      where: { id: req.params.id },
      include: [{ model: Chatbot, where: { userId: req.user.id } }]
    });
    if (!tag) {
      return res.status(404).send({ error: 'Tag not found' });
    }
    await tag.destroy();
    res.send({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;