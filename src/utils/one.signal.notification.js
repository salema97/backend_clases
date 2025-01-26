const { Device } = require("../models/associations");
const ONE_SIGNAL_CONFIG = require("./one.signal.config");
const https = require("https");

const sendOneSignalNotification = async (devicesIds, title, message) => {
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

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        resolve(data);
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(messageData);
    request.end();
  });
};

const sendCustomNotificationToAll = async (title, message) => {
  try {
    const devices = await Device.findAll();

    if (devices.length === 0) {
      throw new Error("No hay dispositivos registrados");
    }

    const devicesIds = devices.map((device) => device.deviceId);
    await sendOneSignalNotification(devicesIds, title, message);

    return {
      success: true,
      message: "Notificación enviada exitosamente",
    };
  } catch (error) {
    console.log("Error al enviar notificación:", error);
    throw error;
  }
};

module.exports = { sendCustomNotificationToAll };
