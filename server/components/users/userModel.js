const Sequelize = require('sequelize');
const sequelize = require('../../db').sequelize;

/**
 * User model for accessing database using the ORM Sequelize.
 * @module User
 */
class User extends Sequelize.Model {}

User.init({
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'username',
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'nickname',
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'age',
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'gender',
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'phoneNumber',
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    registered: {
        type: Sequelize.TINYINT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'created_at',
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'updated_at',
    },
},
{
    sequelize,
    modelName: 'user',
    freezeTableName: true,
    timestamps: false,
});

module.exports = User;
