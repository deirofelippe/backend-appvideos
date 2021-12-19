const model = require("../models/usuario.js");
const uuid = require("uuid");

function findAll() {
   return model.findAll();
}

async function create(usuario) {
   usuario.id = uuid.v4();
   const { dataValues: result } = await model.create(usuario);
   return result;
}

module.exports = {
   findAll,
   create,
};
