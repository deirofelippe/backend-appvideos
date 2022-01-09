const update = require("./update.js");
const remove = require("./remove.js");
const create = require("./create.js");
const findAll = require("./findAll.js");

module.exports = {
   findAll: async () => await findAll(),
   create: async (usuario) => await create(usuario),
   update: async (usuario) => await update(usuario),
   remove: async (id) => await remove(id),
};
