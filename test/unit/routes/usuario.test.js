const { describe, test, expect, beforeAll } = require("@jest/globals");
const request = require("supertest");
const app = require("../../../src/app.js");
const faker = require("faker");
const logger = require("../../../src/logger.js");
const service = require("../../../src/service/usuario.service.js");

jest.spyOn(logger, "error").mockImplementation();

describe("Rotas do usuario", () => {
   describe("#create", () => {
      beforeAll(() => {
         jest.spyOn(service, service.create.name).mockResolvedValue({});
      });

      test("Deve passar na validação e continuar o fluxo", async () => {
         const usuario = {
            nome: faker.name.findName(),
            email: faker.internet.email(),
         };

         await request(app).post("/usuario").send(usuario);

         expect(service.create).toHaveBeenCalledTimes(1);
         expect(service.create).toHaveBeenCalledWith(usuario);
      });

      test("Não deve passar na validação e encerrar o fluxo", async () => {
         const usuario = {
            nome: "ab",
            email: "cde",
         };

         const res = await request(app).post("/usuario").send(usuario);

         expect(service.create).toHaveBeenCalledTimes(0);
         expect(res.body).toHaveProperty("errors");
      });
   });
});
