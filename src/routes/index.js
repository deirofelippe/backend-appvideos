const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");
const loginController = require("../controller/login.controller.js");
const validacao = require("../validacao/usuario");

const router = express.Router();

router.post("/usuario", validacao.create, usuarioController.create);
router.get("/usuario", usuarioController.findAll);
router.get("/usuario/:id", usuarioController.findById);
router.put("/usuario/:id", usuarioController.update);
router.delete("/usuario/:id", usuarioController.remove);

router.post("/login", loginController.login);
router.post("/logout", loginController.logout);

module.exports = router;
