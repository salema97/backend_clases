const createRoles = async (Role) => {
  try {
    const count = await Role.count();
    if (count > 0) return console.log("Los roles ya han sido creados");

    const roles = ["admin", "user"];

    for (const role of roles) {
      await Role.create({ name: role });
    }

    console.log("Roles creados correctamente");
  } catch (error) {
    console.error("Ocurrió un error al crear los roles:", error);
  }
};

module.exports = createRoles;
