const model = require("../models/usuario.js");
const logger = require("../logger.js");
const montarError = require("../utils/montarError.js");

const formatarRetorno = (result) => result?.dataValues;

async function findAll() {
   try {
      const results = await model.findAll();

      logger.info("Usuarios buscados: " + JSON.stringify(results));

      if (!results) return results;

      return results.map(formatarRetorno);
   } catch (error) {
      logger.error(error);
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
      logger.error(error);
      return montarError(500, { msg: ["Algo deu errado!"] });
   }
}

async function findById(id) {
   try {
      const result = await model.findByPk(id);

      logger.info("Usuario buscado: " + JSON.stringify(result));
      return result?.dataValues;
   } catch (error) {
      logger.error(error);
      return null;
   }
}

async function findToUpdate(id) {
   try {
      const result = await model.findByPk(id);

      logger.info(
         "Usuario buscado para ser atualizado: " + JSON.stringify(result)
      );
      return result;
   } catch (error) {
      logger.error(error);
      return null;
   }
}

async function update(novoUsuario) {
   try {
      const usuario = await findToUpdate(novoUsuario.id);
      usuario.dataValues = { ...usuario.dataValues, ...novoUsuario };
      const result = await usuario.save();

      logger.info("Usuario atualizado: " + JSON.stringify(result));
      return result;
   } catch (error) {
      logger.error(error);
      return null;
   }
}

async function remove(id) {
   try {
      const result = await model.destroy({ where: { id } });

      logger.info("Usuario removido: " + JSON.stringify(result));
      return result;
   } catch (error) {
      logger.error(error);
      return null;
   }
}

module.exports = {
   remove,
   update,
   findById,
   findByEmail,
   findAll,
   create,
};
