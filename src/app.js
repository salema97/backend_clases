const express = require("express");
const cors = require("cors");
const DesplazamientoRoutes = require("./routes/desplazamiento.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/desplazamiento", DesplazamientoRoutes);

module.exports = app;
