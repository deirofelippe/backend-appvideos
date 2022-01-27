const logger = require("../logger");
const Redis = require("ioredis");

require("dotenv").config();

function getInstance() {
   try {
      const port = parseInt(process.env.REDIS_PORT);
      return new Redis({
         connectTimeout: 1000,
         port: port || 6379,
         host: process.env.REDIS_HOST || "redis",
      });
   } catch (error) {
      logger.error("[ERRO DE CONEXAO REDIS]: " + error);
      return null;
   }
}

module.exports = getInstance;
