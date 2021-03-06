const dao = require("../../dao/usuario.dao.js");
const cache = require("../../cache");

async function remove({ id }) {
   const result = await dao.remove(id);

   await cache.removerDadosNaCache("usuarios");
   await cache.removerDadosNaCache(`usuario:${id}`);

   return result;
}

module.exports = remove;
