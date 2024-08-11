const { User, Chatbot } = require('../models');
const bcrypt = require('bcrypt');

class ProfileService {
  static async getProfile(userId) {
    return await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Chatbot, attributes: ['id', 'name'] }]
    });
  }

  static async updateProfile(userId, updates) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      throw new Error('Invalid updates!');
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    Object.assign(user, updates);
    await user.save();

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  static async deleteProfile(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  static async getChatbots(userId) {
    return await Chatbot.findAll({
      where: { userId },
      attributes: ['id', 'name', 'isActive', 'createdAt']
    });
  }
}

module.exports = ProfileService;