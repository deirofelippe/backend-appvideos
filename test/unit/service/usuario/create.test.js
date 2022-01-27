const { describe, test, expect, beforeEach } = require("@jest/globals");
const usuarioFactory = require("../../../usuarioFactory.js");
const cache = require("../../../../src/cache");
const service = require("../../../../src/service/usuario");
const dao = require("../../../../src/dao/usuario.dao.js");
const montarError = require("../../../../src/utils/montarError.js");

const rewire = require("rewire");

const uuid = require("uuid");
jest.mock("uuid");
uuid.v4.mockReturnValue("001");

jest.mock("../../../../src/kafka/index.js", () => () => ({
   send: () => ({}),
}));

jest.mock("../../../../src/logger", () => ({
   error: () => ({}),
   info: () => ({}),
}));

describe("service.usuario", () => {
   describe("#create", () => {
      beforeEach(() => {
         jest.restoreAllMocks();
      });

      test("Email já existente, deve lançar um erro", async () => {
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(true);

         const usuario = {};

         const expectedError = montarError(401, {
            email: ["Email já existente"],
         });

         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
         expect(dao.findByEmail).toHaveBeenCalledTimes(1);
      });

      test("dao.create deve lançar um erro", async () => {
         const usuario = usuarioFactory()[0];

         const error = { error: "BD CREATE" };
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(false);
         jest.spyOn(dao, dao.create.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;
         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
         expect(dao.create).toHaveBeenCalledTimes(1);
      });

      test("dao.findByEmail deve lançar um erro", async () => {
         const usuario = {};

         const error = { error: "BD FIND BY EMAIL" };
         jest.spyOn(dao, dao.findByEmail.name).mockImplementation(() => {
            throw error;
         });

         const expectedError = error;
         const create = async () => await service.create(usuario);

         await expect(create).rejects.toEqual(expectedError);
      });

      test("Deve passa no teste e retornar um usuario", async () => {
         const bcrypt = require("bcrypt");

         jest.spyOn(cache, cache.removerDadosNaCache.name).mockImplementation();
         jest.spyOn(dao, dao.findByEmail.name).mockResolvedValue(false);
         jest
            .spyOn(bcrypt, bcrypt.hash.name)
            .mockImplementation((senha) => `hash -> ${senha}`);
         jest.spyOn(dao, dao.create.name).mockImplementation((usuario) => {
            return {
               ...usuario,
               createdAt: new Date(),
               updatedAt: new Date(),
            };
         });

         const usuario = usuarioFactory()[0];

         const id = "001";

         const expectedParams = {
            ...usuario,
            id,
            senha: `hash -> ${usuario.senha}`,
         };

         const result = await service.create(usuario);

         expect(dao.create).toHaveBeenCalledWith(expectedParams);
         expect(cache.removerDadosNaCache).toHaveBeenCalledWith("usuarios");
         expect(result).toHaveProperty("nome");
         expect(result).toHaveProperty("email");
      });
   });

   describe("#enviarMensagemKafka", () => {
      const logger = {
         error: () => ({}),
         info: () => ({}),
      };

      test("Deve enviar ao producer os dados corretamente", async () => {
         const { nome, email } = usuarioFactory()[0];

         const message = JSON.stringify({ nome, email });
         const record = {
            topic: process.env.KAFKA_TOPIC,
            messages: [{ value: message }],
         };

         const createMethodRewire = rewire(
            "../../../../src/service/usuario/create.js"
         );

         const send = {
            send: jest.fn().mockResolvedValue(),
         };

         const kafkaConnection = () => send;

         createMethodRewire.__set__({ kafkaConnection, logger });

         const enviarMensagemKafka = createMethodRewire.__get__(
            "enviarMensagemKafka"
         );

         await enviarMensagemKafka({ nome, email });

         expect(send.send).toBeCalledWith(record);
      });

      test("Deve lancar um erro", async () => {
         const createMethodRewire = rewire(
            "../../../../src/service/usuario/create.js"
         );

         const send = {
            send: jest.fn().mockImplementation(() => {
               throw "xabu";
            }),
         };

         const kafkaConnection = () => send;

         createMethodRewire.__set__({ kafkaConnection, logger });

         const enviarMensagemKafka = createMethodRewire.__get__(
            "enviarMensagemKafka"
         );

         const expectedError = montarError(500, { msg: ["Algo deu errado"] });

         const usuario = { nome: "a", email: "b" };

         const kafkaProduce = async () => await enviarMensagemKafka(usuario);

         await expect(kafkaProduce).rejects.toEqual(expectedError);
         expect(kafkaConnection().send).toBeCalledTimes(1);
      });
   });
});
