const express = require("express");
const ZonaController = require("../controllers/zona.controllers");
const { validateName } = require("../middlewares/zona.middleware");
const { errorHandler } = require("../middlewares/error.interception");
// const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.use(errorHandler);

router.get("/obtener-todas-zonas", ZonaController.getZonas);

router.get("/obtener-zona-por-id", ZonaController.getZonaById);

router.post("/crear-zona", validateName, ZonaController.createZona);

router.put("/actualizar-zona", validateName, ZonaController.updateZona);

router.delete("/eliminar-zona", ZonaController.deleteZona);

module.exports = router;
