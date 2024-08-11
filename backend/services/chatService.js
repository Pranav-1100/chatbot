const { Conversation, Message, EndUser, Chatbot } = require('../models');
const { Op } = require('sequelize');
const openaiService = require('./openaiService');
const { sequelize } = require('../config/db');

class ChatService {
  static async startConversation(userId, chatbotId, endUserData, message) {
    const transaction = await sequelize.transaction();

    try {
      const chatbot = await Chatbot.findOne({
        where: { id: chatbotId, userId },
        transaction
      });

      if (!chatbot) {
        throw new Error('Chatbot not found');
      }

      let endUser = await EndUser.findOne({
        where: {
          [Op.or]: [
            { emailId: endUserData.endUserEmail },
            { externalId: endUserData.externalId }
          ],
          chatbotId
        },
        transaction
      });

      if (!endUser) {
        endUser = await EndUser.create({
          name: endUserData.endUserName,
          emailId: endUserData.endUserEmail,
          source: endUserData.source,
          externalId: endUserData.externalId,
          chatbotId
        }, { transaction });
      }

      const conversation = await Conversation.create({
        chatbotId,
        endUserId: endUser.id,
        assignedTo: 'bot',
        source: endUserData.source
      }, { transaction });

      if (message) {
        await Message.create({
          chatText: message,
          conversationId: conversation.id,
          chatUser: 'user'
        }, { transaction });
      }

      await transaction.commit();

      return { conversation, endUser };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getConversations(userId) {
    return await Conversation.findAll({
      include: [{ 
        model: Chatbot,
        where: { userId },
        attributes: []
      }]
    });
  }

  static async getConversation(id, userId) {
    return await Conversation.findOne({
      where: { id },
      include: [
        { model: Message },
        { 
          model: Chatbot,
          where: { userId },
          attributes: []
        }
      ]
    });
  }

  static async sendMessage(conversationId, userId, message) {
    const conversation = await this.getConversation(conversationId, userId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const userMessage = await Message.create({
      chatText: message,
      conversationId,
      chatUser: 'user'
    });

    const chatHistory = await this.getChatHistory(conversationId);
    const aiResponse = await openaiService.generateChatResponse(chatHistory);

    const botMessage = await Message.create({
      chatText: aiResponse,
      conversationId,
      chatUser: 'bot'
    });

    return { userMessage, botMessage };
  }

  static async streamMessage(conversationId, userId, message) {
    const conversation = await this.getConversation(conversationId, userId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    await Message.create({
      chatText: message,
      conversationId,
      chatUser: 'user'
    });

    const chatHistory = await this.getChatHistory(conversationId);
    return openaiService.generateStreamingChatResponse(chatHistory);
  }

  static async saveStreamResponse(conversationId, response) {
    await Message.create({
      chatText: response,
      conversationId,
      chatUser: 'bot'
    });
  }

  static async assignConversation(conversationId, userId, agentId) {
    const conversation = await this.getConversation(conversationId, userId);

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.agentId = agentId;
    conversation.assignedTo = 'agent';
    await conversation.save();

    return conversation;
  }

  static async updateConversation(id, userId, data) {
    const conversation = await this.getConversation(id, userId);

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    Object.assign(conversation, data);
    await conversation.save();

    return conversation;
  }

  static async deleteConversation(id, userId) {
    const conversation = await this.getConversation(id, userId);

    if (!conversation) {
      throw new Error('Conversation not found or access denied');
    }

    await conversation.destroy();
    return { message: 'Conversation deleted successfully' };
  }

  static async getConversationsByEndUserId(endUserId, userId) {
    return await Conversation.findAll({
      where: { endUserId },
      include: [{ 
        model: Chatbot,
        where: { userId },
        attributes: []
      }]
    });
  }

  static async getChatHistory(conversationId) {
    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']]
    });

    return messages.map(msg => ({
      role: msg.chatUser === 'user' ? 'user' : 'assistant',
      content: msg.chatText
    }));
  }
}

module.exports = ChatService;