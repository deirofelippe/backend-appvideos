const yup = require("yup");
const { cpf } = require("cpf-cnpj-validator");
const { setLocale } = require("yup");

setLocale({
   string: {
      email: "Email inválido",
      max: "Deve ter no maximo ${max} caracteres",
      min: "Deve ter no minimo ${min} caracteres",
      matches: "Está no formato inválido",
   },
   mixed: {
      required: "Campo deve ser preenchido",
   },
});

const optionsCPFehValido = {
   message: "CPF inválido",
   test: (cpfEnviado) => (cpfEnviado ? cpf.isValid(cpfEnviado) : true),
};

// ou o cpf é no formato 31286578078 ou 312.865.780-78
const regex = /(^[0-9]{11}$)|(^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$)/;

const schema = yup.object().shape({
   id: yup.string().uuid().required(),
   nome: yup.string().min(3).max(60),
   email: yup.string().email(),
   cpf: yup.string().test(optionsCPFehValido).matches(regex),
});

module.exports = schema;
