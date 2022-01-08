const dao = require("../../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../../cache");
const montarError = require("../../utils/montarError.js");
const update = require("./update.js");

async function findAll() {
   const temUsuarioNaCache = await cache.buscarDadosNaCache("usuarios");
   if (temUsuarioNaCache) return temUsuarioNaCache;

   const usuarios = await dao.findAll();

   if (!usuarios) return usuarios;

   await cache.gravarDadosNaCache("usuarios", usuarios);
   return usuarios;
}

async function create(usuario) {
   const existeEmail = await dao.findByEmail(usuario.email);

   if (existeEmail) {
      throw montarError(401, { email: ["Email já existente"] });
   }

   usuario.id = uuid.v4();

   const salt = parseInt(process.env.BCRYPT_SALT);
   const senhaHash = await bcrypt.hash(usuario.senha, salt);
   usuario.senha = senhaHash;

   const result = await dao.create(usuario);
   delete result.senha;

   await cache.removerDadosNaCache("usuarios");

   return result;
}

module.exports = {
   findAll,
   create,
   update: async (usuario) => await update(usuario),
};
