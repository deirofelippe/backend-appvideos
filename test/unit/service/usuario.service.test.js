const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../usuarioFactory.js");
const cache = require("../../../src/cache");
const service = require("../../../src/service/usuario");
const dao = require("../../../src/dao/usuario.dao.js");
const montarError = require("../../../src/utils/montarError.js");

const uuid = require("uuid");
jest.mock("uuid");
uuid.v4.mockReturnValue("001");

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
