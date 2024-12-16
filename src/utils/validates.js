const validateUserName = (req, res, next) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario es requerido" });
    }

    const userNameRegex = new RegExp(/^[a-zA-Z0-9'áéíóúÁÉÍÓÚñÑ\s]{4,}$/);

    if (!userNameRegex.test(userName)) {
      return res.status(400).json({
        message: "El nombre de usuario debe tener al menos 4 caracteres",
      });
    }

    next();
  } catch (error) {
    console.error("Ocurrió un error al validar el nombre de usuario:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al validar el nombre de usuario" });
  }
};

const validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "La contraseña es requerida" });
    }

    const passwordRegex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    );

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número",
      });
    }

    next();
  } catch (error) {
    console.error("Ocurrió un error al validar la contraseña:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al validar la contraseña" });
  }
};

const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    );

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
    }

    next();
  } catch (error) {
    console.error("Ocurrió un error al validar el email:", error);
    res.status(500).json({ message: "Ocurrió un error al validar el email" });
  }
};

module.exports = { validateUserName, validatePassword, validateEmail };
