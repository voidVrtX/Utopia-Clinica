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

    // Orden seguro por FKs: hojas primero, tablas base al final.
    await client.query(
      'TRUNCATE avisos, recetas, medicamentos_catalogo, citas, pacientes, medicos, administradores, farmacias, usuarios RESTART IDENTITY CASCADE'
    );

    const usuarios = [
      { id: IDS.admin1, email: 'arlette_admin@utopia.com', role: 'admin', nombre: 'Arlette Domínguez' },
      { id: IDS.farmacia1, email: 'adan_farmacia@utopia.com', role: 'farmacia', nombre: 'Adán Ramírez' },
      {
        id: IDS.medico1,
        email: 'tovar_medico@utopia.com',
        role: 'medico',
        nombre: 'Dr. Arturo Tovar',
        telefono: '55 1234 5678',
        fecha_nacimiento: '1984-03-10',
        sexo: 'Masculino',
      },
      {
        id: IDS.medico2,
        email: 'carmen.lopez@utopia.com',
        role: 'medico',
        nombre: 'Dra. Carmen López',
        telefono: '55 2233 4455',
        fecha_nacimiento: '1990-07-02',
        sexo: 'Femenino',
      },
      { id: IDS.medico3, email: 'sofia.ramirez@utopia.com', role: 'medico', nombre: 'Dra. Sofía Ramírez', telefono: '55 3344 5566' },
      { id: IDS.medico4, email: 'andres.martinez@utopia.com', role: 'medico', nombre: 'Dr. Andrés Martínez' },
      {
        id: IDS.paciente1,
        email: 'osbaldo_paciente@utopia.com',
        role: 'paciente',
        nombre: 'Osbaldo Venegas',
        fecha_nacimiento: '2003-08-25',
        sexo: 'Masculino',
        telefono: '55 1234 5678',
        direccion: '16 de septiembre 123, Toluca',
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

    const insertUsuarioSql = `
      INSERT INTO usuarios (
        id, email, password_hash, role, nombre, apellido_paterno, apellido_materno,
        telefono, fecha_nacimiento, sexo, direccion, avatar_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    for (const u of usuarios) {
      await client.query(insertUsuarioSql, [
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
        u.avatar_color ?? null,
      ]);
    }

    await client.query('INSERT INTO administradores (id) VALUES ($1)', [IDS.admin1]);
    await client.query('INSERT INTO farmacias (id) VALUES ($1)', [IDS.farmacia1]);

    const medicos = [
      {
        id: IDS.medico1,
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
      },
      {
        id: IDS.medico2,
        especialidad: 'Pediatría',
        institucion: 'Utopía Clínica',
        anios_experiencia: '8 años',
        sobre_el_medico: 'Especialista en pediatría, enfocada en el desarrollo integral de niñas y niños.',
        areas_especialidad: ['Control de niño sano', 'Vacunación'],
        ubicacion_atencion: 'Av. Insurgentes Sur 1234 Col. del Valle',
        activo: true,
        valoracion: 4.9,
        num_opiniones: 96,
      },
      {
        id: IDS.medico3,
        especialidad: 'Neurología',
        activo: false,
        valoracion: 4.6,
        num_opiniones: 54,
      },
      {
        id: IDS.medico4,
        especialidad: 'Dermatología',
        activo: true,
        valoracion: 4.7,
        num_opiniones: 72,
      },
    ];

    const insertMedicoSql = `
      INSERT INTO medicos (
        id, especialidad, institucion, anios_experiencia, sobre_el_medico,
        areas_especialidad, ubicacion_atencion, activo, valoracion, num_opiniones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    for (const m of medicos) {
      await client.query(insertMedicoSql, [
        m.id,
        m.especialidad,
        m.institucion ?? null,
        m.anios_experiencia ?? null,
        m.sobre_el_medico ?? null,
        m.areas_especialidad ?? null,
        m.ubicacion_atencion ?? null,
        m.activo ?? true,
        m.valoracion ?? null,
        m.num_opiniones ?? 0,
      ]);
    }

    const pacientes = [
      {
        id: IDS.paciente1,
        seguro_medico: '12345566789',
        tipo_sangre: 'O+',
        alergias: ['Penicilina'],
        contacto_emergencia: {
          nombreCompleto: 'María Venegas',
          parentesco: 'Madre',
          telefono: '55 9988 7766',
        },
      },
      { id: IDS.paciente2 },
    ];

    const insertPacienteSql = `
      INSERT INTO pacientes (id, seguro_medico, tipo_sangre, alergias, contacto_emergencia)
      VALUES ($1, $2, $3, $4, $5)
    `;

    for (const p of pacientes) {
      await client.query(insertPacienteSql, [
        p.id,
        p.seguro_medico ?? null,
        p.tipo_sangre ?? null,
        p.alergias ?? null,
        p.contacto_emergencia ? JSON.stringify(p.contacto_emergencia) : null,
      ]);
    }

    const medicamentosCatalogo = [
      { nombre: 'Paracetamol', principio_activo: 'Paracetamol', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Ibuprofeno', principio_activo: 'Ibuprofeno', presentacion: 'Tabletas 400 mg' },
      { nombre: 'Amoxicilina', principio_activo: 'Amoxicilina', presentacion: 'Cápsulas 500 mg' },
      { nombre: 'Claritromicina', principio_activo: 'Claritromicina', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Metformina', principio_activo: 'Metformina', presentacion: 'Tabletas 850 mg' },
      { nombre: 'Losartán', principio_activo: 'Losartán', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Enalapril', principio_activo: 'Enalapril', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Amlodipino', principio_activo: 'Amlodipino', presentacion: 'Tabletas 5 mg' },
      { nombre: 'Simvastatina', principio_activo: 'Simvastatina', presentacion: 'Tabletas 20 mg' },
      { nombre: 'Atorvastatina', principio_activo: 'Atorvastatina', presentacion: 'Tabletas 20 mg' },
      { nombre: 'Omeprazol', principio_activo: 'Omeprazol', presentacion: 'Tabletas 20 mg' },
      { nombre: 'Lansoprazol', principio_activo: 'Lansoprazol', presentacion: 'Tabletas 30 mg' },
      { nombre: 'Pantoprazol', principio_activo: 'Pantoprazol', presentacion: 'Tabletas 40 mg' },
      { nombre: 'Levotiroxina', principio_activo: 'Levotiroxina sódica', presentacion: 'Tabletas 50 mcg' },
      { nombre: 'Alprazolam', principio_activo: 'Alprazolam', presentacion: 'Tabletas 0.5 mg' },
      { nombre: 'Sertralina', principio_activo: 'Sertralina', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Fluoxetina', principio_activo: 'Fluoxetina', presentacion: 'Tabletas 20 mg' },
      { nombre: 'Escitalopram', principio_activo: 'Escitalopram', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Diazepam', principio_activo: 'Diazepam', presentacion: 'Tabletas 5 mg' },
      { nombre: 'Clonazepam', principio_activo: 'Clonazepam', presentacion: 'Tabletas 0.5 mg' },
      { nombre: 'Ranitidina', principio_activo: 'Ranitidina', presentacion: 'Tabletas 150 mg' },
      { nombre: 'Cetirizina', principio_activo: 'Cetirizina', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Loratadina', principio_activo: 'Loratadina', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Fexofenadina', principio_activo: 'Fexofenadina', presentacion: 'Tabletas 120 mg' },
      { nombre: 'Naproxeno', principio_activo: 'Naproxeno', presentacion: 'Tabletas 250 mg' },
      { nombre: 'Diclofenaco', principio_activo: 'Diclofenaco', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Hidroxicloroquina', principio_activo: 'Hidroxicloroquina', presentacion: 'Tabletas 200 mg' },
      { nombre: 'Escitalopram', principio_activo: 'Escitalopram', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Captopril', principio_activo: 'Captopril', presentacion: 'Tabletas 25 mg' },
      { nombre: 'Furosemida', principio_activo: 'Furosemida', presentacion: 'Tabletas 40 mg' },
      { nombre: 'Hidroclorotiazida', principio_activo: 'Hidroclorotiazida', presentacion: 'Tabletas 25 mg' },
      { nombre: 'Metoprolol', principio_activo: 'Metoprolol', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Propranolol', principio_activo: 'Propranolol', presentacion: 'Tabletas 40 mg' },
      { nombre: 'Salbutamol', principio_activo: 'Salbutamol', presentacion: 'Inhalador' },
      { nombre: 'Budesonida', principio_activo: 'Budesonida', presentacion: 'Inhalador' },
      { nombre: 'Fluticasona', principio_activo: 'Fluticasona', presentacion: 'Inhalador' },
      { nombre: 'Prednisona', principio_activo: 'Prednisona', presentacion: 'Tabletas 20 mg' },
      { nombre: 'Hidrocortisona', principio_activo: 'Hidrocortisona', presentacion: 'Crema 1%' },
      { nombre: 'Ketorolaco', principio_activo: 'Ketorolaco', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Tramadol', principio_activo: 'Tramadol', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Codeína', principio_activo: 'Codeína', presentacion: 'Tabletas 30 mg' },
      { nombre: 'Clonidina', principio_activo: 'Clonidina', presentacion: 'Tabletas 0.1 mg' },
      { nombre: 'Dexametasona', principio_activo: 'Dexametasona', presentacion: 'Tabletas 4 mg' },
      { nombre: 'Rizatriptán', principio_activo: 'Rizatriptán', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Sumatriptán', principio_activo: 'Sumatriptán', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Metoclopramida', principio_activo: 'Metoclopramida', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Domperidona', principio_activo: 'Domperidona', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Omeprazol', principio_activo: 'Omeprazol', presentacion: 'Cápsulas 20 mg' },
      { nombre: 'Clonixinato', principio_activo: 'Clonixinato de lisina', presentacion: 'Tabletas 250 mg' },
      { nombre: 'Meloxicam', principio_activo: 'Meloxicam', presentacion: 'Tabletas 15 mg' },
      { nombre: 'Etanercepto', principio_activo: 'Etanercepto', presentacion: 'Inyección' },
      { nombre: 'Adalimumab', principio_activo: 'Adalimumab', presentacion: 'Inyección' },
      { nombre: 'Insulina Glargina', principio_activo: 'Insulina glargina', presentacion: 'Solución inyectable' },
      { nombre: 'Insulina Lispro', principio_activo: 'Insulina lispro', presentacion: 'Solución inyectable' },
      { nombre: 'Levotiroxina', principio_activo: 'Levotiroxina sódica', presentacion: 'Tabletas 75 mcg' },
      { nombre: 'Dicloxacilina', principio_activo: 'Dicloxacilina', presentacion: 'Cápsulas 500 mg' },
      { nombre: 'Sulfametoxazol/Trimetoprim', principio_activo: 'Sulfametoxazol/Trimetoprim', presentacion: 'Tabletas' },
      { nombre: 'Clonazepam', principio_activo: 'Clonazepam', presentacion: 'Tabletas 1 mg' },
      { nombre: 'Alopurinol', principio_activo: 'Alopurinol', presentacion: 'Tabletas 100 mg' },
      { nombre: 'Ezetimiba', principio_activo: 'Ezetimiba', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Fenofibrato', principio_activo: 'Fenofibrato', presentacion: 'Tabletas 145 mg' },
      { nombre: 'Ondansetrón', principio_activo: 'Ondansetrón', presentacion: 'Tabletas 8 mg' },
      { nombre: 'Mebendazol', principio_activo: 'Mebendazol', presentacion: 'Tabletas 100 mg' },
      { nombre: 'Clotrimazol', principio_activo: 'Clotrimazol', presentacion: 'Crema 1%' },
      { nombre: 'Nistatina', principio_activo: 'Nistatina', presentacion: 'Ungüento' },
      { nombre: 'Vitamina D', principio_activo: 'Colecalciferol', presentacion: 'Tabletas 1000 UI' },
      { nombre: 'Vitamina B12', principio_activo: 'Cianocobalamina', presentacion: 'Tabletas 500 mcg' },
      { nombre: 'Ácido fólico', principio_activo: 'Ácido fólico', presentacion: 'Tabletas 5 mg' },
      { nombre: 'Calcio', principio_activo: 'Carbonato de calcio', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Aspirina', principio_activo: 'Ácido acetilsalicílico', presentacion: 'Tabletas 100 mg' },
      { nombre: 'Clopidogrel', principio_activo: 'Clopidogrel', presentacion: 'Tabletas 75 mg' },
      { nombre: 'Gabapentina', principio_activo: 'Gabapentina', presentacion: 'Tabletas 300 mg' },
      { nombre: 'Pregabalina', principio_activo: 'Pregabalina', presentacion: 'Tabletas 75 mg' },
      { nombre: 'Lorazepam', principio_activo: 'Lorazepam', presentacion: 'Tabletas 1 mg' },
      { nombre: 'Risperidona', principio_activo: 'Risperidona', presentacion: 'Tabletas 1 mg' },
      { nombre: 'Quetiapina', principio_activo: 'Quetiapina', presentacion: 'Tabletas 25 mg' },
      { nombre: 'Metronidazol', principio_activo: 'Metronidazol', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Doxiciclina', principio_activo: 'Doxiciclina', presentacion: 'Tabletas 100 mg' },
      { nombre: 'Acyclovir', principio_activo: 'Aciclovir', presentacion: 'Tabletas 400 mg' },
      { nombre: 'Valaciclovir', principio_activo: 'Valaciclovir', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Loratadina', principio_activo: 'Loratadina', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Omeprazol', principio_activo: 'Omeprazol', presentacion: 'Cápsulas 20 mg' },
      { nombre: 'Escitalopram', principio_activo: 'Escitalopram', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Tranexamico', principio_activo: 'Ácido tranexámico', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Diltiazem', principio_activo: 'Diltiazem', presentacion: 'Tabletas 60 mg' },
      { nombre: 'Verapamilo', principio_activo: 'Verapamilo', presentacion: 'Tabletas 80 mg' },
      { nombre: 'Nifedipino', principio_activo: 'Nifedipino', presentacion: 'Tabletas 30 mg' },
      { nombre: 'Espironolactona', principio_activo: 'Espironolactona', presentacion: 'Tabletas 25 mg' },
      { nombre: 'Tamsulosina', principio_activo: 'Tamsulosina', presentacion: 'Tabletas 0.4 mg' },
      { nombre: 'Sildenafil', principio_activo: 'Sildenafil', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Trazodona', principio_activo: 'Trazodona', presentacion: 'Tabletas 50 mg' },
      { nombre: 'Baclofeno', principio_activo: 'Baclofeno', presentacion: 'Tabletas 10 mg' },
      { nombre: 'Ciprofloxacino', principio_activo: 'Ciprofloxacino', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Levofloxacino', principio_activo: 'Levofloxacino', presentacion: 'Tabletas 500 mg' },
      { nombre: 'Mometasona', principio_activo: 'Mometasona', presentacion: 'Inhalador nasal' },
      { nombre: 'Loratadina', principio_activo: 'Loratadina', presentacion: 'Jarabe 5 mg/5 ml' },
      { nombre: 'Paracetamol Infantil', principio_activo: 'Paracetamol', presentacion: 'Jarabe 120 mg/5 ml' },
      { nombre: 'Naproxeno', principio_activo: 'Naproxeno', presentacion: 'Jarabe 125 mg/5 ml' },
      { nombre: 'Bioética', principio_activo: 'Bioética', presentacion: 'No aplica' }
    ];

    const insertMedicamentoCatalogoSql = `
      INSERT INTO medicamentos_catalogo (nombre, principio_activo, presentacion)
      VALUES ($1, $2, $3)
    `;

    for (const m of medicamentosCatalogo) {
      await client.query(insertMedicamentoCatalogoSql, [m.nombre, m.principio_activo, m.presentacion]);
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
        tratamiento, observaciones, presion_arterial, temperatura, medicamentos, valida
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      [
        { id: 'm1', nombre: 'Paracetamol', dosis: '500 mg cada 8h', entregado: false, agotado: false }
      ],
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
    usuarios.forEach((u) => console.log(`  - [${u.role}] ${u.email}`));
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
