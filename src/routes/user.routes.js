const express = require("express");
const UserController = require("../controllers/user.controllers");
const { errorHandler } = require("../middlewares/error.interception");
const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.use(errorHandler);

router.get(
  "/obtener-usuarios",
  Auth.verifyRole("admin"),
  UserController.obtenerUsuarios
);

router.get(
  "/obtener-usuario-por-id",
  Auth.verifyRole("admin"),
  UserController.obtenerUsuarioPorId
);

router.put(
  "/actualizar-rol-usuario",
  Auth.verifyRole("admin"),
  UserController.actualizarRolUsuario
);

router.delete(
  "/eliminar-usuario",
  Auth.verifyRole("admin"),
  UserController.eliminarUsuario
);

module.exports = router;
