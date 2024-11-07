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

module.exports = { validatePassword };
