const { Info, Extensometro } = require("../models/associations");
const {
  sendCustomNotificationToAll,
} = require("../utils/one.signal.notification");
const { Op } = require("sequelize");
const PDFDocument = require("pdfkit");
const { sendReportEmail } = require("../utils/email.utils");

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

    if (desplazamientoLineal > 1) {
      sendCustomNotificationToAll(
        "Alerta",
        "Desplazamiento de tierra detectado"
      );
    }

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

const generarReporte = async (req, res) => {
  try {
    const { extensometroId } = req.query;
    const { fechaInicio, fechaFin, email } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Las fechas de inicio y fin son requeridas",
      });
    }

    const convertirFecha = (fecha) => {
      const [dia, mes, anio] = fecha.split("/");
      return `${anio}-${mes}-${dia}`;
    };

    const fechaInicioConvertida = convertirFecha(fechaInicio);
    const fechaFinConvertida = convertirFecha(fechaFin);

    const fechaFinMasUnDia = new Date(fechaFinConvertida);
    fechaFinMasUnDia.setDate(fechaFinMasUnDia.getDate() + 1);

    const info = await Info.findAll({
      where: {
        extensometroId,
        createdAt: {
          [Op.between]: [new Date(fechaInicioConvertida), fechaFinMasUnDia],
        },
      },
      order: [["createdAt", "ASC"]],
    });
    if (info.length < 2) {
      return res.status(404).json({
        message: "Se necesitan al menos dos registros para generar el reporte",
      });
    }

    const previousInfo = info[0];
    const currentInfo = info[info.length - 1];

    const intervalDays =
      (new Date(currentInfo.createdAt) - new Date(previousInfo.createdAt)) /
      (1000 * 60 * 60 * 24);
    const displacement =
      previousInfo.desplazamientoLineal - currentInfo.desplazamientoLineal;
    const velocity = displacement / intervalDays;

    const getSoilMoistureDescription = (humedad) => {
      if (humedad < 20) return "Seco";
      else if (humedad < 40) return "Ligeramente Seco";
      else if (humedad < 60) return "Moderadamente Húmedo";
      else if (humedad < 80) return "Húmedo";
      else return "Muy Húmedo";
    };

    const getWeatherDescription = (esDia, temperatura) => {
      if (esDia) {
        if (temperatura > 30) return "Soleado";
        else if (temperatura > 20) return "Parcialmente Nublado";
        else return "Nublado";
      } else {
        if (temperatura > 20) return "Despejado";
        else if (temperatura > 10) return "Parcialmente Nublado";
        else return "Nublado";
      }
    };

    const getVelocityDescription = (vel) => {
      if (vel < 4.38356e-5) return "Extremadamente lento";
      else if (vel < 0.00274) return "Muy lento";
      else if (vel < 0.43) return "Lento";
      else if (vel < 43.2) return "Moderado";
      else if (vel < 4320) return "Rápido";
      else if (vel < 432000) return "Muy rápido";
      else return "Extremadamente rápido";
    };

    const getVelocityLimit = (vel) => {
      if (vel < 4.38356e-5) return "0.0000438 [m/dia]";
      else if (vel < 0.00274) return "0.00274 [m/dia]";
      else if (vel < 0.43) return "0.43 [m/dia]";
      else if (vel < 43.2) return "43.2 [m/dia]";
      else if (vel < 4320) return "4320 [m/dia]";
      else if (vel < 432000) return "432000 [m/dia]";
      else return "> 432000 [m/dia]";
    };

    const weatherDescription = getWeatherDescription(
      currentInfo.esDia,
      currentInfo.temperaturaMAX6675
    );
    const soilMoistureDescription = getSoilMoistureDescription(
      currentInfo.humedadRelativa
    );
    const velocityDescription = getVelocityDescription(velocity);
    const velocityLimit = getVelocityLimit(velocity);

    const doc = new PDFDocument({ size: "A4", margin: 20 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      try {
        if (email) {
          await sendReportEmail(email, pdfBuffer);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=reporte.pdf"
        );
        res.send(pdfBuffer);
      } catch (error) {
        console.error("Error sending response:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error generando el reporte" });
        }
      }
    });

    doc.image("src/assets/Imagen2.png", 20, 20, { width: 50 });
    doc.image("src/assets/Imagen1.png", 470, 20, { width: 80 });

    doc
      .fontSize(10)
      .text("Reporte de Resultados Extensometros GADMCA", { align: "center" })
      .moveDown();

    const drawCell = (text, x, y, width, height, align = "left") => {
      doc.rect(x, y, width, height).stroke();
      doc.text(text, x + 5, y + 5, { width: width - 10, align });
    };

    drawCell("Lectura de extensómetro: [cm]", 20, 200, 150, 50);
    drawCell(
      previousInfo.desplazamientoLineal.toString(),
      170,
      200,
      50,
      25,
      "center"
    );
    drawCell(
      currentInfo.desplazamientoLineal.toString(),
      170,
      225,
      50,
      25,
      "center"
    );
    drawCell(displacement.toFixed(2), 220, 200, 50, 50, "center");

    drawCell("Fecha anterior lectura", 270, 200, 150, 25);
    drawCell(
      new Date(previousInfo.createdAt).toLocaleDateString(),
      420,
      200,
      150,
      25,
      "center"
    );
    drawCell("Fecha actual lectura", 270, 225, 150, 25);
    drawCell(
      new Date(currentInfo.createdAt).toLocaleDateString(),
      420,
      225,
      150,
      25,
      "center"
    );

    drawCell("Humedad del suelo:", 20, 250, 150, 25);
    drawCell(soilMoistureDescription, 170, 250, 100, 25, "center");
    drawCell("Intervalo tiempo (días)", 270, 250, 150, 25);
    drawCell(intervalDays.toFixed(2), 420, 250, 150, 25, "center");

    drawCell("Clima:", 20, 275, 150, 25);
    drawCell(weatherDescription, 170, 275, 100, 25, "center");
    drawCell("Velocidad: [mm/día]", 270, 275, 150, 25);
    drawCell(velocity.toFixed(2), 420, 275, 150, 25, "center");

    drawCell("Tipo de material:", 20, 300, 150, 25);
    drawCell("Matriz Compuesta", 170, 300, 100, 25, "center");
    drawCell("Descripción de velocidad", 270, 300, 150, 25);
    drawCell(velocityDescription, 420, 300, 150, 25, "center");

    drawCell("Límite de velocidad", 270, 325, 150, 25);
    drawCell(velocityLimit, 420, 325, 150, 25, "center");

    doc.end();
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        message: `Hubo un error al generar el reporte: ${error}`,
      });
    }
  }
};

module.exports = {
  obtenerTodaInfo,
  obtenerInfoPorId,
  obtenerInfoPorExtensometroId,
  crearInfo,
  actualizarInfo,
  eliminarInfo,
  generarReporte,
};
