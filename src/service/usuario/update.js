let dao = require("../../dao/usuario.dao.js");
let cache = require("../../cache");
let montarError = require("../../utils/montarError.js");

async function update(usuario) {
   const { cpf, email, id } = usuario;

   await verificarSePodeUsarCPF(id, cpf);

   await verificarSePodeUsarEmail(id, email);

   await dao.update(usuario);

   await cache.removerDadosNaCache("usuarios");
   await cache.removerDadosNaCache(`usuario:${id}`);
}

async function verificarSePodeUsarCPF(id, cpf) {
   if (!cpf) return;

   const usuarioEncontrado = await dao.findByCPF(cpf);

   if (!usuarioEncontrado) return;

   if (usuarioEncontrado.id !== id) {
      throw montarError(401, { cpf: ["CPF não pode ser usado"] });
   }
}

async function verificarSePodeUsarEmail(id, email) {
   if (!email) return;

   const usuarioEncontrado = await dao.findByEmail(email);

   if (!usuarioEncontrado) return;

   if (usuarioEncontrado.id !== id) {
      throw montarError(401, { email: ["Email não pode ser usado"] });
   }
}

module.exports = update;
