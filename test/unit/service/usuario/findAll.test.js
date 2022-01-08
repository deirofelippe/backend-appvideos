const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const cache = require("../../../../src/cache");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");

describe("usuario.service", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#findAll", () => {
      test("Deve retornar os usuarios em cache", async () => {
         const usuarios = usuarioFactory(3);

         jest.spyOn(dao, dao.findAll.name);
         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(usuarios);

         const result = await service.findAll();

         expect(result).toHaveLength(3);
         expect(dao.findAll).toHaveBeenCalledTimes(0);
      });

      test("Deve ser lançado um erro no dao.findAll", async () => {
         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         const error = { error: "BD FIND ALL" };

         jest.spyOn(dao, dao.findAll.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;

         const findAll = async () => await service.findAll();

         await expect(findAll).rejects.toEqual(expectedError);
      });

      test("Não deve ser retornado usuario no dao.findAll", async () => {
         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         jest.spyOn(dao, dao.findAll.name).mockResolvedValue([]);

         const result = await service.findAll();
         expect(result).toHaveLength(0);
      });

      test("Deve ser retornado usuarios no dao.findAll", async () => {
         const usuarios = usuarioFactory(3);

         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         jest.spyOn(dao, dao.findAll.name).mockResolvedValue(usuarios);
         jest.spyOn(cache, cache.gravarDadosNaCache.name).mockImplementation();

         const result = await service.findAll();

         expect(cache.gravarDadosNaCache).toHaveBeenCalledWith(
            "usuarios",
            usuarios
         );
         expect(result).toHaveLength(3);
      });
   });
});
