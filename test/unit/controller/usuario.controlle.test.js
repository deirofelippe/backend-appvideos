const { describe, test, expect, beforeEach } = require("@jest/globals");
const controller = require("../../../src/controller/usuario.controller.js");
const service = require("../../../src/service/usuario");
const montarError = require("../../../src/utils/montarError.js");

describe("controller.usuario", () => {
   const req = {
      body: {},
      params: {},
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
      req.params = {};

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

   describe("#update", () => {
      test("Deve retornar usuario atualizado", async () => {
         const usuario = { nome: "abc" };

         jest.spyOn(service, service.update.name).mockResolvedValue(usuario);

         req.params.id = "01";

         await controller.update(req, res);

         expect(res.status).toHaveBeenCalledWith(200);
         expect(res.json).toHaveBeenCalledWith(usuario);
      });

      test("O service.update deve lançar um erro", async () => {
         const error = montarError(400, { msg: ["algum erro no update"] });

         jest.spyOn(service, service.update.name).mockImplementation(() => {
            throw error;
         });

         req.params.id = "01";

         await controller.update(req, res);

         const { status, errors } = error;

         expect(res.json).toHaveBeenCalledWith({ errors });
         expect(res.status).toHaveBeenCalledWith(status);
      });
   });

   describe("#remove", () => {
      test("Deve retornar usuario atualizado", async () => {
         const usuario = { nome: "abc" };

         jest.spyOn(service, service.remove.name).mockResolvedValue(usuario);

         await controller.remove(req, res);

         expect(res.status).toHaveBeenCalledWith(204);
         expect(res.json).toHaveBeenCalledWith(usuario);
      });

      test("O service.remove deve lançar um erro", async () => {
         const error = montarError(400, { msg: ["algum erro no remove"] });

         jest.spyOn(service, service.remove.name).mockImplementation(() => {
            throw error;
         });

         await controller.remove(req, res);

         const { status, errors } = error;

         expect(res.json).toHaveBeenCalledWith({ errors });
         expect(res.status).toHaveBeenCalledWith(status);
      });
   });

   describe("#findById", () => {
      test("Deve retornar usuario atualizado", async () => {
         const usuario = { nome: "abc" };

         jest.spyOn(service, service.findById.name).mockResolvedValue(usuario);

         await controller.findById(req, res);

         expect(res.status).toHaveBeenCalledWith(200);
         expect(res.json).toHaveBeenCalledWith(usuario);
      });

      test("O service.findById deve lançar um erro", async () => {
         const error = montarError(400, { msg: ["algum erro no findById"] });

         jest.spyOn(service, service.findById.name).mockImplementation(() => {
            throw error;
         });

         await controller.findById(req, res);

         const { status, errors } = error;

         expect(res.json).toHaveBeenCalledWith({ errors });
         expect(res.status).toHaveBeenCalledWith(status);
      });
   });
});
