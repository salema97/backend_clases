const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("tierra", "root", "admin", {
  host: "localhost",
  port: "3306",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
