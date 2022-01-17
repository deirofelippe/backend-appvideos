const service = require("../service/usuario");

async function findAll(req, res) {
   try {
      const result = await service.findAll();
      res.status(200).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function create(req, res) {
   try {
      const result = await service.create(req.body);
      res.status(201).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function update(req, res) {
   const usuario = {
      id: req.params.id,
      ...req.body,
   };

   try {
      await service.update(usuario);
      res.status(204).end();
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function remove(req, res) {
   try {
      const result = await service.remove(req.params);
      res.status(204).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

async function findById(req, res) {
   try {
      const result = await service.findById(req.params);
      res.status(200).json(result);
   } catch ({ status, errors }) {
      res.status(status).json({ errors });
   }
}

module.exports = {
   findAll,
   create,
   update,
   remove,
   findById,
};
