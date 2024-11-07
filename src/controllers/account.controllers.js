const { User, Role } = require("../models/associations");
const sequelize = require("../database");
const Auth = require("../middlewares/auth.jwt");

const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userName, email, password } = req.body;

    const userExists = await User.findOne(
      { where: { email } },
      { transaction }
    );

    if (userExists) {
      await transaction.rollback();
      return res.status(400).json({
        message: "El correo electrónico proporcionada ya esta en uso",
      });
    }

    const hashPassword = await Auth.encryptPassword(password);

    const newUser = await User.create(
      { userName, email, password: hashPassword, isVerified: false },
      { transaction }
    );

    const roleUser = await Role.findOne(
      { where: { name: "user" } },
      { transaction }
    );

    if (!roleUser) {
      await transaction.rollback();
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await newUser.addRole(roleUser, { transaction });

    await transaction.commit();
    res.status(201).json({ userName: newUser.userName, email: newUser.email });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ message: `Hubo un error al registrar el usuario: ${error}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message:
          "No se encontró el usuario con el correo electrónico proporcionado.",
      });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "El correo electrónico no ha sido verificado." });
    }

    // const validPassword = await user.comparePassword(password);

    // if (!validPassword) {
    //   return res.status(401).json({ message: "Contraseña incorrecta." });
    // }

    res.status(200).json({ userName: user.userName, email: user.email });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al iniciar sesión: ${error}` });
  }
};

module.exports = { register, login };
