const montarError = (status, msg) => {
   return {
      status,
      errors: msg,
   };
};

module.exports = montarError;
