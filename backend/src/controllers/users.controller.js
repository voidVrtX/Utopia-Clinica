const bcrypt = require('bcryptjs');
const { query } = require('../config/db');
const { toUser } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

// Actualiza el perfil propio (o cualquiera, si es admin).
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No puedes editar el perfil de otro usuario' });
  }

  const fields = {
    nombre: req.body.nombre,
    apellido_paterno: req.body.apellidoPaterno,
    apellido_materno: req.body.apellidoMaterno,
    telefono: req.body.telefono,
    fecha_nacimiento: req.body.fechaNacimiento,
    sexo: req.body.sexo,
    direccion: req.body.direccion,
    seguro_medico: req.body.seguroMedico,
    avatar_color: req.body.avatarColor,
    contacto_emergencia:
      req.body.contactoEmergencia !== undefined
        ? JSON.stringify(req.body.contactoEmergencia)
        : undefined,
  };

  if (req.body.password) {
    fields.password_hash = await bcrypt.hash(req.body.password, 10);
  }

  const entries = Object.entries(fields).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  const setClause = entries.map(([col], i) => `${col} = $${i + 2}`).join(', ');
  const values = entries.map(([, v]) => v);

  const { rows } = await query(
    `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

module.exports = { getById, update };
