const pino = require("pino");
const pretty = require("pino-pretty");

const emTeste = process.env.NODE_ENV === "test";
const sync = emTeste ? true : false;

const logger = pino(
   pretty({
      colorize: true,
      ignore: "pid,hostname",
      sync: sync,
   })
);

module.exports = logger;
