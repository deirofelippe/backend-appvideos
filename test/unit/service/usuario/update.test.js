const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");
const rewire = require("rewire");

describe("service.usuario", () => {
   beforeEach(() => {
      jest.restoreAllMocks();
   });

   describe("#update", () => {
      test("Deve lançar um erro (BD ou achou cpf) em verificarSePodeUsarCPF", async () => {
         const usuario = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         const error =
            "error: cpf esta sendo usado por outro usuario pu erro no BD";

         updateRewire.__set__("verificarSePodeUsarCPF", async () => {
            throw error;
         });

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
      });

      test("Deve lançar um erro (BD ou achou email) em verificarSePodeUsarEmail", async () => {
         const usuario = usuarioFactory()[0];

         const updateRewire = rewire(
            "../../../../src/service/usuario/update.js"
         );

         updateRewire.__set__("verificarSePodeUsarCPF", async () => ({}));

         const error =
            "error: email esta sendo usado por outro usuario pu erro no BD";

         updateRewire.__set__("verificarSePodeUsarEmail", async () => {
            throw error;
         });

         jest
            .spyOn(service, service.update.name)
            .mockImplementation(async (usuario) => await updateRewire(usuario));

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
      });

      test("Deve lançar um erro ao atualizar funcionário", async () => {
         const usuario = usuarioFactory()[0];
         const id = usuario.id;

         jest.spyOn(dao, dao.findByCPF.name).mockImplementation(() => ({ id }));
         jest
            .spyOn(dao, dao.findByEmail.name)
            .mockImplementation(() => ({ id }));

         const error = "erro: atualizar funcionario";
         jest.spyOn(dao, dao.update.name).mockImplementation(() => {
            throw error;
         });

         const update = async () => await service.update(usuario);

         await expect(update).rejects.toEqual(error);
      });

      test("Deve conseguir atualizar o usuario", async () => {
         const usuario = usuarioFactory()[0];
         const id = usuario.id;

         jest.spyOn(dao, dao.findByCPF.name).mockImplementation(() => ({ id }));
         jest
            .spyOn(dao, dao.findByEmail.name)
            .mockImplementation(() => ({ id }));

         jest.spyOn(dao, dao.update.name).mockImplementation(() => usuario);

         const result = await service.update(usuario);

         expect(result).toEqual(usuario);
      });
   });
});
