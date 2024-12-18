const { Extensometro, Zona } = require("../models/associations");

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

module.exports = { crearExtensometro, obtenerExtensometrosIdZona };

module.exports = { crearExtensometro, obtenerExtensometrosIdZona };
