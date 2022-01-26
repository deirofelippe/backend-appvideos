const {
   describe,
   test,
   expect,
   beforeEach,
   beforeAll,
} = require("@jest/globals");
const getInstance = require("../../../src/cache/redisInstance");
const cache = require("../../../src/cache");
const usuarioFactory = require("../../usuarioFactory");
const service = require("../../../src/service/usuario");
const dao = require("../../../src/dao/usuario.dao");

jest.mock("../../../src/logger", () => ({
   error: () => ({}),
   info: () => ({}),
}));

jest.mock("../../../src/kafka/index.js", () => () => ({
   send: () => ({}),
}));

describe("Integração do service junto com o cache", () => {
   let redis;

   beforeAll(async () => {
      redis = getInstance();
   });

   beforeEach(async () => {
      jest.restoreAllMocks();
      await redis.flushall();
   });

   test("Cache 'usuarios' deve ser criado pelo service.findAll", async () => {
      const usuarios = usuarioFactory(1);

      jest.spyOn(dao, dao.findAll.name).mockResolvedValue(usuarios);

      await service.findAll();

      expect(dao.findAll).toBeCalledTimes(1);

      const result = await service.findAll();

      expect(dao.findAll).toBeCalledTimes(1);
      expect(result).toEqual(usuarios);
   });

   test("Cache 'usuario:id' deve ser criado pelo service.findById", async () => {
      const usuario = usuarioFactory()[0];
      const { id } = usuario;

      jest.spyOn(dao, dao.findById.name).mockResolvedValue(usuario);

      await service.findById(usuario);

      expect(dao.findById).toBeCalledTimes(1);

      const result = await service.findById(usuario);

      const expectedUser = {
         id,
         cpf: usuario.cpf,
         nome: usuario.nome,
         email: usuario.email,
      };

      expect(result).toEqual(expectedUser);
      expect(dao.findById).toBeCalledTimes(1);
   });

   test("Cache 'usuarios' deve ser limpado pelo service.create", async () => {
      const usuarios = usuarioFactory(10);

      await cache.gravarDadosNaCache("usuarios", usuarios);

      jest.spyOn(dao, dao.findAll.name).mockResolvedValue(usuarios);

      await service.findAll();

      expect(dao.findAll).toBeCalledTimes(0);

      const { id, ...usuario } = usuarioFactory()[0];

      jest.spyOn(dao, dao.create.name).mockResolvedValue(usuario);
      jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(undefined);

      await service.create(usuario);

      await service.findAll();

      expect(dao.findAll).toBeCalledTimes(1);
   });

   test("Cache 'usuario:id' e 'usuarios' devem ser removidos pelo service.remove", async () => {
      const usuarios = usuarioFactory(2);
      const usuario = usuarios[0];
      const { id } = usuario;

      cache.gravarDadosNaCache(`usuario:${id}`, usuario);
      cache.gravarDadosNaCache("usuarios", usuarios);

      jest.spyOn(dao, dao.findById.name).mockResolvedValue(usuario);
      jest.spyOn(dao, dao.findAll.name).mockResolvedValue(usuarios);
      jest.spyOn(dao, dao.remove.name).mockResolvedValue(true);

      await service.findById(usuario);
      await service.findAll();

      expect(dao.findById).toBeCalledTimes(0);
      expect(dao.findAll).toBeCalledTimes(0);

      await service.remove(usuario);

      await service.findById(usuario);
      await service.findAll();

      expect(dao.findById).toBeCalledTimes(1);
      expect(dao.findAll).toBeCalledTimes(1);
   });

   test("Cache 'usuario:id' e 'usuarios' devem ser removidos pelo service.update", async () => {
      const usuarios = usuarioFactory(2);
      const usuario = usuarios[0];
      const { id } = usuario;

      cache.gravarDadosNaCache(`usuario:${id}`, usuario);
      cache.gravarDadosNaCache("usuarios", usuarios);

      jest.spyOn(dao, dao.findById.name).mockResolvedValue(usuario);
      jest.spyOn(dao, dao.findAll.name).mockResolvedValue(usuarios);

      jest.spyOn(dao, dao.update.name).mockResolvedValue(usuario);
      jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue();
      jest.spyOn(dao, dao.findByCPF.name).mockResolvedValue();

      await service.findById(usuario);
      await service.findAll();

      expect(dao.findById).toBeCalledTimes(0);
      expect(dao.findAll).toBeCalledTimes(0);

      await service.update(usuario);

      await service.findById(usuario);
      await service.findAll();

      expect(dao.findById).toBeCalledTimes(1);
      expect(dao.findAll).toBeCalledTimes(1);
   });
});
