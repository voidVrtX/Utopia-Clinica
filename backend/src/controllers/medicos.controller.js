const bcrypt = require('bcryptjs');
const { query, pool } = require('../config/db');
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
    `SELECT * FROM usuarios_completos WHERE ${clauses.join(' AND ')} ORDER BY nombre ASC`,
    values
  );
  res.json(rows.map(toUser));
});

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query(`SELECT * FROM usuarios_completos WHERE id = $1 AND role = 'medico'`, [
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
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: usuarioRows } = await client.query(
      `INSERT INTO usuarios (email, password_hash, role, nombre, telefono, fecha_nacimiento, sexo)
       VALUES ($1, $2, 'medico', $3, $4, $5, $6)
       RETURNING id`,
      [email.toLowerCase(), passwordHash, nombre, telefono ?? null, fechaNacimiento ?? null, sexo ?? null]
    );

    const medicoId = usuarioRows[0].id;

    await client.query(
      `INSERT INTO medicos (
        id, especialidad, institucion, anios_experiencia, sobre_el_medico,
        areas_especialidad, ubicacion_atencion, activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [
        medicoId,
        especialidad,
        institucion ?? null,
        aniosExperiencia ?? null,
        sobreElMedico ?? null,
        areasEspecialidad ?? null,
        ubicacionAtencion ?? null,
      ]
    );

    await client.query('COMMIT');

    const { rows } = await client.query('SELECT * FROM usuarios_completos WHERE id = $1', [medicoId]);
    res.status(201).json(toUser(rows[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ese correo ya está registrado.' });
    }
    throw err;
  } finally {
    client.release();
  }
});

const update = asyncHandler(async (req, res) => {
  const usuarioFields = {
    nombre: req.body.nombre,
    telefono: req.body.telefono,
  };
  const medicoFields = {
    especialidad: req.body.especialidad,
    institucion: req.body.institucion,
    anios_experiencia: req.body.aniosExperiencia,
    sobre_el_medico: req.body.sobreElMedico,
    areas_especialidad: req.body.areasEspecialidad,
    ubicacion_atencion: req.body.ubicacionAtencion,
    activo: req.body.activo,
  };

  const usuarioEntries = Object.entries(usuarioFields).filter(([, v]) => v !== undefined);
  const medicoEntries = Object.entries(medicoFields).filter(([, v]) => v !== undefined);

  if (usuarioEntries.length === 0 && medicoEntries.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (usuarioEntries.length > 0) {
      const setClause = usuarioEntries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
      const values = usuarioEntries.map(([, v]) => v);
      await client.query(
        `UPDATE usuarios SET ${setClause} WHERE id = $1 AND role = 'medico'`,
        [req.params.id, ...values]
      );
    }

    if (medicoEntries.length > 0) {
      const setClause = medicoEntries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
      const values = medicoEntries.map(([, v]) => v);
      await client.query(`UPDATE medicos SET ${setClause} WHERE id = $1`, [req.params.id, ...values]);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const { rows } = await query(`SELECT * FROM usuarios_completos WHERE id = $1 AND role = 'medico'`, [
    req.params.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Médico no encontrado' });
  res.json(toUser(rows[0]));
});

const remove = asyncHandler(async (req, res) => {
  const { rowCount } = await query(`DELETE FROM usuarios WHERE id = $1 AND role = 'medico'`, [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ error: 'Médico no encontrado' });
  res.status(204).send();
});

module.exports = { list, getById, create, update, remove };
