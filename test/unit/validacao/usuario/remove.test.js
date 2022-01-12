const { describe, test, expect, beforeEach } = require("@jest/globals");
const uuid = require("uuid");
const { remove: validarUsuario } = require("../../../../src/validacao/usuario");

jest.mock("../../../../src/logger.js", () => {
   return {
      error: () => {},
      info: () => {},
   };
});

describe("Validação de usuário: DELETE -> REMOVE", () => {
   describe("#validar", () => {
      const req = {
         params: {},
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
         expectedError.errors = {};
      });

      test("Campo id deve ser preenchido", async () => {
         const id = "";
         req.params.id = id;

         await validarUsuario(req, res, next);

         expectedError.errors = {
            id: ["ID inválido", "Campo deve ser preenchido"],
         };

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Campo id é inválido", async () => {
         const id = "abcder";
         req.params.id = id;

         await validarUsuario(req, res, next);

         expectedError.errors = {
            id: ["ID inválido"],
         };

         expect(res.send).toHaveBeenCalledWith(expectedError);
      });

      test("Validação passou", async () => {
         const id = uuid.v4();
         req.params.id = id;

         await validarUsuario(req, res, next);

         expect(res.status).toHaveBeenCalledTimes(0);
         expect(next).toHaveBeenCalledTimes(1);
      });
   });
});
