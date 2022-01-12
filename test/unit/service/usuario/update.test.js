const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const service = require("../../../../src/service/usuario");
const rewire = require("rewire");
const montarError = require("../../../../src/utils/montarError.js");

describe("service.usuario", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#verificarSePodeUsarCPF", () => {
      test("CPF deve ser vazio e não deve fazer busca pelo CPF", async () => {
         const cpf = "";
         const id = "";

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByCPF: jest.fn(),
            },
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarCPF = updateRewire.__get__(
            "verificarSePodeUsarCPF"
         );

         await verificarSePodeUsarCPF(id, cpf);

         expect(mock.dao.findByCPF).toHaveBeenCalledTimes(0);
      });

      test("O CPF deve ser do proprio usuario que ta procurando", async () => {
         const { id, cpf } = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByCPF: jest.fn().mockResolvedValue({ id }),
            },
            montarError: jest.fn(),
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarCPF = updateRewire.__get__(
            "verificarSePodeUsarCPF"
         );

         await verificarSePodeUsarCPF(id, cpf);

         expect(mock.dao.findByCPF).toHaveBeenCalledTimes(1);
         expect(mock.dao.findByCPF).toHaveBeenCalledWith(cpf);
         expect(mock.montarError).toHaveBeenCalledTimes(0);
      });

      test("O CPF deve ser de um usuario diferente do que esta procurando", async () => {
         const { id, cpf } = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByCPF: jest.fn().mockResolvedValue({ id: "0" }),
            },
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarCPF = updateRewire.__get__(
            "verificarSePodeUsarCPF"
         );

         const find = async () => await verificarSePodeUsarCPF(id, cpf);

         const error = montarError(401, { cpf: ["CPF não pode ser usado"] });

         await expect(find).rejects.toEqual(error);
         expect(mock.dao.findByCPF).toHaveBeenCalledWith(cpf);
      });
   });

   describe("#verificarSePodeUsarEmail", () => {
      test("Email deve ser vazio e não deve fazer busca pelo email", async () => {
         const id = "";
         const email = "";

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByEmail: jest.fn(),
            },
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarEmail = updateRewire.__get__(
            "verificarSePodeUsarEmail"
         );

         await verificarSePodeUsarEmail(id, email);

         expect(mock.dao.findByEmail).toHaveBeenCalledTimes(0);
      });

      test("O email deve ser do proprio usuario que ta procurando", async () => {
         const { id, email } = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByEmail: jest.fn().mockResolvedValue({ id }),
            },
            montarError: jest.fn(),
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarEmail = updateRewire.__get__(
            "verificarSePodeUsarEmail"
         );

         await verificarSePodeUsarEmail(id, email);

         expect(mock.dao.findByEmail).toHaveBeenCalledTimes(1);
         expect(mock.dao.findByEmail).toHaveBeenCalledWith(email);
         expect(mock.montarError).toHaveBeenCalledTimes(0);
      });

      test("O email deve ser de um usuario diferente do que esta procurando", async () => {
         const { id, email } = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            dao: {
               findByEmail: jest.fn().mockResolvedValue({ id: "0" }),
            },
         };

         updateRewire.__set__(mock);

         const verificarSePodeUsarEmail = updateRewire.__get__(
            "verificarSePodeUsarEmail"
         );

         const find = async () => await verificarSePodeUsarEmail(id, email);

         const error = montarError(401, {
            email: ["Email não pode ser usado"],
         });

         await expect(find).rejects.toEqual(error);
         expect(mock.dao.findByEmail).toHaveBeenCalledWith(email);
      });
   });

   describe("#update", () => {
      test("Deve lançar um erro (BD ou achou cpf) em verificarSePodeUsarCPF", async () => {
         const usuario = usuarioFactory()[0];

         const moduloUpdateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const error = "erro: buscar cpf";
         const mock = {
            verificarSePodeUsarCPF: jest.fn().mockImplementation(() => {
               throw error;
            }),
            verificarSePodeUsarEmail: jest.fn(),
         };

         moduloUpdateRewire.__set__(mock);
         const updateRewire = moduloUpdateRewire.__get__("update");

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
         expect(mock.verificarSePodeUsarCPF).toHaveBeenCalledTimes(1);
         expect(mock.verificarSePodeUsarCPF).toHaveBeenCalledWith(
            usuario.id,
            usuario.cpf
         );
         expect(mock.verificarSePodeUsarEmail).toHaveBeenCalledTimes(0);
      });

      test("Deve lançar um erro (BD ou achou email) em verificarSePodeUsarEmail", async () => {
         const usuario = usuarioFactory()[0];

         const moduloUpdateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const error = "erro: buscar email";
         const mock = {
            verificarSePodeUsarCPF: jest.fn(),
            verificarSePodeUsarEmail: jest.fn().mockImplementation(() => {
               throw error;
            }),
            dao: {
               update: jest.fn(),
            },
         };

         moduloUpdateRewire.__set__(mock);
         const updateRewire = moduloUpdateRewire.__get__("update");

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
         expect(mock.verificarSePodeUsarCPF).toHaveBeenCalledTimes(1);
         expect(mock.verificarSePodeUsarEmail).toHaveBeenCalledTimes(1);
         expect(mock.verificarSePodeUsarEmail).toHaveBeenCalledWith(
            usuario.id,
            usuario.email
         );
         expect(mock.dao.update).toHaveBeenCalledTimes(0);
      });

      test("Deve lançar um erro ao atualizar funcionário", async () => {
         const usuario = usuarioFactory()[0];

         const moduloUpdateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const error = "erro: atualizar funcionario";
         const mock = {
            verificarSePodeUsarCPF: jest.fn(),
            verificarSePodeUsarEmail: jest.fn(),
            dao: {
               update: jest.fn().mockImplementation(() => {
                  throw error;
               }),
            },
         };

         moduloUpdateRewire.__set__(mock);
         const updateRewire = moduloUpdateRewire.__get__("update");

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
         expect(mock.verificarSePodeUsarCPF).toHaveBeenCalledTimes(1);
         expect(mock.verificarSePodeUsarEmail).toHaveBeenCalledTimes(1);
         expect(mock.dao.update).toHaveBeenCalledWith(usuario);
      });

      test("Deve conseguir atualizar o usuario", async () => {
         const usuario = usuarioFactory()[0];

         const moduloUpdateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const mock = {
            verificarSePodeUsarCPF: jest.fn(),
            verificarSePodeUsarEmail: jest.fn(),
            dao: {
               update: jest.fn().mockResolvedValue(usuario),
            },
            cache: {
               removerDadosNaCache: jest.fn(),
            },
         };
         moduloUpdateRewire.__set__(mock);
         const updateRewire = moduloUpdateRewire.__get__("update");

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const result = await service.update(usuario);

         expect(result).toEqual(usuario);
         expect(mock.verificarSePodeUsarCPF).toHaveBeenCalledTimes(1);
         expect(mock.verificarSePodeUsarEmail).toHaveBeenCalledTimes(1);
         expect(mock.dao.update).toHaveBeenCalledWith(usuario);
         expect(mock.cache.removerDadosNaCache).toHaveBeenCalledWith(
            "usuarios"
         );
      });
   });
});
