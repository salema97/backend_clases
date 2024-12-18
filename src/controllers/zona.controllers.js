const { Zona } = require("../models/associations");

const getZonas = async (req, res) => {
  try {
    const zonas = await Zona.findAll();

    if (zonas.length === 0) {
      return res.status(404).json({ message: "No se encontraron zonas" });
    }

    res.status(200).json(zonas);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al obtener las zonas: ${error}` });
  }
};

const getZonaById = async (req, res) => {
  try {
    const { id } = req.query;

    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: "No se encontró la zona" });
    }

    res.status(200).json(zona);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al obtener la zona: ${error}` });
  }
};

const createZona = async (req, res) => {
  try {
    const { name } = req.body;

    const zonaExistente = await Zona.findOne({ where: { name } });

    if (zonaExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe una zona con ese nombre" });
    }

    const zona = await Zona.create({
      name,
    });

    res.status(201).json(zona);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al crear la zona: ${error}` });
  }
};

const updateZona = async (req, res) => {
  try {
    const { id } = req.query;
    const { name } = req.body;

    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: "No se encontró la zona" });
    }

    const zonaExistente = await Zona.findOne({ where: { name } });
    if (zonaExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe una zona con ese nombre" });
    }

    zona.name = name;
    await zona.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al actualizar la zona: ${error}` });
  }
};

const deleteZona = async (req, res) => {
  try {
    const { id } = req.query;

    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: "No se encontró la zona" });
    }

    await zona.destroy();
    res.status(204).json({ message: `Zona ${id} fue eliminada correctamente` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Hubo un error al eliminar la zona: ${error}` });
  }
};

module.exports = {
  getZonas,
  getZonaById,
  createZona,
  updateZona,
  deleteZona,
};
