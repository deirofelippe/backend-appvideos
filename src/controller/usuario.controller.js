const service = require("../service/usuario");
const usuarioFactory = require("../../test/usuarioFactory.js");

async function findAll(req, res) {
   try {
      const result = await service.findAll();
      res.status(200).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function create(req, res) {
   const u = usuarioFactory()[0];
   if (req.body?.random === "1") req.body = { ...u };

   try {
      const result = await service.create(req.body);
      res.status(201).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function update(req, res) {
   try {
      const result = await service.update(req.body);
      res.status(200).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function remove(req, res) {
   try {
      const result = await service.remove(req.body);
      res.status(204).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

module.exports = {
   findAll,
   create,
   update,
   remove,
};
