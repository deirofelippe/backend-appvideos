const logger = require("../../logger.js");
const schema = require("./update.schema.js");
const { montarMensagemDeErro, tirarFormatacaoDoCPF } = require("../utils.js");

async function validar(req, res, next) {
   const usuario = {
      ...req.body,
      id: req.params.id,
   };
   const cpf = usuario.cpf;

   const qtdPropriedades = Object.keys(usuario).length;

   if (qtdPropriedades <= 1) {
      const error = { msg: ["Não há campos para atualizar"] };

      return res.status(401).send({
         errors: error,
      });
   }

   try {
      await schema.validate(usuario, { abortEarly: false });

      if (cpf) {
         req.body.cpf = tirarFormatacaoDoCPF(cpf);
      }

      req.body = { ...usuario };
      delete req.body.senha;

      next();
   } catch (errors) {
      logger.error(errors);

      const errorsMsg = montarMensagemDeErro(errors);

      return res.status(401).send({ errors: errorsMsg });
   }
}

module.exports = validar;
