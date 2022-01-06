const {
   describe,
   test,
   expect,
   afterAll,
   beforeAll,
   beforeEach,
} = require("@jest/globals");
const connection = require("../../../src/database");
const dao = require("../../../src/dao/usuario.dao.js");
const app = require("../../../src/app.js");
const request = require("supertest");
const truncate = require("../../truncate");
const usuarioFactory = require("../../usuarioFactory.js");
const logger = require("../../../src/logger");

jest.spyOn(logger, "info").mockImplementation();
jest.spyOn(logger, "error").mockImplementation();

describe("Usuario", () => {
   beforeAll(async () => await connection.sync());

   afterAll(async () => await connection.close());

   describe("POST", () => {
      test.only("deve inserir um usuario no BD", async () => {
         const usuario = usuarioFactory()[0];

         const response = await request(app).post("/usuario").send(usuario);
         // const response2 = await request(app).post("/usuario").send(usuario);

         console.log(response.body);
         // console.log(response2.body);

         // const { body } = response;
         // expect(response.ok).toBeTruthy();

         // expect(body.id).toBeDefined();
         // expect(body).toHaveProperty("id");
         // expect(typeof body.id).toBe("string");
         // expect(body.id).toHaveLength(36);
      });

      test("deve retornar 1 ou mais usuarios", async () => {
         const dao = require("../../../src/dao/usuario.dao.js");
         await dao.create(usuarioFactory());
         await dao.create(usuarioFactory());

         const response = await request(app).get("/usuario");

         const { body: usuarios } = response;
         const [usuario1, usuario2] = usuarios;

         expect(response.ok).toBeTruthy();
         expect(usuarios).toHaveLength(2);
         expect(usuario1).toHaveProperty("id");
         expect(usuario2).toHaveProperty("id");
      });

      // test.only("", async () => {
      //    const dao = require("../../src/dao/usuario.dao.js");
      //    const cache = require("../../src/cache");
      //    cache.removerDadosNaCache("usuarios")
      //    const usuario = usuarioFactory()[0];
      //    console.log(usuario);
      //    usuario.cpf = "";
      //    // await dao.create(usuario);

      //    const response = await request(app).post("/usuario").send(usuario);
      //    console.log(response.body);
      // });
   });
});
