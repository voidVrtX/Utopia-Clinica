const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// IDs fijos para poder referenciar usuarios desde citas/recetas/avisos de forma determinista.
const IDS = {
  admin1: '00000000-0000-0000-0000-000000000001',
  farmacia1: '00000000-0000-0000-0000-000000000002',
  medico1: '00000000-0000-0000-0000-000000000003',
  medico2: '00000000-0000-0000-0000-000000000004',
  medico3: '00000000-0000-0000-0000-000000000005',
  medico4: '00000000-0000-0000-0000-000000000006',
  paciente1: '00000000-0000-0000-0000-000000000007',
  paciente2: '00000000-0000-0000-0000-000000000008',
};

const PWD = 'Utopia123';

async function seed() {
  const client = await pool.connect();
  try {
    const passwordHash = await bcrypt.hash(PWD, 10);

    await client.query('BEGIN');

    // Orden seguro por FKs: avisos/recetas/citas primero, luego users.
    await client.query('TRUNCATE avisos, recetas, citas, users RESTART IDENTITY CASCADE');

    const users = [
      {
        id: IDS.admin1,
        email: 'arlette_admin@utopia.com',
        role: 'admin',
        nombre: 'Arlette Domínguez',
      },
      {
        id: IDS.farmacia1,
        email: 'adan_farmacia@utopia.com',
        role: 'farmacia',
        nombre: 'Adán Ramírez',
      },
      {
        id: IDS.medico1,
        email: 'tovar_medico@utopia.com',
        role: 'medico',
        nombre: 'Dr. Arturo Tovar',
        especialidad: 'Cardiología',
        institucion: 'Utopía Clínica',
        anios_experiencia: '12 años',
        sobre_el_medico:
          'Médico especialista en cardiología con amplia experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.',
        areas_especialidad: ['Hipertensión', 'Enfermedades del corazón'],
        ubicacion_atencion: 'Av. Insurgentes Sur 1234 Col. del Valle',
        activo: true,
        valoracion: 4.8,
        num_opiniones: 128,
        telefono: '55 1234 5678',
        fecha_nacimiento: '1984-03-10',
        sexo: 'Masculino',
      },
      {
        id: IDS.medico2,
        email: 'carmen.lopez@utopia.com',
        role: 'medico',
        nombre: 'Dra. Carmen López',
        especialidad: 'Pediatría',
        institucion: 'Utopía Clínica',
        anios_experiencia: '8 años',
        sobre_el_medico: 'Especialista en pediatría, enfocada en el desarrollo integral de niñas y niños.',
        areas_especialidad: ['Control de niño sano', 'Vacunación'],
        ubicacion_atencion: 'Av. Insurgentes Sur 1234 Col. del Valle',
        activo: true,
        valoracion: 4.9,
        num_opiniones: 96,
        telefono: '55 2233 4455',
        fecha_nacimiento: '1990-07-02',
        sexo: 'Femenino',
      },
      {
        id: IDS.medico3,
        email: 'sofia.ramirez@utopia.com',
        role: 'medico',
        nombre: 'Dra. Sofía Ramírez',
        especialidad: 'Neurología',
        activo: false,
        valoracion: 4.6,
        num_opiniones: 54,
        telefono: '55 3344 5566',
      },
      {
        id: IDS.medico4,
        email: 'andres.martinez@utopia.com',
        role: 'medico',
        nombre: 'Dr. Andrés Martínez',
        especialidad: 'Dermatología',
        activo: true,
        valoracion: 4.7,
        num_opiniones: 72,
      },
      {
        id: IDS.paciente1,
        email: 'osbaldo_paciente@utopia.com',
        role: 'paciente',
        nombre: 'Osbaldo Venegas',
        fecha_nacimiento: '2003-08-25',
        sexo: 'Masculino',
        telefono: '55 1234 5678',
        direccion: '16 de septiembre 123, Toluca',
        seguro_medico: '12345566789',
        contacto_emergencia: {
          nombreCompleto: 'María Venegas',
          parentesco: 'Madre',
          telefono: '55 9988 7766',
        },
      },
      {
        id: IDS.paciente2,
        email: 'pedro.venegas@ejemplo.com',
        role: 'paciente',
        nombre: 'Pedro Venegas',
        fecha_nacimiento: '1984-08-25',
        sexo: 'Masculino',
        telefono: '55 1234 5678',
      },
    ];

    const insertUserSql = `
      INSERT INTO users (
        id, email, password_hash, role, nombre, apellido_paterno, apellido_materno,
        telefono, fecha_nacimiento, sexo, direccion, seguro_medico, avatar_color,
        contacto_emergencia, especialidad, institucion, anios_experiencia, sobre_el_medico,
        areas_especialidad, ubicacion_atencion, activo, valoracion, num_opiniones
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23
      )
    `;

    for (const u of users) {
      await client.query(insertUserSql, [
        u.id,
        u.email,
        passwordHash,
        u.role,
        u.nombre,
        u.apellido_paterno ?? null,
        u.apellido_materno ?? null,
        u.telefono ?? null,
        u.fecha_nacimiento ?? null,
        u.sexo ?? null,
        u.direccion ?? null,
        u.seguro_medico ?? null,
        u.avatar_color ?? null,
        u.contacto_emergencia ? JSON.stringify(u.contacto_emergencia) : null,
        u.especialidad ?? null,
        u.institucion ?? null,
        u.anios_experiencia ?? null,
        u.sobre_el_medico ?? null,
        u.areas_especialidad ?? null,
        u.ubicacion_atencion ?? null,
        u.activo ?? true,
        u.valoracion ?? null,
        u.num_opiniones ?? 0,
      ]);
    }

    const citas = [
      {
        paciente_id: IDS.paciente1,
        medico_id: IDS.medico2,
        fecha: '2026-06-12',
        hora: '10:30',
        especialidad: 'Cardiología',
        estado: 'Confirmada',
        motivo: 'Control de rutina',
      },
      {
        paciente_id: IDS.paciente1,
        medico_id: IDS.medico2,
        fecha: '2026-06-15',
        hora: '09:00',
        especialidad: 'Pediatría',
        estado: 'Pendiente',
      },
      {
        paciente_id: IDS.paciente1,
        medico_id: IDS.medico3,
        fecha: '2026-06-22',
        hora: '11:00',
        especialidad: 'Neurología',
        estado: 'Pendiente',
      },
      {
        paciente_id: IDS.paciente1,
        medico_id: IDS.medico4,
        fecha: '2026-05-03',
        hora: '10:00',
        especialidad: 'Dermatología',
        estado: 'Completada',
      },
      {
        paciente_id: IDS.paciente2,
        medico_id: IDS.medico1,
        fecha: '2026-06-10',
        hora: '09:00',
        especialidad: 'Cardiología',
        consultorio: 'Consultorio 1',
        motivo: 'Control de rutina',
        estado: 'Completada',
        notas_paciente: 'Molestia en el pecho al hacer esfuerzo',
        historial_relevante: ['Hipertensión', 'Alergia a la penicilina'],
      },
      {
        paciente_id: IDS.paciente2,
        medico_id: IDS.medico1,
        fecha: '2026-06-10',
        hora: '09:30',
        especialidad: 'Cardiología',
        consultorio: 'Consultorio 1',
        motivo: 'Electrocardiograma',
        estado: 'En consulta',
      },
      {
        paciente_id: IDS.paciente2,
        medico_id: IDS.medico1,
        fecha: '2026-06-10',
        hora: '10:00',
        especialidad: 'Cardiología',
        consultorio: 'Consultorio 1',
        motivo: 'Consulta inicial',
        estado: 'En sala de espera',
      },
      {
        paciente_id: IDS.paciente2,
        medico_id: IDS.medico1,
        fecha: '2026-06-10',
        hora: '10:30',
        especialidad: 'Cardiología',
        consultorio: 'Consultorio 1',
        motivo: 'Seguimiento',
        estado: 'Cancelada',
      },
    ];

    const insertCitaSql = `
      INSERT INTO citas (
        paciente_id, medico_id, fecha, hora, especialidad, consultorio,
        motivo, estado, notas_paciente, historial_relevante
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

    const citaIds = [];
    for (const c of citas) {
      const { rows } = await client.query(insertCitaSql, [
        c.paciente_id,
        c.medico_id,
        c.fecha,
        c.hora,
        c.especialidad,
        c.consultorio ?? null,
        c.motivo ?? null,
        c.estado,
        c.notas_paciente ?? null,
        c.historial_relevante ?? null,
      ]);
      citaIds.push(rows[0].id);
    }

    const insertRecetaSql = `
      INSERT INTO recetas (
        codigo_qr, paciente_id, medico_id, cita_id, fecha, diagnostico,
        tratamiento, observaciones, presion_arterial, temperatura, valida
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await client.query(insertRecetaSql, [
      `QR-${Date.now().toString(36)}`,
      IDS.paciente1,
      IDS.medico2,
      citaIds[0],
      '2026-06-12',
      'Migraña tensional',
      'Paracetamol 500mg cada 8h por 3 días. Reposo. Mantener hidratación.',
      'Si el dolor persiste por más de 72 horas o se acompaña de otros síntomas, regresar para valoración.',
      '120/80 mmHg',
      '36.7 °C',
      true,
    ]);

    const insertAvisoSql = `
      INSERT INTO avisos (para_user_id, tipo, titulo, detalle, fecha, hora, leido)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const hoyISO = citas[0].fecha; // referencia estable para el seed
    await client.query(insertAvisoSql, [
      IDS.paciente1,
      'Cita Confirmada',
      'Cita Confirmada',
      'Tu cita de Cardiología ha sido confirmada.',
      hoyISO,
      null,
      false,
    ]);
    await client.query(insertAvisoSql, [
      IDS.paciente1,
      'Recordatorio',
      'Recordatorio',
      'No olvides tu cita mañana a las 10:30 AM.',
      hoyISO,
      null,
      false,
    ]);
    await client.query(insertAvisoSql, [
      'admin',
      'Mantenimiento programado',
      'Mantenimiento programado',
      'Domingo 16 de junio 2026, 09:50 AM',
      '2026-06-16',
      '09:50 AM',
      false,
    ]);
    await client.query(insertAvisoSql, [
      'admin',
      'Mantenimiento programado',
      'Mantenimiento programado',
      'Domingo 25 de junio 2026, 10:15 AM',
      '2026-06-25',
      '10:15 AM',
      false,
    ]);

    await client.query('COMMIT');
    console.log('Seed completado. Usuarios de prueba (password para todos: "Utopia123"):');
    users.forEach((u) => console.log(`  - [${u.role}] ${u.email}`));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
