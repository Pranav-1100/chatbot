const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/db');

module.exports = (sequelize) => {
    const Chatbot = sequelize.define('Chatbot', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        config: {
            type: DataTypes.TEXT,
            allowNull: true
          },
        slug: DataTypes.STRING,
        url: DataTypes.STRING,
        config: DataTypes.JSON,
        LLMPrompts: DataTypes.JSON,
        LLMModel: DataTypes.STRING,
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        activePlan: DataTypes.STRING,
        conversationTags: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    }, {
        tableName: 'chatbots',
        timestamps: true
    });

    return Chatbot
};