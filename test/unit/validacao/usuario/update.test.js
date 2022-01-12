const { describe, test, expect, beforeEach } = require("@jest/globals");
const faker = require("faker");
const usuarioFactory = require("../../../usuarioFactory.js");
const { update: validarUsuario } = require("../../../../src/validacao/usuario");

jest.mock("../../../../src/logger.js", () => {
   return {
      error: () => {},
      info: () => {},
   };
});

describe("Validação de usuário: PUT -> UPDATE", () => {
   describe("#validar", () => {
      const req = {
         params: {},
         body: {},
      };

      const res = {
         status: jest.fn().mockReturnThis(),
         send: jest.fn(),
      };

      const next = jest.fn();

      const expectedError = {
         errors: {},
      };

      beforeEach(() => {
         req.params = {};
         req.body = {};
         expectedError.errors = {};
      });

      test("Campo id deve ser preenchido e é inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = { ...usuario };
         req.params.id = "";

         await validarUsuario(req, res, next);

         expectedError.errors = {
            id: ["ID inválido", "Campo deve ser preenchido"],
         };

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Campo id deve ser preenchido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expectedError.errors = {
            id: ["Campo deve ser preenchido"],
         };

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Campo id é inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params.id = "abcder";
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expectedError.errors = {
            id: ["ID inválido"],
         };

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Campo id e os outros passaram na validação", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(res.status).toHaveBeenCalledTimes(0);
         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Não há campo para ser atualizado", async () => {
         const { id } = usuarioFactory()[0];
         req.params = { id };

         await validarUsuario(req, res, next);

         expectedError.errors.msg = ["Não há campos para atualizar"];

         expect(res.send).toHaveBeenCalledWith(expectedError);
         expect(next).toBeCalledTimes(0);
      });

      test("Senha foi incluida no body e foi retirada", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(req.body).not.toHaveProperty("senha");
         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Nome deve ter quantidade minima de caracteres", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = {
            ...usuario,
            nome: "aa",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.nome = ["Deve ter no minimo 3 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Nome deve ter quantidade maxima de caracteres", async () => {
         const nome = faker.lorem.words(40);

         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = {
            ...usuario,
            nome,
         };

         await validarUsuario(req, res, next);

         expectedError.errors.nome = ["Deve ter no maximo 60 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Email é inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = {
            ...usuario,
            email: "abc.com",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.email = ["Email inválido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("CPF é inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         req.body.cpf = "31286555078";
         await validarUsuario(req, res, next);

         expectedError.errors.cpf = ["CPF inválido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("CPF está no formato inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         expectedError.errors.cpf = ["Está no formato inválido"];

         req.body.cpf = "31286578078";
         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);

         req.body.cpf = "312.865.780.78";
         await validarUsuario(req, res, next);

         expect(res.send).toHaveBeenCalledWith(expectedError);

         req.body.cpf = "312-865-780-78";
         await validarUsuario(req, res, next);

         expect(res.send).toHaveBeenCalledWith(expectedError);

         req.body.cpf = "312/865-780-78";
         await validarUsuario(req, res, next);

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Contem todos os campos, menos nome", async () => {
         const { id, nome, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Contem todos os campos, menos nome e email", async () => {
         const { id, nome, email, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Contem todos os campos, menos nome e cpf", async () => {
         const { id, cpf, nome, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Contem todos os campos, menos email", async () => {
         const { id, email, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Contem todos os campos, menos email e cpf", async () => {
         const { id, cpf, email, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Contem todos os campos, menos cpf", async () => {
         const { id, cpf, ...usuario } = usuarioFactory()[0];
         req.params = { id };
         req.body = { ...usuario };

         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);
      });
   });
});
