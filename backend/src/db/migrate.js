const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Ejecutando schema.sql sobre la base de datos...');
  await pool.query(sql);
  console.log('Migración completada correctamente.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Error al migrar la base de datos:', err);
  process.exit(1);
});
