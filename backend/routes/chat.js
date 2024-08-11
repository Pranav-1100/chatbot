const express = require('express');
const { Conversation, Message } = require('../models');
const auth = require('../middleware/auth');
const { generateStreamingChatResponse } = require('../services/openaiService');

const router = express.Router();

// Start a new conversation
router.post('/conversations', auth, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { chatbotId, endUserName, endUserEmail, source, externalId, message } = req.body;

        // Check if the chatbot exists and belongs to the user
        const chatbot = await Chatbot.findOne({
            where: { id: chatbotId, userId: req.user.id },
            transaction
        });

        if (!chatbot) {
            await transaction.rollback();
            return res.status(404).send({ error: 'Chatbot not found' });
        }

        // Find or create the EndUser
        let endUser = await EndUser.findOne({
            where: {
                [Op.or]: [
                    { emailId: endUserEmail },
                    { externalId: externalId }
                ],
                chatbotId: chatbotId
            },
            transaction
        });

        if (!endUser) {
            endUser = await EndUser.create({
                name: endUserName,
                emailId: endUserEmail,
                source: source,
                externalId: externalId,
                chatbotId: chatbotId
            }, { transaction });
        }

        // Create the conversation
        const conversation = await Conversation.create({
            chatbotId: chatbotId,
            endUserId: endUser.id,
            assignedTo: 'bot',
            source: source
        }, { transaction });

        // Create the first message
        if (message) {
            await Message.create({
                chatText: message,
                conversationId: conversation.id,
                chatUser: 'agent'
            }, { transaction });
        }

        await transaction.commit();

        res.status(201).send({
            conversation: conversation,
            endUser: endUser
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error in create conversation route:', error);
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

// Update the route for sending a message in a conversation
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
        const aiResponse = await openaiService.generateChatResponse(chatHistory);

        // Save AI response
        const botMessage = await Message.create({
            chatText: aiResponse,
            conversationId: conversation.id,
            chatUser: 'bot'
        });

        res.status(201).send({ userMessage, botMessage });
    } catch (error) {
        console.error('Error in sending message:', error);
        res.status(400).send(error);
    }
});

// Add a new route for streaming responses
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

        const stream = await openaiService.generateStreamingChatResponse(chatHistory);

        let fullResponse = '';
        stream.on('data', (chunk) => {
            fullResponse += chunk;
            res.write(`data: ${JSON.stringify({ type: 'bot', content: chunk })}\n\n`);
        });

        stream.on('end', async () => {
            res.write(`data: ${JSON.stringify({ type: 'end', content: 'Stream ended' })}\n\n`);
            res.end();

            // Save the full response
            await Message.create({
                chatText: fullResponse,
                conversationId: conversation.id,
                chatUser: 'bot'
            });
        });

        stream.on('error', (error) => {
            console.error('Stream error:', error);
            res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
            res.end();
        });

    } catch (error) {
        console.error('Error in streaming message:', error);
        res.status(500).send({ error: 'An error occurred while streaming the response' });
    }
});
// Assign conversation to an agent
router.post('/:id/assign', auth, async (req, res) => {
    try {
        const { agentId } = req.body;
        const conversation = await Conversation.findOne({
            where: { id: req.params.id },
            include: [{ model: Chatbot, where: { userId: req.user.id } }]
        });
        if (!conversation) {
            return res.status(404).send({ error: 'Conversation not found' });
        }
        conversation.agentId = agentId;
        conversation.assignedTo = 'agent';
        await conversation.save();
        res.send(conversation);
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;