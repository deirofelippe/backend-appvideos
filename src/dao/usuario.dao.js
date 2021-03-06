const model = require("../models/usuario.js");
const logger = require("../logger.js");
const montarError = require("../utils/montarError.js");

const formatarRetorno = (result) => result.dataValues;

async function findAll() {
   try {
      const results = await model.findAll();

      logger.info("Usuarios buscados: " + JSON.stringify(results));

      if (!results) return results;

      return results.map(formatarRetorno);
   } catch (error) {
      logger.error("[ERRO NO BD, FIND ALL]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function create(usuario) {
   try {
      const result = await model.create(usuario);

      logger.info("Usuario adicionado: " + JSON.stringify(result));
      return result.dataValues;
   } catch (error) {
      logger.error("[ERRO NO BD, CREATE]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function findByEmail(email) {
   try {
      const result = await model.findOne({ where: { email } });

      logger.info("Usuario buscado pelo email: " + JSON.stringify(result));
      return result?.dataValues;
   } catch (error) {
      logger.error("[ERRO NO BD, FIND BY EMAIL]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function findByCPF(cpf) {
   try {
      const result = await model.findOne({ where: { cpf } });

      logger.info("Usuario buscado pelo CPF: " + JSON.stringify(result));
      return result?.dataValues;
   } catch (error) {
      logger.error("[ERRO NO BD, FIND BY CPF]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function findById(id) {
   try {
      const result = await model.findOne({ where: { id } });

      logger.info("Usuario buscado: " + JSON.stringify(result));
      return result?.dataValues;
   } catch (error) {
      logger.error("[ERRO NO BD, FIND BY ID]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function update(novoUsuario) {
   try {
      const { id } = novoUsuario;
      const [status] = await model.update(novoUsuario, { where: { id } });
      return status;
   } catch (error) {
      logger.error("[ERRO NO BD, UPDATE]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function remove(id) {
   try {
      const result = await model.destroy({ where: { id } });

      logger.info("Usuario removido: " + JSON.stringify(result));
      return result;
   } catch (error) {
      logger.error("[ERRO NO BD, REMOVE]: " + error);
      throw montarError(500, { msg: ["Algo deu errado!"] });
   }
}

module.exports = {
   remove,
   update,
   findById,
   findByEmail,
   findByCPF,
   findAll,
   create,
};
