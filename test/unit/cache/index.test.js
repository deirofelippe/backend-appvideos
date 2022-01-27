const { expect, describe, test, beforeEach } = require("@jest/globals");
const rewire = require("rewire");

describe("Cache com redis", () => {
   let error = "";

   const loggerMock = { error: jest.fn() };

   beforeEach(() => {
      jest.clearAllMocks();
      error = "";
   });

   describe("#buscarDadosNaCache", () => {
      test("Deve ser lançado erro", async () => {
         const cacheRewire = rewire("../../../src/cache");

         error = "erro redis.get";

         let redisMock = () => ({
            disconnect: jest.fn(),
            get: jest.fn().mockImplementation(() => {
               throw error;
            }),
         });

         cacheRewire.__set__({ getInstance: redisMock, logger: loggerMock });

         const buscarDadosNaCacheMock =
            cacheRewire.__get__("buscarDadosNaCache");

         const result = await buscarDadosNaCacheMock("usuarios");

         const errorBase = "[ERRO NA CACHE, BUSCAR]: ";

         expect(result).toEqual(null);
         expect(loggerMock.error).toBeCalledWith(errorBase + error);
      });
   });

   describe("#gravarDadosNaCache", () => {
      test("Deve ser lançado erro", async () => {
         const cacheRewire = rewire("../../../src/cache");

         error = "erro redis.set";

         let redisMock = () => ({
            disconnect: jest.fn(),
            set: jest.fn().mockImplementation(() => {
               throw error;
            }),
         });

         cacheRewire.__set__({ getInstance: redisMock, logger: loggerMock });

         const gravarDadosNaCacheMock =
            cacheRewire.__get__("gravarDadosNaCache");

         const result = await gravarDadosNaCacheMock("usuarios");

         const errorBase = "[ERRO NA CACHE, GRAVAR]: ";

         expect(result).toEqual(null);
         expect(loggerMock.error).toBeCalledWith(errorBase + error);
      });
   });

   describe("#removerDadosNaCache", () => {
      test("Deve ser lançado erro", async () => {
         const cacheRewire = rewire("../../../src/cache");

         error = "erro redis.del";

         let redisMock = () => ({
            disconnect: jest.fn(),
            del: jest.fn().mockImplementation(() => {
               throw error;
            }),
         });

         cacheRewire.__set__({ getInstance: redisMock, logger: loggerMock });

         const removerDadosNaCacheMock = cacheRewire.__get__(
            "removerDadosNaCache"
         );

         const result = await removerDadosNaCacheMock("usuarios");

         const errorBase = "[ERRO NA CACHE, REMOVER]: ";

         expect(result).toEqual(null);
         expect(loggerMock.error).toBeCalledWith(errorBase + error);
      });
   });
});
