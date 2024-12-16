const Info = require("../models/info");

const obtenerTodosDesplazamientos = async (_, res) => {
  try {
    const desplazamientos = await Info.findAll();

    if (desplazamientos.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay desplazamientos en la base de datos" });
    }

    res.status(200).json(desplazamientos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hubo un error al obtener los desplazamientos" });
  }
};

module.exports = { obtenerTodosDesplazamientos };
