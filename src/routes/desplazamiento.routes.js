const express = require("express");
const DesplazamientoController = require("../controllers/desplazamiento.controllers");

const router = express.Router();

router.get(
  "/obtener-todos-desplazamientos",
  DesplazamientoController.obtenerTodosDesplazamientos
);

module.exports = router;
