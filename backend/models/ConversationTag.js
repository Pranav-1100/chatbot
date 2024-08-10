const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/db');

const ConversationTag = sequelize.define('ConversationTag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chatbotId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  }, {
    tableName: 'conversation_tags',
    timestamps: true
  });

  module.exports = {
    ConversationTag
  };