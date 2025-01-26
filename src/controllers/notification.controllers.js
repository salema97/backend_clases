const { Device } = require("../models/associations");
const ONE_SIGNAL_CONFIG = require("../utils/one.signal.config");
const https = require("https");

const sendNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { userId } = req.query;

    const devices = await Device.findAll({ where: { userId: userId } });

    if (devices.length === 0) {
      return res.status(400).json({
        message: "El usuario no tiene dispositivos registrados",
      });
    }

    const devicesIds = devices.map((device) => device.deviceId);

    const messageData = JSON.stringify({
      app_id: ONE_SIGNAL_CONFIG.ONESIGNAL_APP_ID,
      include_player_ids: devicesIds,
      headings: { en: title },
      contents: { en: message },
    });

    const options = {
      hostname: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_CONFIG.ONESIGNAL_API_KEY}`,
        "Content-Length": Buffer.byteLength(messageData),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log("Notificación enviada:", data);
        return res.status(200).json({
          message: "Notificación enviada",
        });
      });
    });

    request.on("error", (error) => {
      console.log("Hubo un error al enviar la notificación:", error);
      return res.status(500).json({
        message: "Hubo un error al enviar la notificación",
      });
    });
    request.write(messageData);
    request.end();
  } catch (error) {
    console.log("Hubo un error al enviar la notificación:", error);
    return res.status(500).json({
      message: "Hubo un error al enviar la notificación",
    });
  }
};

const sendNotificationToAll = async (req, res) => {
  try {
    const { title, message } = req.body;

    const devices = await Device.findAll();

    if (devices.length === 0) {
      return res.status(400).json({
        message: "No hay dispositivos registrados",
      });
    }

    const devicesIds = devices.map((device) => device.deviceId);

    const messageData = JSON.stringify({
      app_id: ONE_SIGNAL_CONFIG.ONESIGNAL_APP_ID,
      include_player_ids: devicesIds,
      headings: { en: title },
      contents: { en: message },
    });

    const options = {
      hostname: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONE_SIGNAL_CONFIG.ONESIGNAL_API_KEY}`,
        "Content-Length": Buffer.byteLength(messageData),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log("Notificación enviada:", data);
        return res.status(200).json({
          message: "Notificación enviada",
        });
      });
    });

    request.on("error", (error) => {
      console.log("Hubo un error al enviar la notificación:", error);
      return res.status(500).json({
        message: "Hubo un error al enviar la notificación",
      });
    });
    request.write(messageData);
    request.end();
  } catch (error) {
    console.log("Hubo un error al enviar la notificación:", error);
    return res.status(500).json({
      message: "Hubo un error al enviar la notificación",
    });
  }
};

module.exports = {
  sendNotification,
  sendNotificationToAll,
};
