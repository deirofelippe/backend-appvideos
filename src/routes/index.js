const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");
const loginController = require("../controller/login.controller.js");
const validacao = require("../validacao/usuario");
const dao = require("../dao/usuario.dao.js");

const router = express.Router();

router.get("/usuario/test", async (req, res) => {
   const usuarios = await dao.findAll();
   res.send(usuarios);
});

router.post("/usuario", validacao.create, usuarioController.create);
router.get("/usuario", usuarioController.findAll);
router.get("/usuario/:id", validacao.findById, usuarioController.findById);
router.put("/usuario/:id", validacao.update, usuarioController.update);
router.delete("/usuario/:id", validacao.remove, usuarioController.remove);

router.post("/login", loginController.login);
router.post("/logout", loginController.logout);

module.exports = router;
