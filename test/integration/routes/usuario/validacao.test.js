const { describe, test, expect, beforeEach } = require("@jest/globals");
const app = require("../../../../src/app");
const request = require("supertest");
const usuarioFactory = require("../../../usuarioFactory");
const service = require("../../../../src/service/usuario");

jest.mock("../../../../src/logger", () => ({
   error: () => ({}),
   info: () => ({}),
}));

describe("Integração de request, validação e controller", () => {
   beforeEach(async () => {
      jest.restoreAllMocks();
   });

   describe("Rotas e validacao", () => {
      describe("Rota POST -> create", () => {
         test("Campos não definidos", async () => {
            const res = await request(app).post("/usuario").send();

            const expectedError = {
               errors: {
                  nome: ["Campo deve ser preenchido"],
                  email: ["Campo deve ser preenchido"],
                  senha: ["Campo deve ser preenchido"],
                  cpf: ["CPF inválido", "Campo deve ser preenchido"],
               },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos vazios", async () => {
            const usuario = {
               nome: "",
               cpf: "",
               email: "",
               senha: "",
            };

            const res = await request(app).post("/usuario").send(usuario);

            const expectedError = {
               errors: {
                  nome: [
                     "Deve ter no minimo 3 caracteres",
                     "Campo deve ser preenchido",
                  ],
                  email: ["Campo deve ser preenchido"],
                  senha: [
                     "Deve ter no minimo 8 caracteres",
                     "Campo deve ser preenchido",
                  ],
                  cpf: [
                     "CPF inválido",
                     "Está no formato inválido",
                     "Campo deve ser preenchido",
                  ],
               },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos preenchidos de forma incorreta", async () => {
            const usuario = {
               nome: "ab",
               cpf: "123123",
               email: "asdasdas",
               senha: "asas",
            };

            const res = await request(app).post("/usuario").send(usuario);

            const expectedError = {
               errors: {
                  nome: ["Deve ter no minimo 3 caracteres"],
                  email: ["Email inválido"],
                  senha: ["Deve ter no minimo 8 caracteres"],
                  cpf: ["CPF inválido", "Está no formato inválido"],
               },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos certos", async () => {
            const usuario = usuarioFactory()[0];

            jest.spyOn(service, service.create.name).mockResolvedValue(usuario);

            const res = await request(app).post("/usuario").send(usuario);

            expect(res.body).toEqual(usuario);
         });
      });

      describe("Rota PUT -> update", () => {
         test("Campos não definidos", async () => {
            const res = await request(app).put("/usuario/abc").send();

            const expectedError = {
               errors: { msg: ["Não há campos para atualizar"] },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos vazios", async () => {
            const usuario = {
               nome: "",
               cpf: "",
               email: "",
               senha: "",
            };

            const res = await request(app).put("/usuario/abc").send(usuario);

            const expectedError = {
               errors: {
                  id: ["ID inválido"],
                  nome: ["Deve ter no minimo 3 caracteres"],
                  cpf: ["Está no formato inválido"],
               },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos preenchidos de forma incorreta", async () => {
            const usuario = {
               nome: "a",
               cpf: "123123",
               email: "sadas",
               senha: "asdas",
            };

            const res = await request(app).put("/usuario/abc").send(usuario);

            const expectedError = {
               errors: {
                  id: ["ID inválido"],
                  nome: ["Deve ter no minimo 3 caracteres"],
                  email: ["Email inválido"],
                  cpf: ["CPF inválido", "Está no formato inválido"],
               },
            };

            expect(res.body).toEqual(expectedError);
         });

         test("Campos certos", async () => {
            const { id, ...usuario } = usuarioFactory()[0];

            jest.spyOn(service, service.update.name).mockResolvedValue(usuario);

            const res = await request(app).put(`/usuario/${id}`).send(usuario);

            expect(res.status).toEqual(204);
         });
      });

      describe("Rota DELETE -> remove", () => {
         test("Campo preenchido de forma incorreta", async () => {
            const res = await request(app).delete("/usuario/abc");

            const expectedError = { errors: { id: ["ID inválido"] } };

            expect(res.body).toEqual(expectedError);
         });

         test("Campo certo", async () => {
            const { id } = usuarioFactory()[0];

            jest.spyOn(service, service.remove.name).mockResolvedValue();

            const res = await request(app).delete(`/usuario/${id}`);

            expect(res.status).toEqual(204);
         });
      });

      describe("Rota GET -> findById", () => {
         test("Campo preenchido de forma incorreta", async () => {
            const res = await request(app).get("/usuario/abc");

            const expectedError = { errors: { id: ["ID inválido"] } };

            expect(res.body).toEqual(expectedError);
         });

         test("Campo certo", async () => {
            const { id } = usuarioFactory()[0];

            jest.spyOn(service, service.findById.name).mockResolvedValue(id);

            const res = await request(app).get(`/usuario/${id}`);

            expect(res.body).toEqual(id);
            expect(res.status).toEqual(200);
         });
      });
   });
});
