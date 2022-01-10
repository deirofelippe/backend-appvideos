const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const cache = require("../../../../src/cache");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");

describe("service.usuario", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#findById", () => {
      test("Deve retornar o usuario em cache", async () => {
         const usuario = usuarioFactory()[0];
         const id = usuario.id;

         jest.spyOn(dao, dao.findById.name);
         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(usuario);

         const result = await service.findById({ id });

         expect(result).toEqual(usuario);
         expect(cache.buscarDadosNaCache).toHaveBeenCalledWith(`usuario:${id}`);
         expect(dao.findById).toHaveBeenCalledTimes(0);
      });

      test("Deve ser lançado um erro no dao.findById", async () => {
         const id = "001";

         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         const error = { error: "BD FIND BY ID" };

         jest.spyOn(dao, dao.findById.name).mockImplementation(() => {
            throw error;
         });

         const findById = async () => await service.findById({ id });

         await expect(findById).rejects.toEqual(error);
         expect(dao.findById).toHaveBeenCalledWith(id);
      });

      test("Não deve ser retornado usuario no dao.findById", async () => {
         const id = "001";
         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         jest.spyOn(dao, dao.findById.name).mockResolvedValue({});

         const result = await service.findById({ id });

         expect(result).toEqual({});
         expect(dao.findById).toHaveBeenCalledWith(id);
      });

      test("Deve ser retornado o usuario no dao.findById", async () => {
         const usuario = usuarioFactory()[0];
         const id = usuario.id;

         jest
            .spyOn(cache, cache.buscarDadosNaCache.name)
            .mockResolvedValue(false);

         jest.spyOn(dao, dao.findById.name).mockResolvedValue(usuario);
         jest.spyOn(cache, cache.gravarDadosNaCache.name);

         const result = await service.findById({ id });

         delete usuario.senha;

         expect(cache.gravarDadosNaCache).toHaveBeenCalledWith(
            `usuario:${id}`,
            usuario
         );
         expect(cache.buscarDadosNaCache).toHaveBeenCalledWith(`usuario:${id}`);
         expect(dao.findById).toHaveBeenCalledWith(id);
         expect(result).toEqual(usuario);
      });
   });
});
