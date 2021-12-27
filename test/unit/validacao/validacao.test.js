const {
   describe,
   test,
   expect,
   beforeEach,
   beforeAll,
} = require("@jest/globals");
const faker = require("faker");
const validarUsuario = require("../../../src/validacao/usuario.validacao.js");
const logger = require("../../../src/logger.js");

beforeAll(() => jest.spyOn(logger, "error").mockImplementation());

describe("Validação de usuário", () => {
   describe("#validarUsuario", () => {
      const req = {
         body: {},
      };

      const res = {
         status: jest.fn().mockReturnValue({ send: jest.fn() }),
      };

      const next = jest.fn();

      const expectedError = {
         errors: {},
      };

      beforeEach(() => {
         req.body = {};
         expectedError.errors = {};
      });

      test("Email e nome deve ser preenchido", async () => {
         req.body.nome = "";
         req.body.email = "";

         await validarUsuario(req, res, next);

         expectedError.errors.nome = [
            "Deve ter no minimo 3 caracteres",
            "Campo deve ser preenchido",
         ];
         expectedError.errors.email = ["Campo deve ser preenchido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });
      test("Nome deve ter um minimo de caracteres", async () => {
         req.body.nome = "aa";
         req.body.email = faker.internet.email();

         await validarUsuario(req, res, next);

         expectedError.errors.nome = ["Deve ter no minimo 3 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Nome deve ter uma máximo de caracteres", async () => {
         req.body.nome = faker.lorem.words(40);
         req.body.email = faker.internet.email();

         await validarUsuario(req, res, next);

         expectedError.errors.nome = ["Deve ter no maximo 50 caracteres"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Email deve ser válido", async () => {
         req.body.nome = faker.name.findName();
         req.body.email = "abc";

         await validarUsuario(req, res, next);

         expectedError.errors.email = ["Email inválido"];

         expect(res.status().send).toHaveBeenCalledWith(expectedError);
      });

      test("Nao deve ter erro e deve chamar o metodo next()", async () => {
         req.body.nome = faker.name.findName();
         req.body.email = faker.internet.email();

         await validarUsuario(req, res, next);

         expect(res.status).toHaveBeenCalledTimes(0);
         expect(next).toHaveBeenCalledTimes(1);
      });
   });
});
