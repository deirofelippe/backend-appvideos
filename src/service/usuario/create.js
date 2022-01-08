const dao = require("../../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../../cache");
const montarError = require("../../utils/montarError.js");

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

module.exports = create;