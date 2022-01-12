const dao = require("../../dao/usuario.dao.js");
const cache = require("../../cache");

async function findAll() {
   const temUsuarioNaCache = await cache.buscarDadosNaCache("usuarios");
   if (temUsuarioNaCache) return temUsuarioNaCache;

   const usuarios = await dao.findAll();

   if (!usuarios) return usuarios;

   const usuariosLimpos = tirarPropriedadesDaLista(usuarios);

   await cache.gravarDadosNaCache("usuarios", usuariosLimpos);
   return usuariosLimpos;
}

const tirarPropriedadesDaLista = (usuarios) =>
   usuarios.map((usuario) => {
      delete usuario.updatedAt;
      delete usuario.createdAt;
      delete usuario.senha;
      return usuario;
   });

module.exports = findAll;
