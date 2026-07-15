const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Genera un PDF simple de "ficha por fila" a partir de columnas {label,key}
// y filas ya serializadas (camelCase). Reutilizable por cualquier reporte.
function streamPDF(res, { archivo, titulo, columnas, filas }) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${archivo}.pdf"`);

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(18).fillColor('#0B6E58').text('Utopía Clínica', { align: 'center' });
  doc.fontSize(13).fillColor('#333').text(titulo, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('#777').text(`Generado: ${new Date().toLocaleString('es-MX')}`, {
    align: 'center',
  });
  doc.moveDown(1.5);

  if (filas.length === 0) {
    doc.fontSize(11).fillColor('#888').text('No hay datos para mostrar.');
  }

  filas.forEach((fila) => {
    const linea = columnas.map((c) => `${c.label}: ${fila[c.key] ?? '—'}`).join('    ');
    doc.fontSize(9.5).fillColor('#333').text(linea);
    doc
      .moveTo(doc.x, doc.y + 4)
      .lineTo(555, doc.y + 4)
      .strokeColor('#E2E8E6')
      .stroke();
    doc.moveDown(0.6);
  });

  doc.end();
}

async function streamExcel(res, { archivo, titulo, columnas, filas }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Utopía Clínica';
  const sheet = workbook.addWorksheet(titulo.slice(0, 31));

  sheet.columns = columnas.map((c) => ({ header: c.label, key: c.key, width: c.width ?? 20 }));
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B6E58' } };

  filas.forEach((f) => sheet.addRow(f));

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${archivo}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { streamPDF, streamExcel };
