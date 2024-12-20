const { Extensometro, Zona } = require("../models/associations");

const obtenerExtensometros = async (req, res) => {
  try {
    const extensometros = await Extensometro.findAll();

    if (extensometros.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron extensometros" });
    }

    res.status(200).json(extensometros);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al obtener los extensometros: ${error}`,
    });
  }
};

const crearExtensometro = async (req, res) => {
  try {
    const { zonaId } = req.query;
    const { name } = req.body;

    const zona = await Zona.findByPk(zonaId);

    if (!zona) {
      return res.status(404).json({ message: "No se encontró la zona" });
    }

    const extensometro = await Extensometro.create({
      name,
      zonaId,
    });

    res.status(201).json(extensometro);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al crear el extensometro: ${error}` });
  }
};

const obtenerExtensometrosIdZona = async (req, res) => {
  try {
    const { zonaId } = req.query;

    const zona = await Zona.findByPk(zonaId, {
      include: {
        model: Extensometro,
        as: "extensometro",
      },
    });

    if (!zona) {
      return res.status(404).json({ message: "No se encontró la zona" });
    }

    res.status(200).json(zona.extensometro);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al obtener los extensometros: ${error}`,
    });
  }
};

const obtenerExtensometroPorId = async (req, res) => {
  try {
    const { id } = req.query;

    const extensometro = await Extensometro.findByPk(id);

    if (!extensometro) {
      return res
        .status(404)
        .json({ message: "No se encontró el extensometro" });
    }

    res.status(200).json(extensometro);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al obtener el extensometro: ${error}`,
    });
  }
};

const actualizarExtensometro = async (req, res) => {
  try {
    const { id } = req.query;
    const { name } = req.body;

    const extensometro = await Extensometro.findByPk(id);

    if (!extensometro) {
      return res
        .status(404)
        .json({ message: "No se encontró el extensometro" });
    }

    extensometro.name = name;
    await extensometro.save();

    res.status(200).json(extensometro);
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al actualizar el extensometro: ${error}`,
    });
  }
};

const eliminarExtensometro = async (req, res) => {
  try {
    const { id } = req.query;

    const extensometro = await Extensometro.findByPk(id);

    if (!extensometro) {
      return res
        .status(404)
        .json({ message: "No se encontró el extensometro" });
    }

    await extensometro.destroy();
    res.status(200).json({ message: "Extensometro eliminado" });
  } catch (error) {
    res.status(500).json({
      message: `Hubo un error al eliminar el extensometro: ${error}`,
    });
  }
};

module.exports = {
  obtenerExtensometros,
  crearExtensometro,
  obtenerExtensometrosIdZona,
  obtenerExtensometroPorId,
  actualizarExtensometro,
  eliminarExtensometro,
};
