const { expect, describe, test } = require("@jest/globals");
const redisInstance = require("../../../src/cache/redisInstance.js");

const logger = require("../../../src/logger.js");

jest.mock("../../../src/logger.js", () => ({
   error: jest.fn(),
}));

jest.mock("ioredis", () => () => jest.fn());

describe("Redis", () => {
   describe("#getInstance", () => {
      test("Deve ser lançado erro", async () => {
         const execute = async () => await redisInstance();

         await expect(execute()).resolves.toBeNull();

         const errorMessage =
            "[ERRO DE CONEXAO REDIS]: TypeError: Redis is not a constructor";

         expect(logger.error).toBeCalledWith(errorMessage);
      });
   });
});
