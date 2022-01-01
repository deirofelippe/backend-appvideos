const logger = require("../logger.js");
const service = require("../service/usuario.service.js");

async function findAll(req, res) {
   try {
      const result = await service.findAll();
      res.status(200).json(result);
   } catch (error) {
      const { status, errors } = error;
      res.status(status).json(errors);
   }
}

async function create(req, res) {
   try {
      const result = await service.create(req.body);
      res.status(200).json(result);
   } catch (error) {
      const { status, errors } = error;
      res.status(status).json(errors);
   }
}

module.exports = {
   findAll,
   create,
};
