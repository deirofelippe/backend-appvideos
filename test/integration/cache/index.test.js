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
      await redis.flushall();
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
   });

   describe("#gravarDadosNaCache", () => {
      test("Deve gravar dados na cache", async () => {
         const usuarios = usuarioFactory(2);

         await gravarDadosNaCache("usuarios", usuarios);

         const result = await redis.get("usuarios");

         expect(result).toEqual(JSON.stringify(usuarios));
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
   });
});
