const { describe, test, expect } = require("@jest/globals");
const rewire = require("rewire");
const usuarioFactory = require("../../usuarioFactory.js");

jest.mock("../../../src/logger.js", () => ({
   error: () => ({}),
   info: () => ({}),
}));

describe("Apache kafka", () => {
   describe("#enviarMensagemKafka", () => {
      test("Deve conseguir enviar mensagem pro topico", async () => {
         const usuario = usuarioFactory()[0];
         const methodCreateRewire = rewire(
            "../../../src/service/usuario/create.js"
         );

         const enviarMensagemKafka = methodCreateRewire.__get__(
            "enviarMensagemKafka"
         );
         await enviarMensagemKafka(usuario);
      });
   });
});
