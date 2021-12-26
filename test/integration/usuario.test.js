const {
   describe,
   test,
   expect,
   afterAll,
   beforeAll,
   beforeEach,
} = require("@jest/globals");
const connection = require("../../src/database");
const app = require("../../src/app.js");
const request = require("supertest");
const truncate = require("../truncate");
const usuarioFactory = require("../usuarioFactory.js");

describe("Usuario", () => {
   afterAll(async () => await connection.close());
   beforeAll(async () => await connection.sync());

   describe("POST", () => {
      beforeEach(async () => {
         await truncate(connection.models);
      });

      test("deve inserir um usuario no BD", async () => {
         const usuario = usuarioFactory();

         const response = await request(app).post("/usuario").send(usuario);

         const { body } = response;
         expect(response.ok).toBeTruthy();

         expect(body.id).toBeDefined();
         expect(body).toHaveProperty("id");
         expect(typeof body.id).toBe("string");
         expect(body.id).toHaveLength(36);
      });

      test("deve retornar 1 ou mais usuarios", async () => {
         const dao = require("../../src/dao/usuario.dao.js");
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
   });
});
