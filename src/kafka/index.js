const { Kafka } = require("kafkajs");
let logger = require("../logger");
const montarError = require("../utils/montarError");

async function connection() {
   const url = process.env.KAFKA_URL;

   const kafka = new Kafka({ brokers: [url] });

   const producer = kafka.producer();

   await producer.connect();

   return producer;
}

async function run() {
   try {
      return await connection();
   } catch (error) {
      logger.error("[KAFKA CONNECTION ERROR]:" + error);
      throw montarError(500, { msg: ["Algo deu errado"] });
   }
}

module.exports = run;
