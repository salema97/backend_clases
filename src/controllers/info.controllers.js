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
      temperaturaMAX6675,
      temperaturaLM35,
      humedadRelativa,
      esDia,
      corrienteCS712,
      nivelBateria,
      desplazamientoLineal,
    } = req.body;

    const extensometro = await Extensometro.findByPk(extensometroId);

    if (!extensometro) {
      return res
        .status(404)
        .json({ message: "No se encontró el extensometro" });
    }

    const info = await Info.create({
      temperaturaMAX6675,
      temperaturaLM35,
      humedadRelativa,
      esDia,
      corrienteCS712,
      nivelBateria,
      desplazamientoLineal,
      extensometroId,
    });

    res.status(201).json(info);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al crear la información: ${error}` });
  }
};

const actualizarInfo = async (req, res) => {
  try {
    const { id } = req.query;
    const camposActualizados = req.body;

    const info = await Info.findByPk(id);

    if (!info) {
      return res.status(404).json({ message: "No se encontró la información" });
    }

    Object.keys(camposActualizados).forEach((campo) => {
      if (camposActualizados[campo] !== undefined) {
        info[campo] = camposActualizados[campo];
      }
    });

    await info.save();

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al actualizar la información: ${error}`,
    });
  }
};

const eliminarInfo = async (req, res) => {
  try {
    const { id } = req.query;

    const info = await Info.findByPk(id);

    if (!info) {
      return res.status(404).json({ message: "No se encontró la información" });
    }

    await info.destroy();

    res.status(200).json({ message: "Información eliminada" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al eliminar la información: ${error}`,
    });
  }
};

module.exports = {
  obtenerTodaInfo,
  obtenerInfoPorId,
  obtenerInfoPorExtensometroId,
  crearInfo,
  actualizarInfo,
  eliminarInfo,
};
