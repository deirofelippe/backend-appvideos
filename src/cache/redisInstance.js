require("dotenv").config();

function getInstance() {
   const Redis = require("ioredis");
   const port = parseInt(process.env.REDIS_PORT);
   return new Redis({
      port: port || 6379,
      host: process.env.REDIS_HOST || "redis",
   });
}

module.exports = getInstance;
