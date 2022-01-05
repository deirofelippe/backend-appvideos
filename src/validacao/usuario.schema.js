const yup = require("yup");
const { cpf } = require("cpf-cnpj-validator");
const { setLocale } = require("yup");
const dao = require("../dao/usuario.dao.js");
const tirarFormatacaoDoCPF = require("./utils.js");

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

const cpfPodeSerUsado = async (cpfEnviado) => {
   if (!cpfEnviado) return true;

   const cpf = tirarFormatacaoDoCPF(cpfEnviado);

   const encontrouCPF = await dao.findByCPF(cpf);

   let liberadoPraUso;

   if (encontrouCPF) {
      liberadoPraUso = false;
      return liberadoPraUso;
   }
   liberadoPraUso = true;
   return liberadoPraUso;
};

const optionsCpfPodeSerUsado = {
   message: "CPF já existe",
   test: cpfPodeSerUsado,
};

const emailPodeSerUsado = async (emailEnviado) => {
   if (!emailEnviado) return true;

   const encontrouCPF = await dao.findByEmail(emailEnviado);

   let liberadoPraUso;

   if (encontrouCPF) {
      liberadoPraUso = false;
      return liberadoPraUso;
   }
   liberadoPraUso = true;
   return liberadoPraUso;
};

const optionsEmailPodeSerUsado = {
   message: "Email já existe",
   test: emailPodeSerUsado,
};

const optionsCPFehValido = {
   message: "CPF inválido",
   test: (cpfEnviado) => cpf.isValid(cpfEnviado),
};

// ou o cpf é no formato 31286578078 ou 312.865.780-78
const regex = /(^[0-9]{11}$)|(^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$)/;

const schema = yup.object().shape({
   nome: yup.string().min(3).max(60).required(),
   email: yup.string().email().test(optionsEmailPodeSerUsado).required(),
   senha: yup.string().min(8).required(),
   cpf: yup
      .string()
      .test(optionsCPFehValido)
      .matches(regex)
      .test(optionsCpfPodeSerUsado)
      .required(),
});

module.exports = schema;
