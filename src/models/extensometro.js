const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Extensometro = sequelize.define(
  "Extensometro",
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
  { tableName: "Extensometros", timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("La tabla Extensometros ha sido sincronizada");
  })
  .catch((error) => {
    console.error(
      "Ocurrió un error al sincronizar la tabla Extensometros:",
      error
    );
  });

module.exports = Extensometro;
