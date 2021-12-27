const yup = require("yup");
const { setLocale } = require("yup");
const logger = require("../logger.js");

setLocale({
   string: {
      email: "Email inválido",
      max: "Deve ter no maximo ${max} caracteres",
      min: "Deve ter no minimo ${min} caracteres",
   },
   mixed: {
      required: "Campo deve ser preenchido",
   },
});

const schema = yup.object().shape({
   nome: yup.string().min(3).max(50).required(),
   email: yup.string().email().required(),
});

async function validarUsuario(req, res, next) {
   const usuario = req.body;

   try {
      await schema.validate(usuario, { abortEarly: false });
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
