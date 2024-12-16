const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Zona = sequelize.define(
  "Zona",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]{3,10}$/,
        notEmpty: true,
      },
    },
  },
  { tableName: "Zonas", timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("La tabla Zonas ha sido sincronizada");
  })
  .catch((error) => {
    console.error("Ocurrió un error al sincronizar la tabla Zonas:", error);
  });

module.exports = Zona;
