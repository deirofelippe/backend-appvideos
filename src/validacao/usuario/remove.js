const logger = require("../../logger.js");
const schema = require("./remove.schema.js");
const { montarMensagemDeErro } = require("../utils.js");

async function validar(req, res, next) {
   const id = req.params.id;

   try {
      await schema.validate({ id }, { abortEarly: false });

      next();
   } catch (errors) {
      logger.error(errors);

      const errorsMsg = montarMensagemDeErro(errors);

      res.status(401).send({ errors: errorsMsg });
   }
}

module.exports = validar;
