const express = require("express");
const ExtensometroController = require("../controllers/extensometro.controllers");
const { validateName } = require("../middlewares/zona.middleware");
// const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.post(
  "/crear-extensometro",
  validateName,
  ExtensometroController.crearExtensometro
);

router.get(
  "/obtener-extensometros-por-id-zona",
  ExtensometroController.obtenerExtensometrosIdZona
);

module.exports = router;
