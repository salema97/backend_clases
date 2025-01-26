const express = require("express");
const InfoController = require("../controllers/info.controllers");
const { errorHandler } = require("../middlewares/error.interception");
const {
  validateExtensometro,
  validateUpdateExtensometro,
} = require("../middlewares/info.middleware");
const { route } = require("./account.routes");
// const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.use(errorHandler);

router.get("/obtener-toda-info", InfoController.obtenerTodaInfo);

router.get(
  "/obtener-info-por-extensometro-id",
  InfoController.obtenerInfoPorExtensometroId
);

router.get("/obtener-info-por-id", InfoController.obtenerInfoPorId);

router.post("/crear-info", validateExtensometro, InfoController.crearInfo);

router.put(
  "/actualizar-info",
  validateUpdateExtensometro,
  InfoController.actualizarInfo
);

router.delete("/eliminar-info", InfoController.eliminarInfo);

router.post("/generar-reporte", InfoController.generarReporte);

module.exports = router;
