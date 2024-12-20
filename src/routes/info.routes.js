const express = require("express");
const InfoController = require("../controllers/info.controllers");
// const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.get("/obtener-toda-info", InfoController.obtenerTodaInfo);

router.get(
  "/obtener-info-por-extensometro-id",
  InfoController.obtenerInfoPorExtensometroId
);

router.get("/obtener-info-por-id", InfoController.obtenerInfoPorId);

router.post("/crear-info", InfoController.crearInfo);

module.exports = router;
