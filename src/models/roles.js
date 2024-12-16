const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const createRoles = require("../libs/initial.setup");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  { tableName: "Roles", timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("La tabla Roles ha sido sincronizada");
    createRoles(Role);
  })
  .catch((error) => {
    console.error("Ocurrió un error al sincronizar la tabla Roles:", error);
  });

module.exports = Role;
