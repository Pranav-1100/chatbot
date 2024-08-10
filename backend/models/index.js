const { sequelize } = require('../config/db');

const Conversation = require('./Conversation')(sequelize);
const EndUser = require('./EndUser')(sequelize);
const Note = require('./Note')(sequelize);
const ConversationTag = require('./ConversationTag')(sequelize);
const Message = require('./Message')(sequelize);
const Chatbot = require('./ChatBot')(sequelize);
const User = require('./User')(sequelize);

// Define associations
Conversation.belongsTo(EndUser, { foreignKey: 'endUserId' });
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Conversation.hasMany(Note, { foreignKey: 'conversationId' });
Conversation.belongsToMany(ConversationTag, { through: 'ConversationConversationTag' });
Conversation.belongsTo(Chatbot, { foreignKey: 'chatbotId' });

EndUser.hasMany(Conversation, { foreignKey: 'endUserId' });
EndUser.belongsTo(Chatbot, { foreignKey: 'chatbotId' });

Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

Note.belongsTo(Conversation, { foreignKey: 'conversationId' });

Chatbot.hasMany(Conversation, { foreignKey: 'chatbotId' });
Chatbot.hasMany(EndUser, { foreignKey: 'chatbotId' });
Chatbot.hasMany(User, { foreignKey: 'chatbotId' });

User.belongsTo(Chatbot, { foreignKey: 'chatbotId' });

module.exports = {
  Conversation,
  EndUser,
  Note,
  ConversationTag,
  Message,
  Chatbot,
  User
};