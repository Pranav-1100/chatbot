const { DataTypes } = require('sequelize');
const { sequelize } = require('./../config/db');
module.exports = (sequelize) => {

    const EndUser = sequelize.define('EndUser', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        emailId: DataTypes.STRING,
        source: {
            type: DataTypes.ENUM('whatsapp', 'website'),
            allowNull: true
        },
        source: {
            type: DataTypes.ENUM('widget', 'whatsapp', 'tele'),
            allowNull: true
        },
        externalId: DataTypes.STRING,
        chatbotId: {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        tableName: 'endusers',
        timestamps: true,
        paranoid: true
    });

    return EndUser
}