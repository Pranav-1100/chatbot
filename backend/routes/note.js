const express = require('express');
const { Note, Conversation } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { name, content, conversationId } = req.body;
    const conversation = await Conversation.findOne({ 
      where: { id: conversationId },
      include: [{ model: Chatbot, where: { userId: req.user.id } }]
    });
    if (!conversation) {
      return res.status(404).send({ error: 'Conversation not found' });
    }
    const note = await Note.create({ name, content, conversationId, createdBy: req.user.id });
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all notes for a conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ 
      where: { id: req.params.conversationId },
      include: [{ model: Chatbot, where: { userId: req.user.id } }]
    });
    if (!conversation) {
      return res.status(404).send({ error: 'Conversation not found' });
    }
    const notes = await Note.findAll({ where: { conversationId: req.params.conversationId } });
    res.send(notes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a note
router.patch('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }
    Object.assign(note, req.body);
    await note.save();
    res.send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      where: { id: req.params.id, createdBy: req.user.id }
    });
    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }
    await note.destroy();
    res.send({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;