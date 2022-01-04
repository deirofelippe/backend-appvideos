const {
   describe,
   test,
   expect,
   afterAll,
   beforeAll,
} = require("@jest/globals");
const connection = require("../../../src/database");
const dao = require("../../../src/dao/usuario.dao.js");
const usuarioFactory = require("../../usuarioFactory.js");
const logger = require("../../../src/logger.js");
const montarError = require("../../../src/utils/montarError");

jest.spyOn(logger, "info").mockImplementation();
jest.spyOn(logger, "error").mockImplementation();

describe("usuario.dao", () => {
   beforeAll(async () => await connection.sync());

   afterAll(async () => await connection.close());

   test.todo("#findByEmail Deve encontrar o usuario com o email procurado");
   test.todo("#findByEmail Não deve encontrar o usuario com o email procurado");
   test.todo("#findByEmail Deve lancar um erro");

   test.todo("#findById Deve encontrar o usuario com o id procurado");
   test.todo("#findById Não deve encontrar o usuario com o id procurado");
   test.todo("#findById Deve lancar um erro");

   test.todo("#findByIdToUpdate Deve encontrar o usuario com o id procurado");
   test.todo("#findByIdToUpdate Deve lancar um erro");

   test.todo("#update Deve atualizar o usuario");
   test.todo("#update Deve lancar um erro");

   test.todo("#remove Deve remover o usuario");
   test.todo("#remove Deve lancar um erro");

   describe("#create", () => {
      test("Deve criar o usuario e retornar", async () => {
         const usuario = usuarioFactory()[0];
         const { createdAt, updatedAt, ...result } = await dao.create(usuario);

         expect(result).toEqual(usuario);
         expect(createdAt).toBeDefined();
         expect(updatedAt).toBeDefined();
      });

      test("Deve lancar um erro", async () => {
         const usuario = usuarioFactory()[0];

         const error = montarError(500, { msg: ["Algo deu errado!"] });

         jest.spyOn(dao, dao.create.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;

         const create = async () => await dao.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
      });
   });

   describe("#findAll", () => {
      test.only("Deve retornar usuarios", async () => {
         const usuarios = usuarioFactory(3);

         const result1 = await dao.findAll();

         expect(result1).toHaveLength(0);

         await dao.create(usuarios[0]);
         await dao.create(usuarios[1]);
         await dao.create(usuarios[2]);

         const result2 = await dao.findAll();

         expect(result2).toHaveLength(3);
      });

      test.todo("#findAll Não deve retornar usuarios");
      test.todo("#findAll Deve lancar um erro");
   });

   describe("#findById", () => {
      test("", async () => {
         const usuarioEsperado = usuarioFactory();
         await dao.create(usuarioEsperado);
         await dao.create(usuarioFactory());

         const usuario = await dao.findById(usuarioEsperado.id);

         expect(usuario).toEqual(expect.objectContaining(usuarioEsperado));
      });
   });

   describe("#update", () => {
      test("", async () => {
         const usuario = usuarioFactory();
         await dao.create(usuario);

         const novoUsuario = { ...usuario, nome: "abc" };
         const usuarioAtualizado = await dao.update(novoUsuario);

         expect(usuarioAtualizado).toEqual(
            expect.objectContaining(novoUsuario)
         );
      });
   });

   describe("#remove", () => {
      test("", async () => {
         const usuario = usuarioFactory();
         await dao.create(usuario);
         let result = await dao.findAll();
         expect(result).toHaveLength(1);

         await dao.remove(usuario.id);
         result = await dao.findAll();
         expect(result).toHaveLength(0);
      });
   });
});
