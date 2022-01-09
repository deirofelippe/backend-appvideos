const {
   describe,
   test,
   expect,
   afterAll,
   beforeAll,
   afterEach,
} = require("@jest/globals");
const connection = require("../../../src/database");
const dao = require("../../../src/dao/usuario.dao.js");
const usuarioFactory = require("../../usuarioFactory.js");
const model = require("../../../src/models/usuario.js");
const montarError = require("../../../src/utils/montarError");
const truncate = require("../../truncate.js");

jest.mock("../../../src/logger.js");

describe("usuario.dao", () => {
   afterEach(async () => {
      jest.restoreAllMocks();
      await truncate(connection.models);
   });

   beforeAll(async () => await connection.sync());
   afterAll(async () => await connection.close());

   const error = montarError(500, { msg: ["Algo deu errado!"] });

   describe("#findByCPF", () => {
      test("Deve encontrar o usuario com o cpf procurado", async () => {
         const usuario = usuarioFactory()[0];

         await model.create(usuario);
         const { createdAt, updatedAt, ...result } = await dao.findByCPF(
            usuario.cpf
         );

         expect(result).toEqual(usuario);
      });

      test("Não deve encontrar o usuario com o cpf procurado", async () => {
         const { cpf } = usuarioFactory()[0];
         const result = await dao.findByCPF(cpf);

         expect(result).toEqual(undefined);
      });

      test("Deve lancar um erro", async () => {
         const cpf = "";

         jest.spyOn(model, model.findOne.name).mockImplementation(() => {
            throw error;
         });

         const findByCPF = async () => await dao.findByCPF(cpf);

         await expect(findByCPF).rejects.toEqual(error);
      });
   });

   describe("#findByEmail", () => {
      test("Deve encontrar o usuario com o email procurado", async () => {
         const usuario = usuarioFactory()[0];

         await model.create(usuario);
         const { createdAt, updatedAt, ...result } = await dao.findByEmail(
            usuario.email
         );

         expect(result).toEqual(usuario);
      });
      test("Não deve encontrar o usuario com o email procurado", async () => {
         const { email } = usuarioFactory()[0];

         const result = await dao.findByEmail(email);

         expect(result).toEqual(undefined);
      });
      test("Deve lancar um erro", async () => {
         const email = "";

         jest.spyOn(model, model.findOne.name).mockImplementation(() => {
            throw error;
         });

         const findByEmail = async () => await dao.findByEmail(email);

         await expect(findByEmail).rejects.toEqual(error);
      });
   });

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

         jest.spyOn(model, model.create.name).mockImplementation(() => {
            throw "";
         });

         const expectedError = error;

         const create = async () => await dao.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
      });
   });

   describe("#findAll", () => {
      test("Deve retornar usuarios", async () => {
         const usuarios = usuarioFactory(3);

         const result1 = await dao.findAll();

         expect(result1).toHaveLength(0);

         await dao.create(usuarios[0]);
         await dao.create(usuarios[1]);
         await dao.create(usuarios[2]);

         const result2 = await dao.findAll();

         expect(result2).toHaveLength(3);
      });

      test("Não deve retornar usuarios", async () => {
         const result = await dao.findAll();
         expect(result).toHaveLength(0);
      });

      test("Deve lancar um erro", async () => {
         jest.spyOn(model, model.findAll.name).mockImplementation(() => {
            throw "";
         });

         const expectedError = error;

         const findAll = async () => await dao.findAll();

         await expect(findAll).rejects.toEqual(expectedError);
      });
   });

   describe("#findById", () => {
      test("Deve encontrar o usuario com o id procurado", async () => {
         const usuario = usuarioFactory()[0];
         await model.create(usuario);

         const { createdAt, updatedAt, ...usuarioBuscado } = await dao.findById(
            usuario.id
         );

         expect(usuarioBuscado).toEqual(usuario);
      });

      test("Não deve encontrar o usuario com o id procurado", async () => {
         const usuario = usuarioFactory()[0];
         jest.spyOn(model, model.findOne.name).mockResolvedValue(undefined);
         const result = await dao.findById(usuario.id);
         expect(result).toBeUndefined();
      });

      test("Deve lancar um erro", async () => {
         jest.spyOn(model, model.findOne.name).mockImplementation(() => {
            throw "error";
         });

         const expectedError = error;

         const id = "";
         const findById = async () => await dao.findById(id);

         await expect(findById).rejects.toEqual(expectedError);
      });
   });

   describe("#update", () => {
      test("Deve atualizar o usuario", async () => {
         const usuario = usuarioFactory()[0];
         const usuarioModel = await model.create(usuario);

         const { senha, ...usuarioPraAtualizar } = usuario;

         const faker = require("faker");
         const novoNome = faker.name.findName();
         const novoEmail = faker.internet.email();
         usuarioPraAtualizar.nome = novoNome;
         usuarioPraAtualizar.email = novoEmail;

         jest.spyOn(model, model.findByPk.name).mockResolvedValue(usuarioModel);

         const usuarioAtualizado = await dao.update(usuarioPraAtualizar);

         expect(usuarioAtualizado.nome).toEqual(novoNome);
         expect(usuarioAtualizado.email).toEqual(novoEmail);
      });

      test("Deve lancar um erro", async () => {
         const usuario = usuarioFactory()[0];
         const usuarioModel = await model.create(usuario);

         usuarioModel.save = jest.fn().mockImplementation(() => {
            throw "error";
         });

         jest.spyOn(model, model.findByPk.name).mockResolvedValue(usuarioModel);

         const expectedError = error;

         const update = async () => await dao.update(usuario);

         await expect(update).rejects.toEqual(expectedError);
      });
   });

   describe("#remove", () => {
      test("Deve remover o usuario", async () => {
         const expectedList1 = await dao.findAll();

         expect(expectedList1).toHaveLength(0);

         const usuario = usuarioFactory()[0];
         await model.create(usuario);
         const expectedList2 = await dao.findAll();

         expect(expectedList2).toHaveLength(1);

         const result = await dao.remove(usuario.id);
         const expectedList3 = await dao.findAll();

         expect(result).toBeTruthy();
         expect(expectedList3).toHaveLength(0);
      });

      test("Deve lancar um erro", async () => {
         const usuario = { id: "" };

         jest.spyOn(model, model.destroy.name).mockImplementation(() => {
            throw "error";
         });

         const remove = async () => await dao.remove(usuario.id);

         const expectedError = error;

         await expect(remove).rejects.toEqual(expectedError);
      });
   });
});
