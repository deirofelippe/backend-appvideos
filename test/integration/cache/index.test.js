const {
   expect,
   describe,
   test,
   beforeAll,
   beforeEach,
} = require("@jest/globals");
const {
   buscarDadosNaCache,
   gravarDadosNaCache,
   removerDadosNaCache,
} = require("../../../src/cache");
const usuarioFactory = require("../../usuarioFactory");
const getRedisInstance = require("../../../src/cache/redisInstance");

jest.mock("../../../src/logger.js", () => ({
   error: () => ({}),
   info: () => ({}),
}));

describe("Cache com redis", () => {
   let redis;

   beforeAll(() => {
      redis = getRedisInstance();
   });

   beforeEach(async () => {
      await redis.set("usuarios", "");
   });

   describe("#buscarDadosNaCache", () => {
      test("Tem dados em cache", async () => {
         const usuarios = usuarioFactory(2);
         await redis.set("usuarios", JSON.stringify(usuarios));

         const result = await buscarDadosNaCache("usuarios");

         expect(result).toEqual(usuarios);
      });

      test("Não tem dados em cache", async () => {
         const result = await buscarDadosNaCache("usuarios");

         expect(result).toBeFalsy();
      });

      test("Deve ser lançado erro", async () => {
         const cacheRewire = require("rewire")("../../../src/cache");

         const error = "erro redis.get";

         const redisMock = {
            get: jest.fn().mockImplementation(() => {
               throw error;
            }),
         };

         cacheRewire.__set__("redis", redisMock);

         const buscarDadosNaCacheMock =
            cacheRewire.__get__("buscarDadosNaCache");

         const result = await buscarDadosNaCacheMock("usuarios");

         expect(result).toEqual(null);
      });
   });

   describe("#gravarDadosNaCache", () => {
      test("Deve gravar dados na cache", async () => {
         const usuarios = usuarioFactory(2);

         await gravarDadosNaCache("usuarios", usuarios);

         const result = await redis.get("usuarios");

         expect(result).toEqual(JSON.stringify(usuarios));
      });

      test("Deve ser lançado erro", async () => {
         const cacheRewire = require("rewire")("../../../src/cache");

         const error = "erro redis.set";

         const redisMock = {
            set: jest.fn().mockImplementation(() => {
               throw error;
            }),
         };

         cacheRewire.__set__("redis", redisMock);

         const gravarDadosNaCacheMock =
            cacheRewire.__get__("gravarDadosNaCache");

         const result = await gravarDadosNaCacheMock("usuarios");

         expect(result).toEqual(null);
      });
   });

   describe("#removerDadosNaCache", () => {
      test("Deve remover dados na cache", async () => {
         await redis.set("usuarios", "abcde");

         const resultGet1 = await redis.get("usuarios");
         expect(resultGet1).toEqual("abcde");

         await removerDadosNaCache("usuarios");

         const resultGet2 = await redis.get("usuarios");
         expect(resultGet2).toBeFalsy();
      });

      test("Deve ser lançado erro", async () => {
         const cacheRewire = require("rewire")("../../../src/cache");

         const error = "erro redis.set";

         const redisMock = {
            set: jest.fn().mockImplementation(() => {
               throw error;
            }),
         };

         cacheRewire.__set__("redis", redisMock);

         const removerDadosNaCacheMock = cacheRewire.__get__(
            "removerDadosNaCache"
         );

         const result = await removerDadosNaCacheMock("usuarios");

         expect(result).toEqual(null);
      });
   });
});
