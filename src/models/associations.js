const User = require("./user");
const Role = require("./roles");

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

module.exports = { User, Role };
