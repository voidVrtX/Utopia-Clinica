const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, pool } = require('../config/db');
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

  const { rows } = await query('SELECT * FROM usuarios_completos WHERE email = $1', [
    email.toLowerCase(),
  ]);
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
    tipoSangre,
    alergias,
    contactoEmergencia,
  } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'email, password y nombre son requeridos' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows: usuarioRows } = await client.query(
      `INSERT INTO usuarios (
        email, password_hash, role, nombre, apellido_paterno, apellido_materno,
        telefono, fecha_nacimiento, sexo, direccion
      ) VALUES ($1, $2, 'paciente', $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
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
      ]
    );

    const userId = usuarioRows[0].id;

    await client.query(
      `INSERT INTO pacientes (id, seguro_medico, tipo_sangre, alergias, contacto_emergencia)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        seguroMedico ?? null,
        tipoSangre ?? null,
        alergias ?? null,
        contactoEmergencia ? JSON.stringify(contactoEmergencia) : null,
      ]
    );

    await client.query('COMMIT');

    const { rows } = await client.query('SELECT * FROM usuarios_completos WHERE id = $1', [userId]);
    const user = rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user: toUser(user) });
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

const me = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM usuarios_completos WHERE id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(toUser(rows[0]));
});

// Usado por el formulario de registro para avisar en tiempo real si el correo ya existe.
const checkEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email es requerido' });

  const { rows } = await query('SELECT 1 FROM usuarios WHERE email = $1', [
    String(email).toLowerCase(),
  ]);
  res.json({ exists: rows.length > 0 });
});

module.exports = { login, register, me, checkEmail };
