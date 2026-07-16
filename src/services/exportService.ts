import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

function escapeHtml(value: string | number | undefined | null) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCSV(value: string | number | undefined | null) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function generarYCompartirPDF(datos: any[], titulo: string, headers: Array<{ key: string; label: string }>) {
  const filas = datos
    .map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(row[header.key] ?? '')}</td>`).join('')}</tr>`)
    .join('');

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica'; padding: 20px; color: #1f2937; }
          h1 { color: #0f766e; border-bottom: 2px solid #0f766e; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background-color: #0f766e; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <p>Generado el: ${new Date().toLocaleDateString()}</p>
        <table>
          <tr>${headers.map((header) => `<th>${escapeHtml(header.label)}</th>`).join('')}</tr>
          ${filas}
        </table>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.print();
  } else {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  }
}

async function generarYCompartirCSV(datos: any[], titulo: string, headers: Array<{ key: string; label: string }>, nombreArchivo: string) {
  const lines = [headers.map((header) => escapeCSV(header.label)).join(','), ...datos.map((row) => headers.map((header) => escapeCSV(row[header.key] ?? '')).join(','))];
  const content = lines.join('\n');

  if (Platform.OS === 'web') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombreArchivo}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const fileSystem = FileSystem as any;
  const directory = fileSystem.cacheDirectory ?? fileSystem.documentDirectory ?? '';
  const path = `${directory}${nombreArchivo}.csv`;
  await fileSystem.writeAsStringAsync(path, content, { encoding: fileSystem.EncodingType?.UTF8 ?? 'utf8' });
  await Sharing.shareAsync(path);
}

function mapCitas(datos: any[]) {
  return datos.map((c) => ({
    pacienteNombre: c.pacienteNombre ?? c.paciente ?? 'Paciente',
    fechaISO: c.fechaISO ?? '',
    hora: c.hora ?? '',
    motivo: c.motivo ?? '',
    estado: c.estado ?? '',
    especialidad: c.especialidad ?? '',
  }));
}

function mapRecetas(datos: any[]) {
  return datos.map((r) => ({
    fecha: r.fecha ?? '',
    diagnostico: r.diagnostico ?? '',
    observaciones: r.observaciones ?? '',
    medicamentos: r.medicamentos?.map((m: any) => `${m.nombre} (${m.dosis})`).join('; ') ?? '',
    estado: r.valida ? 'Válida' : 'Invalidada',
  }));
}

function mapCancelaciones(datos: any[]) {
  return datos.map((c) => ({
    pacienteNombre: c.pacienteNombre ?? c.paciente ?? 'Paciente',
    fechaISO: c.fechaISO ?? '',
    medico: c.medico ?? '',
    motivo: c.motivo ?? '',
    estado: c.estado ?? 'Cancelada',
  }));
}

function mapPacientes(datos: any[]) {
  return datos.map((p) => ({
    nombre: p.nombre ?? '',
    email: p.email ?? '',
    telefono: p.telefono ?? '',
    registradoEl: p.registradoEl ?? '',
    totalCitas: p.totalCitas ?? 0,
  }));
}

function mapMedicos(datos: any[]) {
  return datos.map((m) => ({
    nombre: m.nombre ?? '',
    especialidad: m.especialidad ?? '',
    totalCitas: m.totalCitas ?? 0,
    completadas: m.completadas ?? 0,
    canceladas: m.canceladas ?? 0,
    activo: m.activo ?? true,
  }));
}

export const ExportService = {
  exportarCitasPDF: async (datos: any[] = []) => {
    await generarYCompartirPDF(mapCitas(datos), 'Historial de Citas Médicas', [
      { key: 'pacienteNombre', label: 'Paciente' },
      { key: 'fechaISO', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'especialidad', label: 'Especialidad' },
      { key: 'estado', label: 'Estado' },
      { key: 'motivo', label: 'Motivo' },
    ]);
  },

  exportarCitasExcel: async (datos: any[] = []) => {
    await generarYCompartirCSV(mapCitas(datos), 'Historial de Citas Médicas', [
      { key: 'pacienteNombre', label: 'Paciente' },
      { key: 'fechaISO', label: 'Fecha' },
      { key: 'hora', label: 'Hora' },
      { key: 'especialidad', label: 'Especialidad' },
      { key: 'estado', label: 'Estado' },
      { key: 'motivo', label: 'Motivo' },
    ], 'historial-citas');
  },

  exportarRecetasPDF: async (datos: any[] = []) => {
    await generarYCompartirPDF(mapRecetas(datos), 'Historial de Recetas Médicas', [
      { key: 'fecha', label: 'Fecha' },
      { key: 'diagnostico', label: 'Diagnóstico' },
      { key: 'medicamentos', label: 'Medicamentos' },
      { key: 'observaciones', label: 'Observaciones' },
      { key: 'estado', label: 'Estado' },
    ]);
  },

  exportarRecetasExcel: async (datos: any[] = []) => {
    await generarYCompartirCSV(mapRecetas(datos), 'Historial de Recetas Médicas', [
      { key: 'fecha', label: 'Fecha' },
      { key: 'diagnostico', label: 'Diagnóstico' },
      { key: 'medicamentos', label: 'Medicamentos' },
      { key: 'observaciones', label: 'Observaciones' },
      { key: 'estado', label: 'Estado' },
    ], 'historial-recetas');
  },

  exportarCancelacionesPDF: async (datos: any[] = []) => {
    await generarYCompartirPDF(mapCancelaciones(datos), 'Historial de Cancelaciones', [
      { key: 'pacienteNombre', label: 'Paciente' },
      { key: 'fechaISO', label: 'Fecha' },
      { key: 'medico', label: 'Médico' },
      { key: 'motivo', label: 'Motivo' },
      { key: 'estado', label: 'Estado' },
    ]);
  },

  exportarCancelacionesExcel: async (datos: any[] = []) => {
    await generarYCompartirCSV(mapCancelaciones(datos), 'Historial de Cancelaciones', [
      { key: 'pacienteNombre', label: 'Paciente' },
      { key: 'fechaISO', label: 'Fecha' },
      { key: 'medico', label: 'Médico' },
      { key: 'motivo', label: 'Motivo' },
      { key: 'estado', label: 'Estado' },
    ], 'historial-cancelaciones');
  },

  exportarPacientesPDF: async (datos: any[] = []) => {
    await generarYCompartirPDF(mapPacientes(datos), 'Historial de Pacientes', [
      { key: 'nombre', label: 'Nombre' },
      { key: 'email', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'registradoEl', label: 'Registrado' },
      { key: 'totalCitas', label: 'Total de citas' },
    ]);
  },

  exportarPacientesExcel: async (datos: any[] = []) => {
    await generarYCompartirCSV(mapPacientes(datos), 'Historial de Pacientes', [
      { key: 'nombre', label: 'Nombre' },
      { key: 'email', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'registradoEl', label: 'Registrado' },
      { key: 'totalCitas', label: 'Total de citas' },
    ], 'historial-pacientes');
  },

  exportarMedicosPDF: async (datos: any[] = []) => {
    await generarYCompartirPDF(mapMedicos(datos), 'Historial de Médicos', [
      { key: 'nombre', label: 'Nombre' },
      { key: 'especialidad', label: 'Especialidad' },
      { key: 'totalCitas', label: 'Total de citas' },
      { key: 'completadas', label: 'Completadas' },
      { key: 'canceladas', label: 'Canceladas' },
      { key: 'activo', label: 'Activo' },
    ]);
  },

  exportarMedicosExcel: async (datos: any[] = []) => {
    await generarYCompartirCSV(mapMedicos(datos), 'Historial de Médicos', [
      { key: 'nombre', label: 'Nombre' },
      { key: 'especialidad', label: 'Especialidad' },
      { key: 'totalCitas', label: 'Total de citas' },
      { key: 'completadas', label: 'Completadas' },
      { key: 'canceladas', label: 'Canceladas' },
      { key: 'activo', label: 'Activo' },
    ], 'historial-medicos');
  },
};