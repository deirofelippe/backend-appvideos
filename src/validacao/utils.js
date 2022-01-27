const tirarFormatacaoDoCPF = (cpf) => {
   const caractereQueNaoSejaNumero = /[^0-9]/g;
   const cpfSemFormato = cpf.replace(caractereQueNaoSejaNumero, "");
   return cpfSemFormato;
};

function montarMensagemDeErro({ inner: errors }) {
   let campo = {};
   let descricaoError = "";

   const errorsMsg = errors.reduce((msg, error) => {
      campo = error.path;
      descricaoError = error.errors[0];

      if (!(campo in msg)) {
         msg[campo] = [descricaoError];
         return msg;
      }

      msg[campo].push(descricaoError);
      return msg;
   }, {});

   return errorsMsg;
}

module.exports = {
   tirarFormatacaoDoCPF,
   montarMensagemDeErro,
};
