const { Note, Conversation, Chatbot } = require('../models');

class NoteService {
  static async createNote(userId, { name, content, conversationId }) {
    const conversation = await Conversation.findOne({ 
      where: { id: conversationId },
      include: [{ model: Chatbot, where: { userId } }]
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return await Note.create({ name, content, conversationId, createdBy: userId });
  }

  static async getNotesForConversation(userId, conversationId) {
    const conversation = await Conversation.findOne({ 
      where: { id: conversationId },
      include: [{ model: Chatbot, where: { userId } }]
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    return await Note.findAll({ where: { conversationId } });
  }

  static async updateNote(userId, noteId, updates) {
    const note = await Note.findOne({ 
      where: { id: noteId, createdBy: userId }
    });

    if (!note) {
      throw new Error('Note not found');
    }

    Object.assign(note, updates);
    await note.save();
    return note;
  }

  static async deleteNote(userId, noteId) {
    const note = await Note.findOne({ 
      where: { id: noteId, createdBy: userId }
    });

    if (!note) {
      throw new Error('Note not found');
    }

    await note.destroy();
    return { message: 'Note deleted successfully' };
  }
}

module.exports = NoteService;