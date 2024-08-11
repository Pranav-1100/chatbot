const { EndUser, ChatBot } = require('../models');

class EndUserService {
  static async createEndUser(data) {
    return await EndUser.create(data);
  }

  static async getEndUsers(chatbotId) {
    return await EndUser.findAll({ where: { chatbotId } });
  }

  static async getEndUser(id, chatbotId) {
    return await EndUser.findOne({ where: { id, chatbotId } });
  }

  static async updateEndUser(id, chatbotId, data) {
    const endUser = await this.getEndUser(id, chatbotId);
    if (!endUser) throw new Error('End user not found');
    return await endUser.update(data);
  }

  static async deleteEndUser(id, chatbotId) {
    const endUser = await this.getEndUser(id, chatbotId);
    if (!endUser) throw new Error('End user not found');
    await endUser.destroy();
    return { message: 'End user deleted successfully' };
  }
}

module.exports = EndUserService;