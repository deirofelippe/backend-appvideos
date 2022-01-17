require("dotenv").config();
const logger = require("../logger.js");
let redis = require("./redisInstance.js")();

async function buscarDadosNaCache(chave) {
   //antes de buscar tem q ver se existe
   try {
      const result = await redis.get(chave);
      return result && JSON.parse(result);
   } catch (error) {
      logger.error("[ERRO NA CACHE, BUSCAR]: " + error);
      return null;
   }
}

async function gravarDadosNaCache(chave, valor) {
   try {
      await redis.set(chave, JSON.stringify(valor));
   } catch (error) {
      logger.error("[ERRO NA CACHE, GRAVAR]: " + error);
      return null;
   }
}

async function removerDadosNaCache(chave) {
   try {
      await redis.del(chave);
   } catch (error) {
      logger.error("[ERRO NA CACHE, REMOVER]: " + error);
      return null;
   }
}

//.set(chave,valor,"EX",quatroDias);
//.exists(chave)

module.exports = {
   buscarDadosNaCache,
   gravarDadosNaCache,
   removerDadosNaCache,
};
