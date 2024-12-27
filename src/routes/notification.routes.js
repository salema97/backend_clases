const express = require("express");
const NotificationController = require("../controllers/notification.controllers");
const { errorHandler } = require("../middlewares/error.interception");
const Auth = require("../middlewares/auth.jwt");

const router = express.Router();

router.use(errorHandler);

router.post(
  "/enviar-notificacion-usuario",
  Auth.verifyRole("admin"),
  NotificationController.sendNotification
);

router.post(
  "/enviar-notificacion-todos",
  Auth.verifyRole("admin"),
  NotificationController.sendNotificationToAll
);

module.exports = router;
