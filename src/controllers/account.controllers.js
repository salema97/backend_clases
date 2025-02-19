const { User, Role, Device } = require("../models/associations");
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
    const { email, password, deviceId } = req.body;

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

    if (deviceId) {
      const deviceExists = await Device.findOne({
        where: { deviceId: deviceId },
      });
      if (deviceExists && deviceExists.userId !== user.id) {
        await deviceExists.destroy();
      }

      const device = await Device.findOne({
        where: { deviceId: deviceId, userId: user.id },
      });
      if (!device) {
        await Device.create({ deviceId: deviceId, userId: user.id });
      }
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
    const { fingerprint, deviceId } = req.body;

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

    if (deviceId) {
      const deviceExists = await Device.findOne({
        where: { deviceId: deviceId },
      });
      if (deviceExists && deviceExists.userId !== user.id) {
        await existingDevice.destroy();
      }

      const device = await Device.findOne({
        where: { deviceId: deviceId, userId: user.id },
      });
      if (!device) {
        await Device.create({ deviceId: deviceId, userId: user.id });
      }
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
    const { profile, deviceId } = req.body;

    if (!profile || !profile._json || !profile._json.email) {
      return res.status(400).json({ message: "Perfil de Google inválido" });
    }

    const email = profile._json.email;
    let user = await User.findOne({ where: { email } });

    if (user) {
      if (deviceId) {
        const deviceExists = await Device.findOne({
          where: { deviceId: deviceId },
        });
        if (deviceExists && deviceExists.userId !== user.id) {
          await deviceExists.destroy();
        }

        const device = await Device.findOne({
          where: { deviceId: deviceId, userId: user.id },
        });
        if (!device) {
          await Device.create({ deviceId: deviceId, userId: user.id });
        }
      }

      const token = await Auth.createToken(user);
      return res.status(200).json({
        userName: user.userName,
        email: user.email,
        token,
      });
    }

    const transaction = await sequelize.transaction();
    try {
      const newUser = await User.create(
        {
          userName: profile._json.name,
          email,
          isVerified: true,
        },
        { transaction }
      );

      const roleUser = await Role.findOne(
        { where: { name: "user" } },
        { transaction }
      );

      if (!roleUser) {
        throw new Error("Rol de usuario no encontrado");
      }

      await newUser.addRole(roleUser, { transaction });
      await transaction.commit();

      if (deviceId) {
        const deviceExists = await Device.findOne({
          where: { deviceId: deviceId },
        });
        if (deviceExists && deviceExists.userId !== newUser.id) {
          await deviceExists.destroy();
        }

        const device = await Device.findOne({
          where: { deviceId: deviceId, userId: newUser.id },
        });
        if (!device) {
          await Device.create({ deviceId: deviceId, userId: newUser.id });
        }
      }

      const token = await Auth.createToken(newUser);
      return res.status(201).json({
        userName: newUser.userName,
        email: newUser.email,
        token,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error en loginGoogle:", error);
    return res.status(500).json({
      message: "Error al procesar el inicio de sesión con Google",
      error: error.message,
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

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const token = await Auth.createTokenTemp(user);

    EmailUtils.sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Correo electrónico enviado" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al restablecer la contraseña: ${error}`,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    const payload = Auth.verifyToken(token);

    if (!payload) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    const email = payload.email;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const hashPassword = await Auth.encryptPassword(newPassword);

    await user.update({ password: hashPassword });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al cambiar la contraseña: ${error}`,
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
  resetPassword,
  changePassword,
};
