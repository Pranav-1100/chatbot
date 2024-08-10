const express = require('express');
const { Conversation, Message } = require('../models');
const auth = require('../middleware/auth');
const { generateStreamingChatResponse } = require('../services/openaiService');

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

// Modify the route for sending a message in a conversation
router.post('/conversations/:id/messages', auth, async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        where: { id: req.params.id, endUserId: req.user.id },
        include: [Chatbot]
      });
      if (!conversation) {
        return res.status(404).send({ error: 'Conversation not found' });
      }
  
      // Save user message
      const userMessage = await Message.create({
        chatText: req.body.message,
        conversationId: conversation.id,
        chatUser: 'agent'
      });
  
      // Prepare conversation history
      const messages = await Message.findAll({
        where: { conversationId: conversation.id },
        order: [['createdAt', 'ASC']]
      });
      const chatHistory = messages.map(msg => ({
        role: msg.chatUser === 'agent' ? 'user' : 'assistant',
        content: msg.chatText
      }));
  
      // Add chatbot configuration to the prompt
      chatHistory.unshift({
        role: 'system',
        content: `You are a chatbot named ${conversation.Chatbot.name}. ${conversation.Chatbot.config}`
      });
  
      // Generate response from OpenAI
      const aiResponse = await generateChatResponse(chatHistory);
  
      // Save AI response
      const botMessage = await Message.create({
        chatText: aiResponse,
        conversationId: conversation.id,
        chatUser: 'bot'
      });
  
      res.status(201).send({ userMessage, botMessage });
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post('/conversations/:id/messages/stream', auth, async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        where: { id: req.params.id, endUserId: req.user.id },
        include: [Chatbot]
      });
      if (!conversation) {
        return res.status(404).send({ error: 'Conversation not found' });
      }
  
      // Save user message
      await Message.create({
        chatText: req.body.message,
        conversationId: conversation.id,
        chatUser: 'agent'
      });
  
      // Prepare conversation history
      const messages = await Message.findAll({
        where: { conversationId: conversation.id },
        order: [['createdAt', 'ASC']]
      });
      const chatHistory = messages.map(msg => ({
        role: msg.chatUser === 'agent' ? 'user' : 'assistant',
        content: msg.chatText
      }));
  
      chatHistory.unshift({
        role: 'system',
        content: `You are a chatbot named ${conversation.Chatbot.name}. ${conversation.Chatbot.config}`
      });
  
      // Set up streaming response
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
  
      let fullResponse = '';
      for await (const chunk of generateStreamingChatResponse(chatHistory)) {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        fullResponse += chunk;
      }
  
      // Save the full response
      await Message.create({
        chatText: fullResponse,
        conversationId: conversation.id,
        chatUser: 'bot'
      });
  
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  });
  

module.exports = router;