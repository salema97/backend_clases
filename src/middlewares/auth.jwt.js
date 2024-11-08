const bycryt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const encryptPassword = async (password) => {
  try {
    const salt = await bycryt.genSalt(parseInt(process.env.SALT_ROUNDS));
    const hashPassword = await bycryt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    console.error("Ocurrió un error al encriptar la contraseña:", error);
  }
};

const comparePassword = async (password, hashPassword) => {
  try {
    return await bycryt.compare(password, hashPassword);
  } catch (error) {
    console.error("Ocurrió un error al comparar las contraseñas:", error);
  }
};

const createToken = async (user) => {
  try {
    const roles = await user.getRoles();
    const rolesNames = roles.map((role) => role.name);

    const payload = {
      userName: user.userName,
      email: user.email,
      roles: rolesNames,
    };

    const secretWord = process.env.SECRET_WORD_TOKEN;
    const options = {
      expiresIn: process.env.EXPIRATION_TOKEN,
      issuer: process.env.ISSUER_TOKEN,
    };

    const token = jwt.sign(payload, secretWord, options);

    return token;
  } catch (error) {
    console.error("Ocurrió un error al crear el token:", error);
  }
};

const verifyToken = (token) => {
  try {
    const secretWord = process.env.SECRET_WORD_TOKEN;
    const payload = jwt.verify(token, secretWord);
    return payload;
  } catch (error) {
    console.error("Ocurrió un error al verificar el token:", error);
  }
};

const verifyRole =
  (...requireRoles) =>
  (req, res, next) => {
    try {
      let token = req.headers["authorization"];

      if (!token) {
        return res
          .status(403)
          .json({ message: "No se proporciona ningún token" });
      }

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      const payload = verifyToken(token);

      if (!payload) {
        return res.status(401).json({ message: "Token inválido" });
      }

      req.user = payload;

      const userRoles = payload.roles;
      const hasRole = requireRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({
          message: "No tienes permisos para realizar esta acción",
        });
      }

      next();
    } catch (error) {
      console.error("Ocurrió un error al verificar el rol:", error);
      res.status(500).json({ message: "Ocurrió un error al verificar el rol" });
    }
  };

module.exports = {
  encryptPassword,
  comparePassword,
  createToken,
  verifyToken,
  verifyRole,
};
