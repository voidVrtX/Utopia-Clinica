const { query } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { streamPDF, streamExcel } = require('../utils/reportFiles');
const { citasReporte, pacientesReporte, medicosReporte } = require('./reportes.controller');

function toDateOnly(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

const CITAS_COLUMNAS = [
  { label: 'Fecha', key: 'fechaISO', width: 14 },
  { label: 'Hora', key: 'hora', width: 10 },
  { label: 'Especialidad', key: 'especialidad', width: 20 },
  { label: 'Paciente', key: 'paciente', width: 26 },
  { label: 'Médico', key: 'medico', width: 26 },
  { label: 'Estado', key: 'estado', width: 18 },
  { label: 'Motivo', key: 'motivo', width: 34 },
];

const PACIENTES_COLUMNAS = [
  { label: 'Nombre', key: 'nombre', width: 26 },
  { label: 'Correo', key: 'email', width: 28 },
  { label: 'Teléfono', key: 'telefono', width: 18 },
  { label: 'Fecha de nacimiento', key: 'fechaNacimiento', width: 18 },
  { label: 'Registrado el', key: 'registradoEl', width: 16 },
  { label: 'Total de citas', key: 'totalCitas', width: 14 },
];

const MEDICOS_COLUMNAS = [
  { label: 'Nombre', key: 'nombre', width: 26 },
  { label: 'Especialidad', key: 'especialidad', width: 20 },
  { label: 'Activo', key: 'activo', width: 10 },
  { label: 'Valoración', key: 'valoracion', width: 12 },
  { label: 'Opiniones', key: 'numOpiniones', width: 12 },
  { label: 'Total de citas', key: 'totalCitas', width: 14 },
  { label: 'Completadas', key: 'completadas', width: 14 },
  { label: 'Canceladas', key: 'canceladas', width: 14 },
];

function serializarCitas(rows) {
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

// Médicos solo pueden exportar su propio historial de citas; admin puede
// filtrar por médico/paciente o exportar todo.
async function citasParaExport(req) {
  const clauses = [];
  const values = [];

  if (req.user.role === 'medico') {
    values.push(req.user.id);
    clauses.push(`c.medico_id = $${values.length}`);
  } else if (req.query.medicoId) {
    values.push(req.query.medicoId);
    clauses.push(`c.medico_id = $${values.length}`);
  }
  if (req.query.pacienteId) {
    values.push(req.query.pacienteId);
    clauses.push(`c.paciente_id = $${values.length}`);
  }
  if (req.query.startDate) {
    values.push(req.query.startDate);
    clauses.push(`c.fecha >= $${values.length}`);
  }
  if (req.query.endDate) {
    values.push(req.query.endDate);
    clauses.push(`c.fecha <= $${values.length}`);
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
  return serializarCitas(rows);
}

const exportarCitasPDF = asyncHandler(async (req, res) => {
  const filas = await citasParaExport(req);
  streamPDF(res, { archivo: 'historial-utopia', titulo: 'Historial de citas', columnas: CITAS_COLUMNAS, filas });
});

const exportarCitasExcel = asyncHandler(async (req, res) => {
  const filas = await citasParaExport(req);
  await streamExcel(res, { archivo: 'historial-utopia', titulo: 'Historial de citas', columnas: CITAS_COLUMNAS, filas });
});

const exportarCancelacionesPDF = asyncHandler(async (req, res) => {
  const filas = await citasReporte('Cancelada');
  streamPDF(res, { archivo: 'cancelaciones-utopia', titulo: 'Citas canceladas', columnas: CITAS_COLUMNAS, filas });
});

const exportarCancelacionesExcel = asyncHandler(async (req, res) => {
  const filas = await citasReporte('Cancelada');
  await streamExcel(res, { archivo: 'cancelaciones-utopia', titulo: 'Citas canceladas', columnas: CITAS_COLUMNAS, filas });
});

const exportarPacientesPDF = asyncHandler(async (req, res) => {
  const filas = await pacientesReporte();
  streamPDF(res, { archivo: 'pacientes-utopia', titulo: 'Reporte de pacientes', columnas: PACIENTES_COLUMNAS, filas });
});

const exportarPacientesExcel = asyncHandler(async (req, res) => {
  const filas = await pacientesReporte();
  await streamExcel(res, { archivo: 'pacientes-utopia', titulo: 'Reporte de pacientes', columnas: PACIENTES_COLUMNAS, filas });
});

const exportarMedicosPDF = asyncHandler(async (req, res) => {
  const filas = (await medicosReporte()).map((m) => ({ ...m, activo: m.activo ? 'Sí' : 'No' }));
  streamPDF(res, { archivo: 'medicos-utopia', titulo: 'Reporte de médicos', columnas: MEDICOS_COLUMNAS, filas });
});

const exportarMedicosExcel = asyncHandler(async (req, res) => {
  const filas = (await medicosReporte()).map((m) => ({ ...m, activo: m.activo ? 'Sí' : 'No' }));
  await streamExcel(res, { archivo: 'medicos-utopia', titulo: 'Reporte de médicos', columnas: MEDICOS_COLUMNAS, filas });
});

module.exports = {
  exportarCitasPDF,
  exportarCitasExcel,
  exportarCancelacionesPDF,
  exportarCancelacionesExcel,
  exportarPacientesPDF,
  exportarPacientesExcel,
  exportarMedicosPDF,
  exportarMedicosExcel,
};
