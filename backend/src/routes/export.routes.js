const { Router } = require('express');
const {
  exportarCitasPDF,
  exportarCitasExcel,
  exportarCancelacionesPDF,
  exportarCancelacionesExcel,
  exportarPacientesPDF,
  exportarPacientesExcel,
  exportarMedicosPDF,
  exportarMedicosExcel,
} = require('../controllers/export.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = Router();

router.get('/citas.pdf', requireAuth, requireRole('medico', 'admin'), exportarCitasPDF);
router.get('/citas.xlsx', requireAuth, requireRole('medico', 'admin'), exportarCitasExcel);

router.get('/cancelaciones.pdf', requireAuth, requireRole('admin'), exportarCancelacionesPDF);
router.get('/cancelaciones.xlsx', requireAuth, requireRole('admin'), exportarCancelacionesExcel);

router.get('/pacientes.pdf', requireAuth, requireRole('admin'), exportarPacientesPDF);
router.get('/pacientes.xlsx', requireAuth, requireRole('admin'), exportarPacientesExcel);

router.get('/medicos.pdf', requireAuth, requireRole('admin'), exportarMedicosPDF);
router.get('/medicos.xlsx', requireAuth, requireRole('admin'), exportarMedicosExcel);

module.exports = router;
