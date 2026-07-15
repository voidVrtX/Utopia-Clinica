const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

function toDateOnly(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

async function citasReporte(estadoFiltro) {
  const clauses = [];
  const values = [];
  if (estadoFiltro) {
    values.push(estadoFiltro);
    clauses.push(`c.estado = $${values.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT c.*, up.nombre AS paciente_nombre, um.nombre AS medico_nombre
     FROM citas c
     JOIN usuarios up ON up.id = c.paciente_id
     JOIN usuarios um ON um.id = c.medico_id
     ${where}
     ORDER BY c.fecha DESC, c.hora DESC`,
    values
  );

  return rows.map((r) => ({
    id: r.id,
    fechaISO: toDateOnly(r.fecha),
    hora: r.hora,
    especialidad: r.especialidad,
    estado: r.estado,
    motivo: r.motivo ?? '',
    paciente: r.paciente_nombre,
    medico: r.medico_nombre,
  }));
}

async function pacientesReporte() {
  const { rows } = await query(`
    SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_nacimiento, u.created_at,
           COUNT(c.id)::int AS total_citas
    FROM usuarios u
    JOIN pacientes p ON p.id = u.id
    LEFT JOIN citas c ON c.paciente_id = p.id
    WHERE u.role = 'paciente'
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);

  return rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    email: r.email,
    telefono: r.telefono ?? '',
    fechaNacimiento: toDateOnly(r.fecha_nacimiento) ?? '',
    registradoEl: toDateOnly(r.created_at),
    totalCitas: r.total_citas,
  }));
}

async function medicosReporte() {
  const { rows } = await query(`
    SELECT u.id, u.nombre, m.especialidad, m.valoracion, m.num_opiniones, m.activo,
           COUNT(c.id)::int AS total_citas,
           COUNT(*) FILTER (WHERE c.estado = 'Completada')::int AS completadas,
           COUNT(*) FILTER (WHERE c.estado = 'Cancelada')::int AS canceladas
    FROM usuarios u
    JOIN medicos m ON m.id = u.id
    LEFT JOIN citas c ON c.medico_id = m.id
    WHERE u.role = 'medico'
    GROUP BY u.id, m.especialidad, m.valoracion, m.num_opiniones, m.activo
    ORDER BY total_citas DESC
  `);

  return rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    especialidad: r.especialidad,
    valoracion: r.valoracion !== null ? Number(r.valoracion) : null,
    numOpiniones: r.num_opiniones ?? 0,
    activo: r.activo,
    totalCitas: r.total_citas,
    completadas: r.completadas,
    canceladas: r.canceladas,
  }));
}

const REPORTES = {
  citas: () => citasReporte(),
  cancelaciones: () => citasReporte('Cancelada'),
  pacientes: () => pacientesReporte(),
  medicos: () => medicosReporte(),
};

const resumen = asyncHandler(async (req, res) => {
  const obtener = REPORTES[req.params.tipo];
  if (!obtener) return res.status(404).json({ error: 'Tipo de reporte no reconocido' });
  res.json(await obtener());
});

module.exports = { resumen, citasReporte, pacientesReporte, medicosReporte };
