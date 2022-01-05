const logger = require("../logger.js");
const schema = require("./usuario.schema.js");
const tirarFormatacaoDoCPF = require("./utils.js");

async function validarUsuario(req, res, next) {
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

function montarMensagemDeErro({ inner: errors }) {
   let campo = {};

   const errorsMsg = errors.reduce((msg, error) => {
      campo = error.path;
      descricaoError = error.errors[0];

      if (!msg.hasOwnProperty(campo)) {
         msg[campo] = [descricaoError];
         return msg;
      }

      msg[campo].push(descricaoError);
      return msg;
   }, {});

   return errorsMsg;
}

module.exports = validarUsuario;
