require("dotenv").config();
let logger = require("../logger.js");

let getInstance = () => require("./redisInstance.js")();

async function buscarDadosNaCache(chave) {
   const redis = getInstance();

   //antes de buscar tem q ver se existe
   try {
      const result = await redis.get(chave);
      return result && JSON.parse(result);
   } catch (error) {
      logger.error("[ERRO NA CACHE, BUSCAR]: " + error);
      return null;
   } finally {
      redis.disconnect();
   }
}

async function gravarDadosNaCache(chave, valor) {
   const redis = getInstance();

   try {
      await redis.set(chave, JSON.stringify(valor));
   } catch (error) {
      logger.error("[ERRO NA CACHE, GRAVAR]: " + error);
      return null;
   } finally {
      redis.disconnect();
   }
}

async function removerDadosNaCache(chave) {
   const redis = getInstance();

   try {
      await redis.del(chave);
   } catch (error) {
      logger.error("[ERRO NA CACHE, REMOVER]: " + error);
      return null;
   } finally {
      redis.disconnect();
   }
}

//.set(chave,valor,"EX",quatroDias);
//.exists(chave)

module.exports = {
   buscarDadosNaCache,
   gravarDadosNaCache,
   removerDadosNaCache,
};
