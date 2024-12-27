require("dotenv").config();

const ONE_SIGNAL_CONFIG = {
  ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID,
  ONESIGNAL_API_KEY: process.env.ONESIGNAL_API_KEY,
};

module.exports = ONE_SIGNAL_CONFIG;
