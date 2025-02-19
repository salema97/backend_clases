const express = require("express");
const ExtensometroController = require("../controllers/extensometro.controllers");
const { validateName } = require("../middlewares/zona.middleware");
const { errorHandler } = require("../middlewares/error.interception");
// const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.use(errorHandler);

router.get(
  "/obtener-todos-extensometros",
  ExtensometroController.obtenerExtensometros
);

router.post(
  "/crear-extensometro",
  validateName,
  ExtensometroController.crearExtensometro
);

router.get(
  "/obtener-extensometros-por-id-zona",
  ExtensometroController.obtenerExtensometrosIdZona
);

router.get(
  "/obtener-extensometro-por-id",
  ExtensometroController.obtenerExtensometroPorId
);

router.put(
  "/actualizar-extensometro",
  ExtensometroController.actualizarExtensometro
);

router.delete(
  "/eliminar-extensometro",
  ExtensometroController.eliminarExtensometro
);

module.exports = router;
