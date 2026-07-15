const bcrypt = require('bcryptjs');
const { query, pool } = require('../config/db');
const { toUser } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM usuarios_completos WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

// Actualiza el perfil propio (o cualquiera, si es admin). Reparte los campos
// entre "usuarios" (comunes) y "pacientes" (propios de ese rol).
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No puedes editar el perfil de otro usuario' });
  }

  const usuarioFields = {
    nombre: req.body.nombre,
    apellido_paterno: req.body.apellidoPaterno,
    apellido_materno: req.body.apellidoMaterno,
    telefono: req.body.telefono,
    fecha_nacimiento: req.body.fechaNacimiento,
    sexo: req.body.sexo,
    direccion: req.body.direccion,
    avatar_color: req.body.avatarColor,
  };
  if (req.body.password) {
    usuarioFields.password_hash = await bcrypt.hash(req.body.password, 10);
  }

  const pacienteFields = {
    seguro_medico: req.body.seguroMedico,
    tipo_sangre: req.body.tipoSangre,
    alergias: req.body.alergias,
    contacto_emergencia:
      req.body.contactoEmergencia !== undefined
        ? JSON.stringify(req.body.contactoEmergencia)
        : undefined,
  };

  const usuarioEntries = Object.entries(usuarioFields).filter(([, v]) => v !== undefined);
  const pacienteEntries = Object.entries(pacienteFields).filter(([, v]) => v !== undefined);

  if (usuarioEntries.length === 0 && pacienteEntries.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (usuarioEntries.length > 0) {
      const setClause = usuarioEntries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
      const values = usuarioEntries.map(([, v]) => v);
      const result = await client.query(
        `UPDATE usuarios SET ${setClause} WHERE id = $1 RETURNING id`,
        [id, ...values]
      );
      if (!result.rows[0]) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
    }

    if (pacienteEntries.length > 0) {
      const setClause = pacienteEntries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
      const values = pacienteEntries.map(([, v]) => v);
      await client.query(`UPDATE pacientes SET ${setClause} WHERE id = $1`, [id, ...values]);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const { rows } = await query('SELECT * FROM usuarios_completos WHERE id = $1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

module.exports = { getById, update };
