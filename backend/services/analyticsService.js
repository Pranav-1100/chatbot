const { Conversation, Message, Chatbot, EndUser } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class AnalyticsService {
  static async getChatStats(userId) {
    const totalConversations = await Conversation.count({
      include: [{
        model: Chatbot,
        where: { userId },
        attributes: []
      }]
    });

    const totalMessages = await Message.count({
      include: [{
        model: Conversation,
        include: [{
          model: Chatbot,
          where: { userId },
          attributes: []
        }]
      }]
    });

    return {
      totalConversations,
      totalMessages,
      averageMessagesPerConversation: totalConversations > 0 ? totalMessages / totalConversations : 0
    };
  }

  static async getChatbotPerformance(userId) {
    return await Chatbot.findAll({
      where: { userId },
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('Conversations.id')), 'conversationCount'],
        [fn('AVG', col('Conversations.Messages.id')), 'averageMessagesPerConversation']
      ],
      include: [{
        model: Conversation,
        attributes: [],
        include: [{
          model: Message,
          attributes: []
        }]
      }],
      group: ['Chatbot.id'],
      raw: true
    });
  }

  static async getUserActivity(userId, startDate, endDate) {
    return await Conversation.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'conversationCount']
      ],
      include: [{
        model: Chatbot,
        where: { userId },
        attributes: []
      }],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true
    });
  }

  static async getTopEndUsers(userId, limit = 10) {
    return await EndUser.findAll({
      attributes: [
        'id',
        'name',
        'emailId',
        [fn('COUNT', col('Conversations.id')), 'conversationCount']
      ],
      include: [{
        model: Conversation,
        attributes: [],
        include: [{
          model: Chatbot,
          where: { userId },
          attributes: []
        }]
      }],
      group: ['EndUser.id'],
      order: [[fn('COUNT', col('Conversations.id')), 'DESC']],
      limit,
      raw: true
    });
  }
}

module.exports = AnalyticsService;