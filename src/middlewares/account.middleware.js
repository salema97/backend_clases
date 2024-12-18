const validateRegister = (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario es requerido" });
    }

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    if (!password) {
      return res.status(400).json({ message: "La contraseña es requerida" });
    }

    const userNameRegex = new RegExp(/^[a-zA-Z0-9'áéíóúÁÉÍÓÚñÑ\s]{4,}$/);
    if (!userNameRegex.test(userName)) {
      return res.status(400).json({
        message: "El nombre de usuario debe tener al menos 4 caracteres",
      });
    }

    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    );
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
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
    console.error("Ocurrió un error al validar el registro:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al validar el registro" });
  }
};

const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El email es requerido" });
    }

    if (!password) {
      return res.status(400).json({ message: "La contraseña es requerida" });
    }

    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    );
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "El email no es válido" });
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
    console.error("Ocurrió un error al validar el login:", error);
    res.status(500).json({ message: "Ocurrió un error al validar el login" });
  }
};

module.exports = { validateRegister, validateLogin };
