const { Info, Extensometro } = require("../models/associations");

const obtenerTodaInfo = async (_, res) => {
  try {
    const infos = await Info.findAll();

    if (infos.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay información en la base de datos" });
    }

    res.status(200).json(infos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hubo un error al obtener las informaciones" });
  }
};

const obtenerInfoPorId = async (req, res) => {
  try {
    const { id } = req.query;

    const info = await Info.findByPk(id);

    if (!info) {
      return res.status(404).json({ message: "No se encontró la información" });
    }

    res.status(200).json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al obtener la información: ${error}` });
  }
};

const obtenerInfoPorExtensometroId = async (req, res) => {
  try {
    const { extensometroId } = req.query;

    const info = await Extensometro.findByPk(extensometroId, {
      include: {
        model: Info,
        as: "info",
      },
    });

    if (info.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró información para ese extensometro" });
    }

    res.status(200).json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al obtener la información: ${error}` });
  }
};

const crearInfo = async (req, res) => {
  try {
    const { extensometroId } = req.query;
    const {
      TemperaturaMAX6675,
      TemperaturaLM35,
      HumedadRelativa,
      EsDia,
      CorrienteCS712,
      NivelBateria,
      DesplazamientoLineal,
    } = req.body;

    const extensometro = await Extensometro.findByPk(extensometroId);

    if (!extensometro) {
      return res
        .status(404)
        .json({ message: "No se encontró el extensometro" });
    }

    const info = await Info.create({
      TemperaturaMAX6675,
      TemperaturaLM35,
      HumedadRelativa,
      EsDia,
      CorrienteCS712,
      NivelBateria,
      DesplazamientoLineal,
      extensometroId,
    });

    res.status(201).json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al crear la información: ${error}` });
  }
};

module.exports = {
  obtenerTodaInfo,
  obtenerInfoPorId,
  obtenerInfoPorExtensometroId,
  crearInfo,
};
