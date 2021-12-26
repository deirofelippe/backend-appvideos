const {
   describe,
   test,
   expect,
   // jest,
   afterAll,
   beforeAll,
   beforeEach,
} = require("@jest/globals");
const usuarioFactory = require("../../usuarioFactory.js");
const service = require("../../../src/service/usuario.service.js");
const uuid = require("uuid");

jest.mock("uuid");

describe("usuario.service", () => {
   describe("#create", () => {
      test.only("Deve gerar id e passar os parametros pro dao.create", async () => {
         const dao = require("../../../src/dao/usuario.dao.js");
         const usuario = usuarioFactory();

         const id = "001";
         uuid.v4.mockReturnValue(id);

         const expectedParams = {
            ...usuario,
            id,
         };

         jest.spyOn(dao, dao.create.name).mockResolvedValue({});

         await service.create(usuario);

         expect(dao.create).toHaveBeenCalledWith(expectedParams);
         expect(uuid.v4).toHaveBeenCalled();
         expect(dao.create).toHaveBeenCalled();
      });
   });
});
