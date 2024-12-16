const express = require("express");
const DesplazamientoController = require("../controllers/desplazamiento.controllers");
const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.get(
  "/obtener-todos-desplazamientos",
  Auth.verifyRole("user"),
  DesplazamientoController.obtenerTodosDesplazamientos
);

module.exports = router;
