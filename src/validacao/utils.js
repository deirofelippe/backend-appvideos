const tirarFormatacaoDoCPF = (cpf) => {
   const caractereQueNaoSejaNumero = /[^0-9]/g;
   const cpfSemFormato = cpf.replace(caractereQueNaoSejaNumero, "");
   return cpfSemFormato;
};

module.exports = tirarFormatacaoDoCPF;
