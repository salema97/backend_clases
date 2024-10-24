const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Desplazamiento = sequelize.define(
  "Desplazamiento",
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
  { tableName: "Desplazamientos", timestamps: false }
);

sequelize.sync().then(() => {
  console.log("La tabla Desplazamientos ha sido sincronizada");
});

module.exports = Desplazamiento;
