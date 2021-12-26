const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");
const Usuario = require("../models/usuario.js");

const connection = new Sequelize(dbConfig);

Usuario.init(connection);

module.exports = connection;
