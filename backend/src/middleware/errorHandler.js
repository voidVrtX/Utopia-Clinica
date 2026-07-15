function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'El registro ya existe (valor duplicado)' });
  }
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referencia inválida (clave foránea no encontrada)' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
}

module.exports = { notFound, errorHandler };
