require("dotenv").config();

function getInstance() {
   const Redis = require("ioredis");
   return new Redis({
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST,
   });
}

module.exports = getInstance;
