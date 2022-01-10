const { describe, test, expect, beforeEach } = require("@jest/globals");
const controller = require("../../../src/controller/usuario.controller.js");
const service = require("../../../src/service/usuario");
const montarError = require("../../../src/utils/montarError.js");

describe("controller.usuario", () => {
   const req = {
      body: {},
   };

   const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
   };

   const error = {
      errors: [],
      status: 0,
   };

   beforeEach(() => {
      jest.restoreAllMocks();

      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn();

      req.body = {};

      error.errors = [];
      error.status = 0;
   });

   describe("#findAll", () => {
      test("Deve retornar usuarios", async () => {
         const usuario = [{ nome: "abc" }, { nome: "def" }];

         jest.spyOn(service, service.findAll.name).mockResolvedValue(usuario);

         await controller.findAll(req, res);

         expect(res.status).toHaveBeenCalledWith(200);
         expect(res.json).toHaveBeenCalledWith(usuario);
      });

      test("O service.findAll deve lançar um erro", async () => {
         const error = montarError(400, { msg: ["algum erro"] });

         jest.spyOn(service, service.findAll.name).mockImplementation(() => {
            throw error;
         });

         await controller.findAll(req, res);

         const { status, errors } = error;

         expect(res.json).toHaveBeenCalledWith({ errors });
         expect(res.status).toHaveBeenCalledWith(status);
      });
   });

   describe("#create", () => {
      test("Deve retornar usuario criado", async () => {
         const usuario = { nome: "abc" };

         jest.spyOn(service, service.create.name).mockResolvedValue(usuario);

         await controller.create(req, res);

         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.json).toHaveBeenCalledWith(usuario);
      });

      test("O service.create deve lançar um erro", async () => {
         const error = montarError(400, { msg: ["algum erro no create"] });

         jest.spyOn(service, service.create.name).mockImplementation(() => {
            throw error;
         });

         await controller.create(req, res);

         const { status, errors } = error;

         expect(res.json).toHaveBeenCalledWith({ errors });
         expect(res.status).toHaveBeenCalledWith(status);
      });
   });
});
