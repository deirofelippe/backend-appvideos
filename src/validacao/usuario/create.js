const logger = require("../../logger.js");
const schema = require("./create.schema.js");
const { montarMensagemDeErro, tirarFormatacaoDoCPF } = require("../utils.js");

async function validar(req, res, next) {
   const usuario = req.body;
   const cpf = usuario.cpf;

   try {
      await schema.validate(usuario, { abortEarly: false });

      req.body.cpf = tirarFormatacaoDoCPF(cpf);

      next();
   } catch (errors) {
      logger.error(errors);

      const errorsMsg = montarMensagemDeErro(errors);

      res.status(401).send({ errors: errorsMsg });
   }
}

module.exports = validar;
