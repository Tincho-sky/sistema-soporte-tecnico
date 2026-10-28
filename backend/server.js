const express = require('express');
const cors = require('cors');
const ticketsRouter = require('./src/routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'API de soporte técnico funcionando' });
});

// Todas las rutas de tickets quedan bajo /api/tickets
app.use('/api/tickets', ticketsRouter);

// Ruta inexistente -> 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores (ej: JSON mal formado en el body)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});