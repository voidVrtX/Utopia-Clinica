const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { toUser } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' });
  }

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const row = rows[0];

  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = signToken(row);
  res.json({ token, user: toUser(row) });
});

// Solo pacientes pueden autorregistrarse (médicos los da de alta el admin).
const register = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    fechaNacimiento,
    sexo,
    direccion,
    seguroMedico,
    contactoEmergencia,
  } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'email, password y nombre son requeridos' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await query(
    `INSERT INTO users (
      email, password_hash, role, nombre, apellido_paterno, apellido_materno,
      telefono, fecha_nacimiento, sexo, direccion, seguro_medico, contacto_emergencia
    ) VALUES ($1, $2, 'paciente', $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      email.toLowerCase(),
      passwordHash,
      nombre,
      apellidoPaterno ?? null,
      apellidoMaterno ?? null,
      telefono ?? null,
      fechaNacimiento ?? null,
      sexo ?? null,
      direccion ?? null,
      seguroMedico ?? null,
      contactoEmergencia ? JSON.stringify(contactoEmergencia) : null,
    ]
  );

  const user = rows[0];
  const token = signToken(user);
  res.status(201).json({ token, user: toUser(user) });
});

const me = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

module.exports = { login, register, me };
