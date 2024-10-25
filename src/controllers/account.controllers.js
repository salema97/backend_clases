const User = require("../models/user");
const sequelize = require("../database");

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

    const newUser = await User.create(
      { userName, email, password, isVerified: false },
      { transaction }
    );

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
  } catch (error) {}
};

module.exports = { register, login };
