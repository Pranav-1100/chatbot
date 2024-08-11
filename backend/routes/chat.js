const express = require('express');
const router = express.Router();
const ChatService = require('../services/chatService');
const auth = require('../middleware/auth');

// Start a new conversation
router.post('/conversations', auth, async (req, res) => {
    try {
        const { chatbotId, endUserName, endUserEmail, source, externalId, message } = req.body;
        const result = await ChatService.startConversation(req.user.id, chatbotId, { endUserName, endUserEmail, source, externalId }, message);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error in create conversation route:', error);
        res.status(400).send({ error: error.message });
    }
});

// Get all conversations for the user
router.get('/conversations', auth, async (req, res) => {
    try {
        const conversations = await ChatService.getConversations(req.user.id);
        res.send(conversations);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get a specific conversation with messages
router.get('/conversations/:id', auth, async (req, res) => {
    try {
        const conversation = await ChatService.getConversation(req.params.id, req.user.id);
        if (!conversation) {
            return res.status(404).send({ error: 'Conversation not found' });
        }
        res.send(conversation);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Send a message in a conversation
router.post('/conversations/:id/messages', auth, async (req, res) => {
    try {
        const result = await ChatService.sendMessage(req.params.id, req.user.id, req.body.message);
        res.status(201).send(result);
    } catch (error) {
        console.error('Error in sending message:', error);
        res.status(400).send({ error: error.message });
    }
});

// Stream a message in a conversation
router.post('/conversations/:id/messages/stream', auth, async (req, res) => {
    try {
        const stream = await ChatService.streamMessage(req.params.id, req.user.id, req.body.message);

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        let fullResponse = '';
        stream.on('data', (chunk) => {
            fullResponse += chunk;
            res.write(`data: ${JSON.stringify({ type: 'bot', content: chunk })}\n\n`);
        });

        stream.on('end', async () => {
            res.write(`data: ${JSON.stringify({ type: 'end', content: 'Stream ended' })}\n\n`);
            res.end();

            await ChatService.saveStreamResponse(req.params.id, fullResponse);
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
router.post('/conversations/:id/assign', auth, async (req, res) => {
    try {
        const { agentId } = req.body;
        const conversation = await ChatService.assignConversation(req.params.id, req.user.id, agentId);
        res.send(conversation);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Update a conversation
router.put('/conversations/:id', auth, async (req, res) => {
    try {
        const conversation = await ChatService.updateConversation(req.params.id, req.user.id, req.body);
        res.send(conversation);
    } catch (error) {
        if (error.message === 'Conversation not found or access denied') {
            res.status(404).send({ error: error.message });
        } else {
            res.status(400).send({ error: error.message });
        }
    }
});

// Delete a conversation
router.delete('/conversations/:id', auth, async (req, res) => {
    try {
        const result = await ChatService.deleteConversation(req.params.id, req.user.id);
        res.send(result);
    } catch (error) {
        if (error.message === 'Conversation not found or access denied') {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
});

// Get conversations by end user ID
router.get('/conversations/enduser/:endUserId', auth, async (req, res) => {
    try {
        const conversations = await ChatService.getConversationsByEndUserId(req.params.endUserId, req.user.id);
        res.send(conversations);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;