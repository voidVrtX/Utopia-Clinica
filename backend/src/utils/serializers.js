// Convierte filas snake_case de PostgreSQL al shape camelCase que usan
// los modelos TypeScript de la app móvil (src/models/*.ts).

function toDateOnly(value) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString().slice(0, 10) : value;
}

function toUser(row) {
  if (!row) return null;
  const base = {
    id: row.id,
    email: row.email,
    role: row.role,
    nombre: row.nombre,
    apellidoPaterno: row.apellido_paterno ?? undefined,
    apellidoMaterno: row.apellido_materno ?? undefined,
    telefono: row.telefono ?? undefined,
    fechaNacimiento: toDateOnly(row.fecha_nacimiento),
    sexo: row.sexo ?? undefined,
    direccion: row.direccion ?? undefined,
    seguroMedico: row.seguro_medico ?? undefined,
    avatarColor: row.avatar_color ?? undefined,
  };

  if (row.role === 'paciente') {
    base.tipoSangre = row.tipo_sangre ?? undefined;
    base.alergias = row.alergias ?? undefined;
    base.contactoEmergencia = row.contacto_emergencia ?? undefined;
  }

  if (row.role === 'medico') {
    base.especialidad = row.especialidad ?? undefined;
    base.institucion = row.institucion ?? undefined;
    base.aniosExperiencia = row.anios_experiencia ?? undefined;
    base.sobreElMedico = row.sobre_el_medico ?? undefined;
    base.areasEspecialidad = row.areas_especialidad ?? undefined;
    base.ubicacionAtencion = row.ubicacion_atencion ?? undefined;
    base.activo = row.activo;
    base.valoracion = row.valoracion !== null ? Number(row.valoracion) : undefined;
    base.numOpiniones = row.num_opiniones ?? undefined;
  }

  return base;
}

function toCita(row) {
  if (!row) return null;
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    medicoId: row.medico_id,
    fechaISO: toDateOnly(row.fecha),
    hora: row.hora,
    especialidad: row.especialidad,
    consultorio: row.consultorio ?? undefined,
    motivo: row.motivo ?? undefined,
    estado: row.estado,
    notasPaciente: row.notas_paciente ?? undefined,
    historialRelevante: row.historial_relevante ?? undefined,
    createdAt: row.created_at,
  };
}

function toReceta(row) {
  if (!row) return null;
  return {
    id: row.id,
    codigoQR: row.codigo_qr,
    pacienteId: row.paciente_id,
    medicoId: row.medico_id,
    citaId: row.cita_id ?? undefined,
    fecha: toDateOnly(row.fecha),
    diagnostico: row.diagnostico ?? undefined,
    tratamiento: row.tratamiento ?? undefined,
    observaciones: row.observaciones ?? undefined,
    presionArterial: row.presion_arterial ?? undefined,
    temperatura: row.temperatura ?? undefined,
    valida: row.valida,
    invalidadaEn: row.invalidada_en ?? undefined,
    invalidadaPor: row.invalidada_por ?? undefined,
  };
}

function toAviso(row) {
  if (!row) return null;
  return {
    id: row.id,
    paraUserId: row.para_user_id,
    tipo: row.tipo,
    titulo: row.titulo,
    detalle: row.detalle ?? undefined,
    fechaISO: toDateOnly(row.fecha),
    hora: row.hora ?? undefined,
    leido: row.leido,
  };
}

module.exports = { toUser, toCita, toReceta, toAviso };
