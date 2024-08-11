const express = require('express');
const ConversationTagService = require('../services/conversationTagService');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new conversation tag
router.post('/', auth, async (req, res) => {
  try {
    const tag = await ConversationTagService.createTag(req.user.id, req.body);
    res.status(201).send(tag);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all tags for a specific chatbot
router.get('/chatbot/:chatbotId', auth, async (req, res) => {
  try {
    const tags = await ConversationTagService.getTagsForChatbot(req.user.id, req.params.chatbotId);
    res.send(tags);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a tag
router.patch('/:id', auth, async (req, res) => {
  try {
    const tag = await ConversationTagService.updateTag(req.user.id, req.params.id, req.body);
    res.send(tag);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a tag
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await ConversationTagService.deleteTag(req.user.id, req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;