const credentials = require('../config.json').db;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    credentials.database,
    credentials.user,
    credentials.password,
    {
        host: credentials.host,
        port: credentials.port,
        dialect: credentials.dialect,
        pool: {
            max: 5,
            min: 0,
            acquire: 60000,
            idle: 10000,
        },
    }
);

module.exports = {
    sequelize,
};
