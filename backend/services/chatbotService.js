const { Chatbot, Conversation, Message } = require('../models');

class ChatbotService {
  async createChatbot(userId, data) {
    return await Chatbot.create({ ...data, userId });
  }

  async getChatbots(userId) {
    return await Chatbot.findAll({ where: { userId } });
  }

  async getChatbot(id, userId) {
    return await Chatbot.findOne({ where: { id, userId } });
  }

  async updateChatbot(id, userId, data) {
    const chatbot = await this.getChatbot(id, userId);
    if (!chatbot) throw new Error('Chatbot not found');
    Object.assign(chatbot, data);
    await chatbot.save();
    return chatbot;
  }

  async deleteChatbot(id, userId) {
    const chatbot = await this.getChatbot(id, userId);
    if (!chatbot) throw new Error('Chatbot not found');
    await chatbot.destroy();
    return { message: 'Chatbot deleted successfully' };
  }

  async toggleOnline(id, userId) {
    const chatbot = await this.getChatbot(id, userId);
    if (!chatbot) throw new Error('Chatbot not found');
    chatbot.isOnline = !chatbot.isOnline;
    await chatbot.save();
    return chatbot;
  }

  async updateConfig(id, userId, config) {
    const chatbot = await this.getChatbot(id, userId);
    if (!chatbot) throw new Error('Chatbot not found');
    chatbot.config = config;
    await chatbot.save();
    return chatbot;
  }

  async getAnalytics(id, userId) {
    const chatbot = await Chatbot.findOne({
      where: { id, userId },
      include: [{ model: Conversation, include: [Message] }]
    });
    if (!chatbot) throw new Error('Chatbot not found');
    
    const totalConversations = chatbot.Conversations.length;
    const totalMessages = chatbot.Conversations.reduce((sum, conv) => sum + conv.Messages.length, 0);
    const avgMessagesPerConversation = totalMessages / totalConversations || 0;

    return {
      totalConversations,
      totalMessages,
      avgMessagesPerConversation
    };
  }
}

module.exports = new ChatbotService();