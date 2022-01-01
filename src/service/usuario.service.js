const dao = require("../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../cache");

async function findAll() {
   const usuariosCache = await cache.buscarDadosNaCache("usuarios");
   if (usuariosCache) return usuariosCache;

   const usuarios = await dao.findAll();
   if (!usuarios) return usuarios;

   await cache.gravarDadosNaCache("usuarios", usuarios);
   return usuarios;
}

async function create(usuario) {
   const existeEmail = dao.findByEmail(usuario.email);
   if (existeEmail)
      throw { status: 401, errors: { email: ["Email já existente"] } };

   usuario.id = uuid.v4();

   const salt = parseInt(process.env.BCRYPT_SALT);
   const senhaHash = await bcrypt.hash(usuario.senha, salt);
   usuario.senha = senhaHash;

   const { senha, ...rest } = await dao.create(usuario);
   await cache.removerDadosNaCache("usuarios");
   return rest;
}

module.exports = {
   findAll,
   create,
};
