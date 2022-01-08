const dao = require("../../dao/usuario.dao.js");
const cache = require("../../cache");

async function findAll() {
   const temUsuarioNaCache = await cache.buscarDadosNaCache("usuarios");
   if (temUsuarioNaCache) return temUsuarioNaCache;

   const usuarios = await dao.findAll();

   if (!usuarios) return usuarios;

   await cache.gravarDadosNaCache("usuarios", usuarios);
   return usuarios;
}
module.exports = findAll;
