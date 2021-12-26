const faker = require("faker");
const uuid = require("uuid");
const { UUID } = require("sequelize/dist");
faker.locale = "pt_BR";

/**
 *
 * @param {number} quantidade por padrão o valor é 1
 * @returns
 */
function factory(quantidade = 1) {
   if (quantidade === 1) {
      return {
         id: uuid.v4(),
         nome: faker.name.findName(),
         email: faker.internet.email(),
      };
   }

   const usuarios = [];
   for (let index = 1; index < quantidade; index++) {
      usuarios.push({
         id: uuid.v4(),
         nome: faker.name.findName(),
         email: faker.internet.email(),
      });
   }

   return usuarios;
}

module.exports = factory;
