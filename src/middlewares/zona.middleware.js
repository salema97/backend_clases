const validateName = (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    const nameRegex = new RegExp(/^[a-zA-Z0-9\s]+$/);
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        message: "El nombre solo puede contener letras, números y espacios",
      });
    }

    next();
  } catch (error) {
    console.error("Ocurrió un error al validar el nombre:", error);
    res.status(500).json({ message: "Ocurrió un error al validar el nombre" });
  }
};

module.exports = { validateName };
