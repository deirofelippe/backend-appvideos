const {
   describe,
   test,
   expect,
   beforeAll,
   afterEach,
} = require("@jest/globals");
const faker = require("faker");
const validarUsuario = require("../../../src/validacao/usuario.validacao.js");
const logger = require("../../../src/logger.js");
const usuarioFactory = require("../../usuarioFactory.js");

beforeAll(() => jest.spyOn(logger, "error").mockImplementation());

describe("Validação de usuário", () => {
   describe("#validarUsuario", () => {
      const req = {
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

      afterEach(() => {
         req.body = {};
         expectedError.errors = {};
      });

      test("Campos devem ser preenchidos: email, nome, senha e cpf", async () => {
         req.body = {
            nome: "",
            email: "",
            senha: "",
            cpf: "",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.nome = [
            "Deve ter no minimo 3 caracteres",
            "Campo deve ser preenchido",
         ];
         expectedError.errors.email = ["Campo deve ser preenchido"];
         expectedError.errors.senha = [
            "Deve ter no minimo 8 caracteres",
            "Campo deve ser preenchido",
         ];
         expectedError.errors.cpf = [
            "CPF inválido",
            "Está no formato inválido",
            "Campo deve ser preenchido",
         ];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Campos são validos", async () => {
         const { id, ...usuario } = usuarioFactory()[0];

         req.body = {
            ...usuario,
         };

         await validarUsuario(req, res, next);

         expect(res.status).toHaveBeenCalledTimes(0);
         expect(next).toHaveBeenCalledTimes(1);
      });

      test("Nome deve ser preenchido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = {
            ...usuario,
            nome: "",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.nome = [
            "Deve ter no minimo 3 caracteres",
            "Campo deve ser preenchido",
         ];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Nome deve ter quantidade minima de caracteres", async () => {
         const usuario = usuarioFactory()[0];
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

         const usuario = usuarioFactory()[0];
         req.body = {
            ...usuario,
            nome,
         };

         await validarUsuario(req, res, next);

         expectedError.errors.nome = ["Deve ter no maximo 60 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Email deve ser preenchido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = {
            ...usuario,
            email: "",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.email = ["Campo deve ser preenchido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Email é inválido", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = {
            ...usuario,
            email: "abc.com",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.email = ["Email inválido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Senha deve ser preenchida", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = {
            ...usuario,
            senha: "",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.senha = [
            "Deve ter no minimo 8 caracteres",
            "Campo deve ser preenchido",
         ];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Senha deve ter um minimo de caracteres", async () => {
         const { id, ...usuario } = usuarioFactory()[0];
         req.body = {
            ...usuario,
            senha: "abcde",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.senha = ["Deve ter no minimo 8 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("CPF deve ser preenchido", async () => {
         const usuario = usuarioFactory()[0];
         req.body = {
            ...usuario,
            cpf: "",
         };

         await validarUsuario(req, res, next);

         expectedError.errors.cpf = [
            "CPF inválido",
            "Está no formato inválido",
            "Campo deve ser preenchido",
         ];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("CPF é válido nos formatos com e sem caracteres especiais", async () => {
         const usuario = usuarioFactory()[0];
         req.body = {
            ...usuario,
         };

         req.body.cpf = "31286578078";
         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);

         req.body.cpf = "312.865.780-78";
         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(2);
      });

      test("CPF é inválido", async () => {
         const usuario = usuarioFactory()[0];
         req.body = {
            ...usuario,
         };

         req.body.cpf = "31286555078";
         await validarUsuario(req, res, next);

         expectedError.errors.cpf = ["CPF inválido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("CPF está no formato inválido", async () => {
         const usuario = usuarioFactory()[0];
         req.body = {
            ...usuario,
         };

         expectedError.errors.cpf = ["Está no formato inválido"];

         req.body.cpf = "31286578078";
         await validarUsuario(req, res, next);

         expect(next).toHaveBeenCalledTimes(1);

         req.body.cpf = "312.865.780.78";
         await validarUsuario(req, res, next);

         expect(res.status().send).toHaveBeenCalledWith(expectedError);

         req.body.cpf = "312-865-780-78";
         await validarUsuario(req, res, next);

         expect(res.status().send).toHaveBeenCalledWith(expectedError);

         req.body.cpf = "312/865-780-78";
         await validarUsuario(req, res, next);

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });
   });
});
