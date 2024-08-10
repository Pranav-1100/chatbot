const express = require('express');
const { Conversation, Message } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's chat statistics
router.get('/chat-stats', auth, async (req, res) => {
  try {
    const totalConversations = await Conversation.count({ where: { endUserId: req.user.id } });
    const totalMessages = await Message.count({
      include: [{
        model: Conversation,
        where: { endUserId: req.user.id }
      }]
    });

    res.send({
      totalConversations,
      totalMessages,
      averageMessagesPerConversation: totalMessages / totalConversations
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;