const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const medicosRoutes = require('./routes/medicos.routes');
const citasRoutes = require('./routes/citas.routes');
const recetasRoutes = require('./routes/recetas.routes');
const avisosRoutes = require('./routes/avisos.routes');
const exportRoutes = require('./routes/export.routes');
const reportesRoutes = require('./routes/reportes.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/avisos', avisosRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/reportes', reportesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
