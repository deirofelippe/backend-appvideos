const dao = require("../../dao/usuario.dao.js");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const cache = require("../../cache");
const montarError = require("../../utils/montarError.js");
let kafkaConnection = require("../../kafka");
const logger = require("../../logger.js");

async function create(usuario) {
   const existeEmail = await dao.findByEmail(usuario.email);

   if (existeEmail) {
      throw montarError(401, { email: ["Email já existente"] });
   }

   usuario.id = uuid.v4();

   const salt = parseInt(process.env.BCRYPT_SALT);
   const senhaHash = await bcrypt.hash(usuario.senha, salt);
   usuario.senha = senhaHash;

   const { nome, email } = await dao.create(usuario);
   const usuarioCriado = { nome, email };

   await enviarMensagemKafka(usuarioCriado);

   await cache.removerDadosNaCache("usuarios");

   return usuarioCriado;
}

const enviarMensagemKafka = async ({ nome, email }) => {
   const producer = await kafkaConnection();

   const topic = process.env.KAFKA_TOPIC;

   const message = JSON.stringify({ nome, email });
   const record = {
      topic: topic,
      messages: [{ value: message }],
   };

   try {
      await producer.send(record);
      logger.info("[KAFKA SEND]:" + JSON.stringify(record));
   } catch (error) {
      logger.error("[KAFKA SEND ERROR]:" + error);
      throw montarError(500, { msg: ["Algo deu errado"] });
   }
};

module.exports = create;
