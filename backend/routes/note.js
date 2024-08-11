const express = require('express');
const NoteService = require('../services/noteService');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const note = await NoteService.createNote(req.user.id, req.body);
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all notes for a conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const notes = await NoteService.getNotesForConversation(req.user.id, req.params.conversationId);
    res.send(notes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a note
router.patch('/:id', auth, async (req, res) => {
  try {
    const note = await NoteService.updateNote(req.user.id, req.params.id, req.body);
    res.send(note);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await NoteService.deleteNote(req.user.id, req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;