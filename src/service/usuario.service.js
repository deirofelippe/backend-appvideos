const dao = require("../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../cache");
const montarError = require("../utils/montarError.js");

async function findAll() {
   const usuariosCache = await cache.buscarDadosNaCache("usuarios");
   if (usuariosCache) return usuariosCache;

   const usuarios = await dao.findAll();
   if (!usuarios) return usuarios;

   await cache.gravarDadosNaCache("usuarios", usuarios);
   return usuarios;
}

async function create(usuario) {
   const existeEmail = await dao.findByEmail(usuario.email);
   if (existeEmail) throw montarError(401, { email: ["Email já existente"] });

   usuario.id = uuid.v4();

   const salt = parseInt(process.env.BCRYPT_SALT);
   const senhaHash = await bcrypt.hash(usuario.senha, salt);
   usuario.senha = senhaHash;

   try {
      const { senha, ...result } = await dao.create(usuario);
      await cache.removerDadosNaCache("usuarios");

      return result;
   } catch (error) {
      throw error;
   }
}

module.exports = {
   findAll,
   create,
};
