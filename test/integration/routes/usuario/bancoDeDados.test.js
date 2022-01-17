const {
   describe,
   test,
   expect,
   beforeEach,
   afterAll,
   beforeAll,
} = require("@jest/globals");
const connection = require("../../../../src/database");
const app = require("../../../../src/app");
const truncate = require("../../../truncate");
const request = require("supertest");
const usuarioFactory = require("../../../usuarioFactory");
const model = require("../../../../src/models/usuario");

jest.mock("../../../../src/logger", () => ({
   error: () => ({}),
   info: () => ({}),
}));

describe("Integração desde o request, até a escrita no BD", () => {
   beforeEach(async () => await truncate(connection.models));

   beforeAll(async () => await connection.sync());

   afterAll(async () => await connection.close());

   test("Rota do findAll", async () => {
      const usuarios = usuarioFactory(5);
      await model.bulkCreate(usuarios);

      const res = await request(app).get("/usuario");

      expect(res.body).toHaveLength(5);
      expect(res.status).toEqual(200);
   });

   test("Rota do create", async () => {
      const { id, ...usuario } = usuarioFactory()[0];

      const res = await request(app).post("/usuario").send(usuario);

      const expectedUser = {
         nome: usuario.nome,
         email: usuario.email,
      };

      expect(res.body).toEqual(expectedUser);
      expect(res.status).toEqual(201);
   });

   test("Rota do findById", async () => {
      const { senha, ...usuario } = usuarioFactory()[0];
      await model.create({ senha, ...usuario });

      const { id } = usuario;
      const res = await request(app).get(`/usuario/${id}`);

      expect(res.body).toEqual(usuario);
      expect(res.status).toEqual(200);
   });

   test("Rota do remove", async () => {
      const usuario = usuarioFactory()[0];
      await model.create(usuario);

      const { id } = usuario;
      const res = await request(app).delete(`/usuario/${id}`);

      expect(res.status).toEqual(204);

      const result = await model.findOne({ where: { id } });
      expect(result).toBeFalsy();
   });

   test("Rota do update", async () => {
      const usuario = usuarioFactory()[0];
      await model.create(usuario);

      const novoUsuario = usuarioFactory()[0];
      delete novoUsuario.senha;
      delete novoUsuario.id;

      const { id } = usuario;
      const res = await request(app).put(`/usuario/${id}`).send(novoUsuario);

      expect(res.status).toEqual(204);
   });
});
