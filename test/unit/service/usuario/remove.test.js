const { describe, test, expect, beforeEach } = require("@jest/globals");
const cache = require("../../../../src/cache");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");

describe("service.usuario", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#remove", () => {
      test("Deve lançar um erro em dao.remove", async () => {
         const error = "erro ao remover";
         jest.spyOn(dao, dao.remove.name).mockImplementation(() => {
            throw error;
         });

         const id = "001";

         const remove = async () => await service.remove(id);

         await expect(remove).rejects.toEqual(error);
      });

      test("Deve conseguir remover o usuario", async () => {
         jest.spyOn(cache, cache.removerDadosNaCache.name);
         jest.spyOn(dao, dao.remove.name).mockResolvedValue(1);

         const id = "001";

         const result = await service.remove(id);

         expect(dao.remove).toHaveBeenCalledWith(id);
         expect(cache.removerDadosNaCache).toHaveBeenCalledWith("usuarios");
         expect(result).toBeTruthy();
      });
   });
});
