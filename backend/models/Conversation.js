const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatbotId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.ENUM('bot', 'agent', 'closed'),
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('Urgent', 'Moderate', 'Low'),
      allowNull: true
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('widget', 'whatsapp', 'tele'),
      allowNull: true
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastMsgAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    endUserId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    conversationTags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    notes: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    isHelpful: DataTypes.BOOLEAN,
  }, {
    tableName: 'conversations',
    timestamps: true
  });

  return Conversation;
};