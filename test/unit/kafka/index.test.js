const { describe, test, expect, beforeEach } = require("@jest/globals");
const montarError = require("../../../src/utils/montarError.js");
const rewire = require("rewire");

describe("Kafka connection", () => {
   describe("#run", () => {
      test("Deve lancar um erro", async () => {
         const runKafkaRewire = rewire("../../../src/kafka/index.js");

         const connection = jest.fn().mockImplementation(() => {
            throw "error connection";
         });

         runKafkaRewire.__set__("connection", connection);

         const run = runKafkaRewire.__get__("run");

         const expectedError = montarError(500, { msg: ["Algo deu errado"] });

         const kafkaConnectionRun = async () => await run();

         await expect(kafkaConnectionRun).rejects.toEqual(expectedError);
      });
   });
});
