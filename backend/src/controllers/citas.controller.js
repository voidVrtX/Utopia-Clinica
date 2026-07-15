const { query } = require('../config/db');
const { toCita } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { pacienteId, medicoId, fecha, estado } = req.query;
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
  if (fecha) {
    values.push(fecha);
    clauses.push(`fecha = $${values.length}`);
  }
  if (estado) {
    values.push(estado);
    clauses.push(`estado = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT * FROM citas ${where} ORDER BY fecha ASC, hora ASC`,
    values
  );
  res.json(rows.map(toCita));
});

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM citas WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(toCita(rows[0]));
});

const create = asyncHandler(async (req, res) => {
  const {
    pacienteId,
    medicoId,
    fechaISO,
    hora,
    especialidad,
    consultorio,
    motivo,
    estado,
    notasPaciente,
    historialRelevante,
  } = req.body;

  if (!pacienteId || !medicoId || !fechaISO || !hora || !especialidad) {
    return res
      .status(400)
      .json({ error: 'pacienteId, medicoId, fechaISO, hora y especialidad son requeridos' });
  }

  const { rows } = await query(
    `INSERT INTO citas (
      paciente_id, medico_id, fecha, hora, especialidad, consultorio,
      motivo, estado, notas_paciente, historial_relevante
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      pacienteId,
      medicoId,
      fechaISO,
      hora,
      especialidad,
      consultorio ?? null,
      motivo ?? null,
      estado ?? 'Pendiente',
      notasPaciente ?? null,
      historialRelevante ?? null,
    ]
  );

  res.status(201).json(toCita(rows[0]));
});

const update = asyncHandler(async (req, res) => {
  const fields = {
    fecha: req.body.fechaISO,
    hora: req.body.hora,
    especialidad: req.body.especialidad,
    consultorio: req.body.consultorio,
    motivo: req.body.motivo,
    estado: req.body.estado,
    notas_paciente: req.body.notasPaciente,
    historial_relevante: req.body.historialRelevante,
  };

  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const setClause = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
  const values = entries.map(([, v]) => v);

  const { rows } = await query(
    `UPDATE citas SET ${setClause} WHERE id = $1 RETURNING *`,
    [req.params.id, ...values]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(toCita(rows[0]));
});

const cancel = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE citas SET estado = 'Cancelada' WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(toCita(rows[0]));
});

module.exports = { list, getById, create, update, cancel };
