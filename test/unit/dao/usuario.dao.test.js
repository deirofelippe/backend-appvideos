const {
   describe,
   test,
   expect,
   afterAll,
   beforeEach,
   beforeAll,
} = require("@jest/globals");
const connection = require("../../../src/database");
const usuarioDao = require("../../../src/dao/usuario.dao.js");
const usuarioFactory = require("../../usuarioFactory.js");
const truncate = require("../../truncate.js");
const logger = require("../../../src/logger.js");

beforeAll(() => jest.spyOn(logger, "info").mockImplementation());

describe("usuario.dao", () => {
   beforeAll(async () => {
      await connection.sync();
   });

   afterAll(async () => {
      await connection.close();
   });

   beforeEach(async () => {
      await truncate(connection.models);
   });

   describe("#create", () => {
      test("", async () => {
         const usuario = usuarioFactory();
         const result = await usuarioDao.create(usuario);

         expect(result).toHaveProperty("createdAt");
         expect(result).toHaveProperty("updatedAt");
      });
   });

   describe("#findAll", () => {
      test("", async () => {
         const usuariosEsperados = [usuarioFactory(), usuarioFactory()];

         let usuarios = await usuarioDao.findAll();
         expect(usuarios).toHaveLength(0);

         await usuarioDao.create(usuariosEsperados[0]);
         usuarios = await usuarioDao.findAll();

         expect(usuarios).toHaveLength(1);
         expect(usuarios[0]).toEqual(
            expect.objectContaining(usuariosEsperados[0])
         );

         await usuarioDao.create(usuariosEsperados[1]);
         usuarios = await usuarioDao.findAll();
         const usuario = usuarios.find(
            (usr) => usr.nome === usuariosEsperados[1].nome
         );

         expect(usuarios).toHaveLength(2);
         expect(usuario).toEqual(expect.objectContaining(usuariosEsperados[1]));
      });
   });

   describe("#findById", () => {
      test("", async () => {
         const usuarioEsperado = usuarioFactory();
         await usuarioDao.create(usuarioEsperado);
         await usuarioDao.create(usuarioFactory());

         const usuario = await usuarioDao.findById(usuarioEsperado.id);

         expect(usuario).toEqual(expect.objectContaining(usuarioEsperado));
      });
   });

   describe("#update", () => {
      test("", async () => {
         const usuario = usuarioFactory();
         await usuarioDao.create(usuario);

         const novoUsuario = { ...usuario, nome: "abc" };
         const usuarioAtualizado = await usuarioDao.update(novoUsuario);

         expect(usuarioAtualizado).toEqual(
            expect.objectContaining(novoUsuario)
         );
      });
   });

   describe("#remove", () => {
      test("", async () => {
         const usuario = usuarioFactory();
         await usuarioDao.create(usuario);
         let result = await usuarioDao.findAll();
         expect(result).toHaveLength(1);

         await usuarioDao.remove(usuario.id);
         result = await usuarioDao.findAll();
         expect(result).toHaveLength(0);
      });
   });
});
