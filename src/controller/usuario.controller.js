const service = require("../service/usuario.service.js");

async function findAll(req, res) {
   const result = await service.findAll();
   res.json(result);
}

async function create(req, res) {
   const result = await service.create(req.body);
   res.json(result);
}

module.exports = {
   findAll,
   create,
};
