const errorHandler = (err, _, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(500).json({ error: `JSON ERROR: ${err.message}` });
  }

  res.status(500).json({ error: `Hubo un error: ${err.message}` });
  next();
};

const notFoundHandler = (_, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

module.exports = { errorHandler, notFoundHandler };
