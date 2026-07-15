require('dotenv').config();
const app = require('./app');
const { ensureSchema } = require('./db/ensureSchema');

const PORT = process.env.PORT || 4000;

async function boot() {
  try {
    await ensureSchema();
    app.listen(PORT, () => {
      console.log(`Utopía Clínica API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al inicializar el backend:', error);
    process.exit(1);
  }
}

boot();
