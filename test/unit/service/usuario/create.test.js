const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const cache = require("../../../../src/cache");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");
const montarError = require("../../../../src/utils/montarError.js");

const uuid = require("uuid");
jest.mock("uuid");
uuid.v4.mockReturnValue("001");

describe("service.usuario", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#create", () => {
      test("Email já existente, deve lançar um erro", async () => {
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(true);

         const usuario = {};

         const expectedError = montarError(401, {
            email: ["Email já existente"],
         });

         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
         expect(dao.findByEmail).toHaveBeenCalledTimes(1);
      });

      test("dao.create deve lançar um erro", async () => {
         const usuario = usuarioFactory()[0];

         const error = { error: "BD CREATE" };
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(false);
         jest.spyOn(dao, dao.create.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;
         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
         expect(dao.create).toHaveBeenCalledTimes(1);
      });

      test("dao.findByEmail deve lançar um erro", async () => {
         const usuario = {};

         const error = { error: "BD FIND BY EMAIL" };
         jest.spyOn(dao, dao.findByEmail.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;
         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
      });

      test("Deve passa no teste e retornar um usuario", async () => {
         const bcrypt = require("bcrypt");

         jest.spyOn(cache, cache.removerDadosNaCache.name).mockImplementation();
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(false);
         jest
            .spyOn(bcrypt, bcrypt.hash.name)
            .mockImplementation((senha) => `hash -> ${senha}`);
         jest.spyOn(dao, dao.create.name).mockImplementation((usuario) => {
            return {
               ...usuario,
               createdAt: new Date(),
               updatedAt: new Date(),
            };
         });

         const usuario = usuarioFactory()[0];

         const id = "001";

         const expectedParams = {
            ...usuario,
            id,
            senha: `hash -> ${usuario.senha}`,
         };

         const result = await service.create(usuario);

         expect(dao.create).toHaveBeenCalledWith(expectedParams);
         expect(cache.removerDadosNaCache).toHaveBeenCalledWith("usuarios");
         expect(result.createdAt).toBeDefined();
         expect(result.updatedAt).toBeDefined();
         expect(result.senha).toBeUndefined();
      });
   });
});
