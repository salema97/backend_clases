const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Device = sequelize.define(
  "Device",
  {
    deviceId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
  },
  { tableName: "Devices", timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("La tabla Devices ha sido sincronizada");
  })
  .catch((error) => {
    console.error("Ocurrió un error al sincronizar la tabla Devices:", error);
  });

module.exports = Device;
