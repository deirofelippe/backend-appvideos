const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");
const validarUsuario = require("../validacao/usuario.validacao.js");

const router = express.Router();

router.post("/usuario", validarUsuario, usuarioController.create);
router.get("/usuario", usuarioController.findAll);

module.exports = router;
