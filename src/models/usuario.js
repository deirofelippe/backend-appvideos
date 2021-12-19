const { DataTypes } = require("sequelize");
const db = require("../database/index.js");

const usuario = db.define("usuario", {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: true,
   },
   nome: {
      type: DataTypes.STRING,
      allowNull: false,
   },
   email: {
      type: DataTypes.STRING,
      allowNull: false,
   },
});

module.exports = usuario;
