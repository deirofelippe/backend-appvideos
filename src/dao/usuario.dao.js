const model = require("../models/usuario.js");
const logger = require("../logger.js");

async function findAll() {
   try {
      const results = await model.findAll();
      const usuarios = results.map((result) => result.dataValues);

      logger.info("Usuarios buscados!");
      return usuarios;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

async function create(usuario) {
   try {
      const { dataValues: result } = await model.create(usuario);
      logger.info("Usuario adicionado!");
      return result;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

async function findById(id) {
   try {
      const { dataValues: result } = await model.findByPk(id);
      logger.info("Usuario buscado!");
      return result;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

async function findToUpdate(id) {
   try {
      const result = await model.findByPk(id);
      logger.info("Usuario buscado para ser atualizado!");
      return result;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

async function update(novoUsuario) {
   try {
      const usuario = await findToUpdate(novoUsuario.id);
      usuario.dataValues = { ...usuario.dataValues, ...novoUsuario };
      const result = await usuario.save();
      logger.info("Usuario atualizado!");
      return result;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

async function remove(id) {
   try {
      const result = await model.destroy({ where: { id } });
      logger.info("Usuario removido!");
      return result;
   } catch (error) {
      logger.error(error);
      throw new Error(error);
   }
}

module.exports = {
   remove,
   update,
   findById,
   findAll,
   create,
};
