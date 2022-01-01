const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");
const loginController = require("../controller/login.controller.js");
const validarUsuario = require("../validacao/usuario.validacao.js");

const router = express.Router();

router.post("/usuario", validarUsuario, usuarioController.create);
router.get("/usuario", usuarioController.findAll);

router.post("/login", loginController.login);
router.post("/logout", loginController.logout);

module.exports = router;
