const crypto = require('crypto');
const { query } = require('../config/db');
const { toReceta } = require('../utils/serializers');
const asyncHandler = require('../utils/asyncHandler');

function generarCodigoQR() {
  return `QR-${Date.now().toString(36)}${crypto.randomBytes(4).toString('hex')}`;
}

function normalizeMedicamentos(input) {
  if (!Array.isArray(input)) return [];
  return input.map((item, index) => ({
    id: item.id ?? `med-${Date.now().toString(36)}-${index}`,
    medicamentoId: item.medicamentoId ?? undefined,
    nombre: item.nombre ?? `Medicamento ${index + 1}`,
    dosis: item.dosis ?? item.dosis ?? '',
    entregado: Boolean(item.entregado),
    agotado: Boolean(item.agotado),
  }));
}

const list = asyncHandler(async (req, res) => {
  const { pacienteId, medicoId, valida } = req.query;
  const clauses = [];
  const values = [];

  if (pacienteId) {
    values.push(pacienteId);
    clauses.push(`paciente_id = $${values.length}`);
  }
  if (medicoId) {
    values.push(medicoId);
    clauses.push(`medico_id = $${values.length}`);
  }
  if (valida !== undefined) {
    values.push(valida === 'true');
    clauses.push(`valida = $${values.length}`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const { rows } = await query(`SELECT * FROM recetas ${where} ORDER BY fecha DESC`, values);
  res.json(rows.map(toReceta));
});

const getById = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM recetas WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Receta no encontrada' });
  res.json(toReceta(rows[0]));
});

const getByCodigoQR = asyncHandler(async (req, res) => {
  const { rows } = await query('SELECT * FROM recetas WHERE codigo_qr = $1', [req.params.codigoQR]);
  if (!rows[0]) return res.status(404).json({ error: 'Receta no encontrada para ese código' });
  res.json(toReceta(rows[0]));
});

const create = asyncHandler(async (req, res) => {
  const {
    pacienteId,
    medicoId,
    citaId,
    fecha,
    diagnostico,
    tratamiento,
    observaciones,
    presionArterial,
    temperatura,
    medicamentos,
  } = req.body;

  if (!pacienteId || !medicoId || !fecha) {
    return res.status(400).json({ error: 'pacienteId, medicoId y fecha son requeridos' });
  }

  const recetaMedicamentos = normalizeMedicamentos(medicamentos);

  const { rows } = await query(
    `INSERT INTO recetas (
      codigo_qr, paciente_id, medico_id, cita_id, fecha, diagnostico,
      tratamiento, observaciones, presion_arterial, temperatura, medicamentos, valida
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
    RETURNING *`,
    [
      generarCodigoQR(),
      pacienteId,
      medicoId,
      citaId ?? null,
      fecha,
      diagnostico ?? null,
      tratamiento ?? null,
      observaciones ?? null,
      presionArterial ?? null,
      temperatura ?? null,
      JSON.stringify(recetaMedicamentos),
    ]
  );

  res.status(201).json(toReceta(rows[0]));
});

const invalidar = asyncHandler(async (req, res) => {
  const { rows } = await query(
    `UPDATE recetas
     SET valida = FALSE, invalidada_en = now(), invalidada_por = $2
     WHERE id = $1 AND valida = TRUE
     RETURNING *`,
    [req.params.id, req.user.id]
  );

  if (!rows[0]) {
    return res.status(409).json({ error: 'La receta no existe o ya fue invalidada' });
  }
  res.json(toReceta(rows[0]));
});

const entregar = asyncHandler(async (req, res) => {
  const recetaId = req.params.id;
  const { medicamentos: entregas } = req.body;

  if (!Array.isArray(entregas)) {
    return res.status(400).json({ error: 'Se requiere un arreglo de medicamentos con entregado/agotado.' });
  }

  const { rows } = await query('SELECT * FROM recetas WHERE id = $1', [recetaId]);
  const receta = rows[0];
  if (!receta) return res.status(404).json({ error: 'Receta no encontrada' });
  if (!receta.valida) return res.status(409).json({ error: 'La receta ya fue invalidada' });

  const originalMedicamentos = Array.isArray(receta.medicamentos) ? receta.medicamentos : [];
  const processedMedicamentos = originalMedicamentos.map((item) => {
    const entrega = entregas.find((m) => m.id === item.id);
    const entregado = entrega ? Boolean(entrega.entregado) : false;
    return {
      ...item,
      entregado,
      agotado: !entregado,
    };
  });

  const faltantes = processedMedicamentos.filter((item) => !item.entregado);

  await query('BEGIN');
  try {
    const { rows: invalidatedRows } = await query(
      `UPDATE recetas
       SET valida = FALSE, invalidada_en = now(), invalidada_por = $2, medicamentos = $3
       WHERE id = $1 AND valida = TRUE
       RETURNING *`,
      [recetaId, req.user.id, JSON.stringify(processedMedicamentos)]
    );

    if (!invalidatedRows[0]) {
      await query('ROLLBACK');
      return res.status(409).json({ error: 'La receta no existe o ya fue invalidada' });
    }

    const resultado = { receta: toReceta(invalidatedRows[0]) };

    if (faltantes.length > 0) {
      const fechaHoy = new Date().toISOString().slice(0, 10);
      const codigoQR = generarCodigoQR();
      const { rows: replacementRows } = await query(
        `INSERT INTO recetas (
          codigo_qr, paciente_id, medico_id, cita_id, fecha, diagnostico,
          tratamiento, observaciones, presion_arterial, temperatura, medicamentos,
          receta_origen_id, valida
        ) VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8, $9, $10, $11, TRUE)
        RETURNING *`,
        [
          codigoQR,
          receta.paciente_id,
          receta.medico_id,
          fechaHoy,
          receta.diagnostico,
          receta.tratamiento,
          receta.observaciones,
          receta.presion_arterial,
          receta.temperatura,
          JSON.stringify(faltantes),
          receta.id,
        ]
      );

      const replacement = replacementRows[0];
      resultado.reemplazo = toReceta(replacement);

      const detalle = `Se generó una receta de reemplazo por medicamentos agotados: ${faltantes
        .map((item) => item.nombre)
        .join(', ')}.`;

      await query(
        `INSERT INTO avisos (para_user_id, tipo, titulo, detalle, fecha, hora, leido)
         VALUES ($1, $2, $3, $4, $5, NULL, FALSE)`,
        [receta.paciente_id, 'Recordatorio', 'Receta de reemplazo generada', detalle, fechaHoy]
      );
    }

    await query('COMMIT');
    res.json(resultado);
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
});

module.exports = { list, getById, getByCodigoQR, create, invalidar, entregar };
