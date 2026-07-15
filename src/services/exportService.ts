import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getItem, STORAGE_KEYS } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function descargarYCompartir(path: string, nombreArchivo: string): Promise<void> {
  const token = await getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const url = `${API_URL}${path}`;

  if (Platform.OS === 'web') {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('No se pudo generar el archivo.');
    const blob = await res.blob();
    const objectUrl = (globalThis as any).URL.createObjectURL(blob);
    const link = (globalThis as any).document.createElement('a');
    link.href = objectUrl;
    link.download = nombreArchivo;
    (globalThis as any).document.body.appendChild(link);
    link.click();
    link.remove();
    (globalThis as any).URL.revokeObjectURL(objectUrl);
    return;
  }

  const destino = `${FileSystem.cacheDirectory}${nombreArchivo}`;
  const resultado = await FileSystem.downloadAsync(url, destino, { headers });
  if (resultado.status !== 200) {
    throw new Error('No se pudo generar el archivo.');
  }
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(resultado.uri);
  }
}

export const ExportService = {
  exportarCitasPDF: (filtro?: { medicoId?: string }) =>
    descargarYCompartir(
      `/export/citas.pdf${filtro?.medicoId ? `?medicoId=${filtro.medicoId}` : ''}`,
      'historial-utopia.pdf'
    ),
  exportarCitasExcel: (filtro?: { medicoId?: string }) =>
    descargarYCompartir(
      `/export/citas.xlsx${filtro?.medicoId ? `?medicoId=${filtro.medicoId}` : ''}`,
      'historial-utopia.xlsx'
    ),
  exportarCancelacionesPDF: () => descargarYCompartir('/export/cancelaciones.pdf', 'cancelaciones-utopia.pdf'),
  exportarCancelacionesExcel: () => descargarYCompartir('/export/cancelaciones.xlsx', 'cancelaciones-utopia.xlsx'),
  exportarPacientesPDF: () => descargarYCompartir('/export/pacientes.pdf', 'pacientes-utopia.pdf'),
  exportarPacientesExcel: () => descargarYCompartir('/export/pacientes.xlsx', 'pacientes-utopia.xlsx'),
  exportarMedicosPDF: () => descargarYCompartir('/export/medicos.pdf', 'medicos-utopia.pdf'),
  exportarMedicosExcel: () => descargarYCompartir('/export/medicos.xlsx', 'medicos-utopia.xlsx'),
};
