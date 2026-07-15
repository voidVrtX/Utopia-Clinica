const crypto = require('crypto');
const { query } = require('../config/db');
const { toReceta } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

function generarCodigoQR() {
  return `QR-${Date.now().toString(36)}${crypto.randomBytes(4).toString('hex')}`;
}

const list = asyncHandler(async (req, res) => {
  const { pacienteId, medicoId, valida } = req.query;
  const clauses = [];
  const values = [];

  if (pacienteId) {
    values.push(pacienteId);
    clauses.push(`paciente_id = $${values.length}`);
  }
  if (medicoId) {
    values.push(medicoId);
    clauses.push(`medico_id = $${values.length}`);
  }
  if (valida !== undefined) {
    values.push(valida === 'true');
    clauses.push(`valida = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT * FROM recetas ${where} ORDER BY fecha DESC`,
    values
  );
  res.json(rows.map(toReceta));
});

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM recetas WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Receta no encontrada' });
  res.json(toReceta(rows[0]));
});

// Usado por Farmacia al escanear el QR.
const getByCodigoQR = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM recetas WHERE codigo_qr = $1', [
    req.params.codigoQR,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Receta no encontrada para ese código' });
  res.json(toReceta(rows[0]));
});

const create = asyncHandler(async (req, res) => {
  const {
    pacienteId,
    medicoId,
    citaId,
    fecha,
    diagnostico,
    tratamiento,
    observaciones,
    presionArterial,
    temperatura,
  } = req.body;

  if (!pacienteId || !medicoId || !fecha) {
    return res.status(400).json({ error: 'pacienteId, medicoId y fecha son requeridos' });
  }

  const { rows } = await query(
    `INSERT INTO recetas (
      codigo_qr, paciente_id, medico_id, cita_id, fecha, diagnostico,
      tratamiento, observaciones, presion_arterial, temperatura, valida
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
    RETURNING *`,
    [
      generarCodigoQR(),
      pacienteId,
      medicoId,
      citaId ?? null,
      fecha,
      diagnostico ?? null,
      tratamiento ?? null,
      observaciones ?? null,
      presionArterial ?? null,
      temperatura ?? null,
    ]
  );

  res.status(201).json(toReceta(rows[0]));
});

// Usado por Farmacia al confirmar la entrega: invalida la receta para que no se reutilice.
const invalidar = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE recetas
     SET valida = FALSE, invalidada_en = now(), invalidada_por = $2
     WHERE id = $1 AND valida = TRUE
     RETURNING *`,
    [req.params.id, req.user.id]
  );

  if (!rows[0]) {
    return res.status(409).json({ error: 'La receta no existe o ya fue invalidada' });
  }
  res.json(toReceta(rows[0]));
});

module.exports = { list, getById, getByCodigoQR, create, invalidar };
