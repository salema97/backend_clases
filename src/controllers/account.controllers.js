const { User, Role } = require("../models/associations");
const sequelize = require("../database");
const Auth = require("../middlewares/auth.jwt");
const EmailUtils = require("../utils/email.utils");
require("dotenv").config();

const registerDefaultAdmin = async () => {
  try {
    const userName = process.env.ADMIN_USER_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log("El usuario admin ya existe");
      return;
    }

    const hashPassword = await Auth.encryptPassword(password);

    const newUser = await User.create({
      userName,
      email,
      password: hashPassword,
      isVerified: true,
    });

    const role = await Role.findOne({ where: { name: "admin" } });

    await newUser.addRole(role);
    console.log("Usuario admin creado correctamente");
  } catch (error) {
    console.log("Hubo un error al crear el usuario admin:", error);
  }
};

const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userName, email, password, fingerprint } = req.body;

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
    const fingerprintHash = null;
    if (fingerprint) {
      fingerprintHash = await Auth.encryptPassword(fingerprint);
    }

    const newUser = await User.create(
      {
        userName,
        email,
        password: hashPassword,
        fingerprintHash,
        isVerified: false,
      },
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

    const token = await Auth.createToken(newUser);

    EmailUtils.sendVerifyEmail(newUser.email, token);

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

    const validPassword = await Auth.comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const token = await Auth.createToken(user);

    res
      .status(200)
      .json({ userName: user.userName, email: user.email, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al iniciar sesión: ${error}` });
  }
};

const loginFingerprint = async (req, res) => {
  try {
    const { fingerprint } = req.body;

    const user = await User.findOne({
      where: { fingerprint },
    });

    if (!user) {
      return res.status(404).json({
        message: "No se encontró el usuario con la huella proporcionado.",
      });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "El correo electrónico no ha sido verificado." });
    }

    const validFingerprintHash = await Auth.comparePassword(
      fingerprint,
      user.fingerprintHash
    );

    if (!validFingerprintHash) {
      return res.status(401).json({ message: "La huella es incorrecta." });
    }

    const token = await Auth.createToken(user);

    res
      .status(200)
      .json({ userName: user.userName, email: user.email, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al iniciar sesión: ${error}` });
  }
};

const loginGoogle = async (req, res) => {
  try {
    if (req.user) {
      const token = await Auth.createToken(req.user);
      res.status(200).json({
        userName: req.user.userName,
        email: req.user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: "No se pudo iniciar sesión con Google" });
    }
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al iniciar sesión con Google: ${error}`,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const payload = Auth.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const email = payload.email;
    const user = await User.findOne({ where: { email } });
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya ha sido verificado" });
    }

    await user.update({ isVerified: true });
    res
      .status(200)
      .json({ message: "Correo electrónico verificado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al verificar el correo electrónico: ${error}`,
    });
  }
};

module.exports = {
  registerDefaultAdmin,
  register,
  login,
  loginFingerprint,
  loginGoogle,
  verifyEmail,
};
