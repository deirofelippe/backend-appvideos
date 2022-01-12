const yup = require("yup");
const { setLocale } = require("yup");

setLocale({
   string: {
      uuid: "ID inválido",
   },
   mixed: {
      required: "Campo deve ser preenchido",
   },
});

const schema = yup.object().shape({
   id: yup.string().uuid().required(),
});

module.exports = schema;
