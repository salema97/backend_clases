const express = require("express");
const cors = require("cors");
const InfoRoutes = require("./routes/info.routes");
const AccountRoutes = require("./routes/account.routes");
const ZonaRoutes = require("./routes/zona.routes");
const ExtensometroRoutes = require("./routes/extensometro.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/account", AccountRoutes);
app.use("/api/zona", ZonaRoutes);
app.use("/api/extensometro", ExtensometroRoutes);
app.use("/api/info", InfoRoutes);

module.exports = app;
