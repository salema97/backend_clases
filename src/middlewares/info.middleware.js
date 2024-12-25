const validateExtensometro = (req, res, next) => {
  try {
    const {
      temperaturaMAX6675,
      temperaturaLM35,
      humedadRelativa,
      esDia,
      corrienteCS712,
      nivelBateria,
      desplazamientoLineal,
    } = req.body;

    if (!temperaturaMAX6675) {
      return res
        .status(400)
        .json({ message: "La temperatura maxima es requerida" });
    }

    const temperaturaMAX6675Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!temperaturaMAX6675Regex.test(temperaturaMAX6675)) {
      return res.status(400).json({
        message:
          "La temperatura maxima solo puede contener números, dos decimales y un punto",
      });
    }

    if (!temperaturaLM35) {
      return res.status(400).json({ message: "La temperatura L es requerido" });
    }

    const temperaturaLM35Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!temperaturaLM35Regex.test(temperaturaLM35)) {
      return res.status(400).json({
        message:
          "La temperatura L solo puede contener números, dos decimales y un punto",
      });
    }

    if (!humedadRelativa) {
      return res
        .status(400)
        .json({ message: "La humedad relativa es requerida" });
    }

    const humedadRelativaRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!humedadRelativaRegex.test(humedadRelativa)) {
      return res.status(400).json({
        message:
          "La humedad relativa solo puede contener números, dos decimales y un punto",
      });
    }

    if (!esDia) {
      return res
        .status(400)
        .json({ message: "El estado del dia es requerido" });
    }

    const esDiaRegex = new RegExp(/^(true|false)$/);
    if (!esDiaRegex.test(esDia)) {
      return res.status(400).json({
        message: "El estado del dia solo puede ser true o false",
      });
    }

    if (!corrienteCS712) {
      return res.status(400).json({ message: "La corriente es requerida" });
    }

    const corrienteCS712Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!corrienteCS712Regex.test(corrienteCS712)) {
      return res.status(400).json({
        message:
          "La corriente solo puede contener números, dos decimales y un punto",
      });
    }

    if (!nivelBateria) {
      return res
        .status(400)
        .json({ message: "El nivel de bateria es requerido" });
    }

    const nivelBateriaRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!nivelBateriaRegex.test(nivelBateria)) {
      return res.status(400).json({
        message:
          "El nivel de bateria solo puede contener números, dos decimales y un punto",
      });
    }

    if (!desplazamientoLineal) {
      return res
        .status(400)
        .json({ message: "El desplazamiento lineal es requerido" });
    }

    const desplazamientoLinealRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!desplazamientoLinealRegex.test(desplazamientoLineal)) {
      return res.status(400).json({
        message:
          "El desplazamiento lineal solo puede contener números, dos decimales y un punto",
      });
    }

    next();
  } catch (error) {
    console.error("Ocurrió un error al crear el extensometro:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al crear el extensometro" });
  }
};

const validateUpdateExtensometro = (req, res, next) => {
  try {
    const {
      temperaturaMAX6675,
      temperaturaLM35,
      humedadRelativa,
      esDia,
      corrienteCS712,
      nivelBateria,
      desplazamientoLineal,
    } = req.body;

    if (temperaturaMAX6675 !== undefined) {
      const temperaturaMAX6675Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!temperaturaMAX6675Regex.test(temperaturaMAX6675)) {
        return res.status(400).json({
          message:
            "La temperatura maxima solo puede contener números, dos decimales y un punto",
        });
      }
    }

    if (temperaturaLM35 !== undefined) {
      const temperaturaLM35Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!temperaturaLM35Regex.test(temperaturaLM35)) {
        return res.status(400).json({
          message:
            "La temperatura L solo puede contener números, dos decimales y un punto",
        });
      }
    }

    if (humedadRelativa !== undefined) {
      const humedadRelativaRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!humedadRelativaRegex.test(humedadRelativa)) {
        return res.status(400).json({
          message:
            "La humedad relativa solo puede contener números, dos decimales y un punto",
        });
      }
    }

    if (esDia !== undefined) {
      const esDiaRegex = new RegExp(/^(true|false)$/);
      if (!esDiaRegex.test(esDia)) {
        return res.status(400).json({
          message: "El estado del dia solo puede ser true o false",
        });
      }
    }

    if (corrienteCS712 !== undefined) {
      const corrienteCS712Regex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!corrienteCS712Regex.test(corrienteCS712)) {
        return res.status(400).json({
          message:
            "La corriente solo puede contener números, dos decimales y un punto",
        });
      }
    }

    if (nivelBateria !== undefined) {
      const nivelBateriaRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!nivelBateriaRegex.test(nivelBateria)) {
        return res.status(400).json({
          message:
            "El nivel de bateria solo puede contener números, dos decimales y un punto",
        });
      }
    }

    if (desplazamientoLineal !== undefined) {
      const desplazamientoLinealRegex = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!desplazamientoLinealRegex.test(desplazamientoLineal)) {
        return res.status(400).json({
          message:
            "El desplazamiento lineal solo puede contener números, dos decimales y un punto",
        });
      }
    }

    next();
  } catch (error) {
    console.error(
      "Ocurrió un error al validar al actualizar el extensometro:",
      error
    );
    res
      .status(500)
      .json({ message: "Ocurrió un error al actualizar el extensometro" });
  }
};

module.exports = { validateExtensometro, validateUpdateExtensometro };
