require("dotenv").config();
const logger = require("../logger.js");
const Redis = require("ioredis");
const montarError = require("../utils/montarError.js");
const redis = new Redis({
   port: process.env.REDIS_PORT || 6379,
   host: process.env.REDIS_HOST,
});

async function buscarDadosNaCache(chave) {
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
   }
}

async function removerDadosNaCache(chave) {
   try {
      await redis.set(chave, "");
   } catch (error) {
      logger.error("[ERRO NA CACHE, REMOVER]: " + error);
   }
}

module.exports = {
   buscarDadosNaCache,
   gravarDadosNaCache,
   removerDadosNaCache,
};
