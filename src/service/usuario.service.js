const dao = require("../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../cache");
const montarError = require("../utils/montarError.js");

async function findAll() {
   const temUsuarioNaCache = await cache.buscarDadosNaCache("usuarios");
   if (temUsuarioNaCache) return temUsuarioNaCache;

   let usuarios;
   try {
      usuarios = await dao.findAll();
   } catch (error) {
      throw error;
   }

   if (!usuarios) return usuarios;

   await cache.gravarDadosNaCache("usuarios", usuarios);
   return usuarios;
}

async function create(usuario) {
   let existeEmail;

   try {
      existeEmail = await dao.findByEmail(usuario.email);
   } catch (error) {
      throw error;
   }

   if (existeEmail) {
      throw montarError(401, { email: ["Email já existente"] });
   }

   usuario.id = uuid.v4();

   const salt = parseInt(process.env.BCRYPT_SALT);
   const senhaHash = await bcrypt.hash(usuario.senha, salt);
   usuario.senha = senhaHash;

   let result;
   try {
      result = await dao.create(usuario);
      delete result.senha;
   } catch (error) {
      throw error;
   }

   await cache.removerDadosNaCache("usuarios");

   return result;
}

module.exports = {
   findAll,
   create,
};
