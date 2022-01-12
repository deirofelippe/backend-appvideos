const dao = require("../../dao/usuario.dao.js");
const cache = require("../../cache");

async function findById({ id }) {
   const temUsuarioNaCache = await cache.buscarDadosNaCache(`usuario:${id}`);
   if (temUsuarioNaCache) return temUsuarioNaCache;

   let usuario = await dao.findById(id);

   if (!usuario) return usuario;

   const { senha, createdAt, updatedAt, ...rest } = usuario;

   usuario = rest;

   await cache.gravarDadosNaCache(`usuario:${id}`, usuario);
   return usuario;
}
module.exports = findById;
