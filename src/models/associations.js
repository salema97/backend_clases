const User = require("./user");
const Role = require("./roles");
const Zona = require("./zona");
const Extensometro = require("./extensometro");
const Info = require("./info");
const Device = require("./device");

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
  onDelete: "CASCADE",
});
Extensometro.belongsTo(Zona, {
  foreignKey: "zonaId",
  as: "zona",
  onDelete: "CASCADE",
});
Extensometro.hasMany(Info, {
  foreignKey: "extensometroId",
  as: "info",
  onDelete: "CASCADE",
});
Info.belongsTo(Extensometro, {
  foreignKey: "extensometroId",
  as: "extensometro",
  onDelete: "CASCADE",
});

User.hasMany(Device, {
  foreignKey: "userId",
  as: "devices",
});
Device.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = { User, Role, Zona, Extensometro, Info, Device };
