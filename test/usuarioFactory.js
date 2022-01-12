const { cpf } = require("cpf-cnpj-validator");
const faker = require("faker");
const uuid = require("uuid");
faker.locale = "pt_BR";

/**
 *
 * @param {*} quantidade por padrão o valor é 1
 * @returns
 */
function usuarioFactory(quantidade = 1) {
   const usuarios = [];
   for (let index = 1; index <= quantidade; index++) {
      usuarios.push({
         id: uuid.v4(),
         nome: faker.name.findName(),
         email: faker.internet.email(),
         cpf: cpf.generate(),
         senha: faker.internet.password(15),
      });
   }

   return usuarios;
}

module.exports = usuarioFactory;
