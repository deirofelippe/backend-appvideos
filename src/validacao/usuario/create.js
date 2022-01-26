const logger = require("../../logger.js");
const schema = require("./create.schema.js");
const { montarMensagemDeErro, tirarFormatacaoDoCPF } = require("../utils.js");
const usuarioFactory = require("../../../test/usuarioFactory.js");

async function validar(req, res, next) {
   const u = usuarioFactory()[0];
   if (req.body?.random === "1") req.body = { ...u };

   const usuario = req.body;
   const cpf = usuario.cpf;

   try {
      await schema.validate(usuario, { abortEarly: false });

      req.body.cpf = tirarFormatacaoDoCPF(cpf);

      next();
   } catch (errors) {
      logger.error(JSON.stringify(errors));

      const errorsMsg = montarMensagemDeErro(errors);

      res.status(401).send({ errors: errorsMsg });
   }
}

module.exports = validar;
