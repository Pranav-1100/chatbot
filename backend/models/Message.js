const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/db');

const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatText: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    chatUser: {
      type: DataTypes.ENUM('bot', 'agent', 'tool'),
      allowNull: false
    },
    toolCalls: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    toolCallId: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    meta: DataTypes.JSON,
    isHelpful: DataTypes.BOOLEAN,
    externalId: {  
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'messages',
    timestamps: true
  });

  module.exports = {
    Message
  };