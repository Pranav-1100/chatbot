const { ConversationTag, Chatbot } = require('../models');

class ConversationTagService {
  static async createTag(userId, { name, chatbotId }) {
    const chatbot = await Chatbot.findOne({ where: { id: chatbotId, userId } });
    if (!chatbot) {
      throw new Error('Chatbot not found');
    }
    return await ConversationTag.create({ name, chatbotId });
  }

  static async getTagsForChatbot(userId, chatbotId) {
    const chatbot = await Chatbot.findOne({ where: { id: chatbotId, userId } });
    if (!chatbot) {
      throw new Error('Chatbot not found');
    }
    return await ConversationTag.findAll({ where: { chatbotId } });
  }

  static async updateTag(userId, tagId, updates) {
    const tag = await ConversationTag.findOne({ 
      where: { id: tagId },
      include: [{ model: Chatbot, where: { userId } }]
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    Object.assign(tag, updates);
    await tag.save();
    return tag;
  }

  static async deleteTag(userId, tagId) {
    const tag = await ConversationTag.findOne({ 
      where: { id: tagId },
      include: [{ model: Chatbot, where: { userId } }]
    });

    if (!tag) {
      throw new Error('Tag not found');
    }

    await tag.destroy();
    return { message: 'Tag deleted successfully' };
  }
}

module.exports = ConversationTagService;