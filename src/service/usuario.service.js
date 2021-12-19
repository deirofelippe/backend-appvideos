const dao = require("../dao/usuario.dao.js");

function findAll() {
   return dao.findAll();
}
function create(usuario) {
   return dao.create(usuario);
}

module.exports = {
   findAll,
   create,
};
