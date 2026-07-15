const { query } = require('../config/db');
const { toAviso } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { paraUserId, leido } = req.query;
  const clauses = [];
  const values = [];

  if (paraUserId) {
    values.push(paraUserId);
    clauses.push(`para_user_id = $${values.length}`);
  }
  if (leido !== undefined) {
    values.push(leido === 'true');
    clauses.push(`leido = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT * FROM avisos ${where} ORDER BY fecha DESC, created_at DESC`,
    values
  );
  res.json(rows.map(toAviso));
});

const create = asyncHandler(async (req, res) => {
  const { paraUserId, tipo, titulo, detalle, fechaISO, hora } = req.body;

  if (!paraUserId || !tipo || !titulo || !fechaISO) {
    return res.status(400).json({ error: 'paraUserId, tipo, titulo y fechaISO son requeridos' });
  }

  const { rows } = await query(
    `INSERT INTO avisos (para_user_id, tipo, titulo, detalle, fecha, hora, leido)
     VALUES ($1, $2, $3, $4, $5, $6, FALSE)
     RETURNING *`,
    [paraUserId, tipo, titulo, detalle ?? null, fechaISO, hora ?? null]
  );

  res.status(201).json(toAviso(rows[0]));
});

const marcarLeido = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE avisos SET leido = TRUE WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Aviso no encontrado' });
  res.json(toAviso(rows[0]));
});

// Usado por "Limpiar todo" en la pantalla de avisos del usuario.
const removeAllForUser = asyncHandler(async (req, res) => {
  const { paraUserId } = req.query;
  if (!paraUserId) return res.status(400).json({ error: 'paraUserId es requerido' });

  await query('DELETE FROM avisos WHERE para_user_id = $1', [paraUserId]);
  res.status(204).send();
});

module.exports = { list, create, marcarLeido, removeAllForUser };
