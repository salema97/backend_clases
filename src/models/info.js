const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Info = sequelize.define(
  "Info",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    TemperaturaMAX6675: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    TemperaturaLM35: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    HumedadRelativa: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    EsDia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    CorrienteCS712: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    NivelBateria: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    DesplazamientoLineal: {
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
