const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { toUser } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { especialidad, activo } = req.query;
  const clauses = [`role = 'medico'`];
  const values = [];

  if (especialidad) {
    values.push(especialidad);
    clauses.push(`especialidad = $${values.length}`);
  }
  if (activo !== undefined) {
    values.push(activo === 'true');
    clauses.push(`activo = $${values.length}`);
  }

  const { rows } = await query(
    `SELECT * FROM users WHERE ${clauses.join(' AND ')} ORDER BY nombre ASC`,
    values
  );
  res.json(rows.map(toUser));
});

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query(`SELECT * FROM users WHERE id = $1 AND role = 'medico'`, [
    req.params.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Médico no encontrado' });
  res.json(toUser(rows[0]));
});

// Solo admin da de alta médicos.
const create = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    nombre,
    especialidad,
    institucion,
    aniosExperiencia,
    sobreElMedico,
    areasEspecialidad,
    ubicacionAtencion,
    telefono,
    fechaNacimiento,
    sexo,
  } = req.body;

  if (!email || !password || !nombre || !especialidad) {
    return res.status(400).json({ error: 'email, password, nombre y especialidad son requeridos' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await query(
    `INSERT INTO users (
      email, password_hash, role, nombre, especialidad, institucion, anios_experiencia,
      sobre_el_medico, areas_especialidad, ubicacion_atencion, telefono, fecha_nacimiento,
      sexo, activo
    ) VALUES ($1, $2, 'medico', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE)
    RETURNING *`,
    [
      email.toLowerCase(),
      passwordHash,
      nombre,
      especialidad,
      institucion ?? null,
      aniosExperiencia ?? null,
      sobreElMedico ?? null,
      areasEspecialidad ?? null,
      ubicacionAtencion ?? null,
      telefono ?? null,
      fechaNacimiento ?? null,
      sexo ?? null,
    ]
  );

  res.status(201).json(toUser(rows[0]));
});

const update = asyncHandler(async (req, res) => {
  const fields = {
    nombre: req.body.nombre,
    especialidad: req.body.especialidad,
    institucion: req.body.institucion,
    anios_experiencia: req.body.aniosExperiencia,
    sobre_el_medico: req.body.sobreElMedico,
    areas_especialidad: req.body.areasEspecialidad,
    ubicacion_atencion: req.body.ubicacionAtencion,
    telefono: req.body.telefono,
    activo: req.body.activo,
  };

  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const setClause = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
  const values = entries.map(([, v]) => v);

  const { rows } = await query(
    `UPDATE users SET ${setClause} WHERE id = $1 AND role = 'medico' RETURNING *`,
    [req.params.id, ...values]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Médico no encontrado' });
  res.json(toUser(rows[0]));
});

const remove = asyncHandler(async (req, res) => {
  const { rowCount } = await query(`DELETE FROM users WHERE id = $1 AND role = 'medico'`, [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ error: 'Médico no encontrado' });
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
