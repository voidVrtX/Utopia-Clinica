const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const values = [];
  let where = '';

  if (q.length > 0) {
    values.push(`%${q.toLowerCase()}%`);
    where = `WHERE lower(nombre) LIKE $1 OR lower(principio_activo) LIKE $1`;
  }

  const { rows } = await query(
    `SELECT id, nombre, principio_activo, presentacion FROM medicamentos_catalogo ${where} ORDER BY nombre LIMIT 30`,
    values
  );

  res.json(rows);
});

module.exports = { search };
