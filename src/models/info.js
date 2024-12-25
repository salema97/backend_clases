const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Info = sequelize.define(
  "Info",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    temperaturaMAX6675: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    temperaturaLM35: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    humedadRelativa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    esDia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    corrienteCS712: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    nivelBateria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    desplazamientoLineal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { tableName: "Infos" }
);

sequelize
  .sync()
  .then(() => {
    console.log("La tabla Infos ha sido sincronizada");
  })
  .catch((error) => {
    console.error("Ocurrió un error al sincronizar la tabla Infos:", error);
  });

module.exports = Info;
