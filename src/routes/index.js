const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");

const router = express.Router();

router.post("/usuario", usuarioController.create);
router.get("/usuario", usuarioController.findAll);

module.exports = router;
