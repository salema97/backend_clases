const User = require("./user");
const Role = require("./roles");
const Zona = require("./zona");
const Extensometro = require("./extensometro");
const Info = require("./info");

User.belongsToMany(Role, {
  through: "UserRoles",
  foreignKey: "userId",
  timestamps: false,
});
Role.belongsToMany(User, {
  through: "UserRoles",
  foreignKey: "roleId",
  timestamps: false,
});

Zona.hasMany(Extensometro, {
  foreignKey: "zonaId",
  as: "extensometro",
});
Extensometro.belongsTo(Zona, { foreignKey: "zonaId", as: "zona" });
Info.belongsTo(Extensometro, {
  foreignKey: "extensometroId",
  as: "extensometro",
});

module.exports = { User, Role };
