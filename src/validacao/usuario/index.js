const createValidacao = require("./create.js");
const removeValidacao = require("./remove.js");
const findByIdValidacao = require("./findById.js");
const updateValidacao = require("./update.js");

module.exports = {
   create: createValidacao,
   remove: removeValidacao,
   findById: findByIdValidacao,
   update: updateValidacao,
};
