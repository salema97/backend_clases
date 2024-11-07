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

const verifyToken = async (token) => {
  try {
    const secretWord = process.env.SECRET_WORD_TOKEN;
    const payload = jwt.verify(token, secretWord);
    return payload;
  } catch (error) {
    console.error("Ocurrió un error al verificar el token:", error);
  }
};

module.exports = { encryptPassword, comparePassword, createToken, verifyToken };
