const dao = require("../dao/usuario.dao.js");
const uuid = require("uuid");

function findAll() {
   return dao.findAll();
}

async function create(usuario) {
   usuario.id = uuid.v4();
   return await dao.create(usuario);
}

module.exports = {
   findAll,
   create,
};
