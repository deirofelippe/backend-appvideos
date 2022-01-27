"use strict";

require("dotenv").config();
const faker = require("faker");
const uuid = require("uuid");
const { cpf } = require("cpf-cnpj-validator");
const bcrypt = require("bcrypt");

module.exports = {
   up: async (queryInterface) => {
      const quantidade = 40;
      const salt = parseInt(process.env.BCRYPT_SALT);

      const usuarios = [];
      let usuario = {};
      let senha = "";

      for (let indice = 1; indice <= quantidade; indice++) {
         senha = faker.internet.password(15);
         usuario = {
            id: uuid.v4(),
            nome: faker.name.findName(),
            email: faker.internet.email(),
            senha: await bcrypt.hash(senha, salt),
            cpf: cpf.generate(),
            createdAt: new Date(),
            updatedAt: new Date(),
         };

         usuarios.push(usuario);
      }

      await queryInterface.bulkInsert("Usuarios", usuarios, {});
   },

   down: async (queryInterface) => {
      await queryInterface.bulkDelete("Usuarios", null, {});
   },
};
