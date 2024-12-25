const { User, Role } = require("../models/associations");

const obtenerUsuarios = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role,
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al obtener todos los usuarios: ${error}`,
    });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findByPk(id, {
      include: Role,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al obtener el usuario por id: ${error}`,
    });
  }
};

const actualizarRolUsuario = async (req, res) => {
  try {
    const { id } = req.query;
    const { roleName } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const role = await Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await user.setRoles([role]);

    res.json({ message: "Rol actualizado" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al actualizar el rol del usuario: ${error}`,
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al eliminar el usuario: ${error}`,
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarRolUsuario,
  eliminarUsuario,
};
