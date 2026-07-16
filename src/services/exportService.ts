import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

// Esta función crea el HTML y lo convierte en PDF localmente
async function generarYCompartirPDF(datos: any[], titulo: string) {
  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica'; padding: 20px; }
          h1 { color: #00796b; border-bottom: 2px solid #00796b; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #00796b; color: white; padding: 10px; }
          td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <p>Generado el: ${new Date().toLocaleDateString()}</p>
        <table>
          <tr><th>Paciente</th><th>Fecha</th><th>Hora</th><th>Motivo</th></tr>
          ${datos.map(c => `<tr>
            <td>${c.pacienteNombre || 'Paciente'}</td>
            <td>${c.fechaISO || ''}</td>
            <td>${c.hora || ''}</td>
            <td>${c.motivo || 'N/A'}</td>
          </tr>`).join('')}
        </table>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    // Para la web, podemos abrir una ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
    printWindow?.print();
  } else {
    // Para iOS/Android
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  }
}

export const ExportService = {
  // Función para PDF (ya está bien)
  exportarCitasPDF: async (proximas: any[]) => {
    await generarYCompartirPDF(proximas, 'Historial de Citas Médicas');
  },
  
  // Función para Excel (añade 'datos: any[]' para que coincida con la llamada)
  exportarCitasExcel: async (datos: any[]) => {
    alert('Función de Excel en desarrollo.');
  },
};