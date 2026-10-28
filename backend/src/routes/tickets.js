const express = require('express');
const db = require('../database/db');

const router = express.Router();

const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuenta y acceso', 'Otro'];
const PRIORIDADES = ['Baja', 'Media', 'Alta'];
const ESTADOS = ['Abierto', 'En proceso', 'Cerrado'];

// Devuelve true si el valor no es un texto o está vacío
const vacio = (v) => typeof v !== 'string' || v.trim() === '';

// Valida el cuerpo de la petición y devuelve una lista de errores
function validarTicket(body) {
  const errores = [];
  if (vacio(body.asunto)) errores.push('El asunto es obligatorio');
  if (vacio(body.solicitante)) errores.push('El solicitante es obligatorio');
  if (vacio(body.descripcion)) errores.push('La descripción es obligatoria');
  if (!CATEGORIAS.includes(body.categoria)) errores.push('Categoría no válida');
  if (!PRIORIDADES.includes(body.prioridad)) errores.push('Prioridad no válida');
  if (!ESTADOS.includes(body.estado)) errores.push('Estado no válido');
  return errores;
}

// Convierte el :id de la URL en número válido (o null si no lo es)
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/tickets -> lista todos
router.get('/', async (req, res) => {
  try {
    const tickets = await db.all('SELECT * FROM tickets ORDER BY id DESC');
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
});

// GET /api/tickets/:id -> uno solo
router.get('/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'ID no válido' });

  try {
    const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el ticket' });
  }
});

// POST /api/tickets -> crea
router.post('/', async (req, res) => {
  const datos = { ...req.body, estado: req.body.estado || 'Abierto' };
  const errores = validarTicket(datos);
  if (errores.length > 0) return res.status(400).json({ errores });

  try {
    const { lastID } = await db.run(
      `INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        datos.asunto.trim(),
        datos.solicitante.trim(),
        datos.descripcion.trim(),
        datos.categoria,
        datos.prioridad,
        datos.estado,
      ]
    );
    const creado = await db.get('SELECT * FROM tickets WHERE id = ?', [lastID]);
    res.status(201).json(creado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
});

// PUT /api/tickets/:id -> actualiza
router.put('/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'ID no válido' });

  const datos = { ...req.body, estado: req.body.estado || 'Abierto' };
  const errores = validarTicket(datos);
  if (errores.length > 0) return res.status(400).json({ errores });

  try {
    const { changes } = await db.run(
      `UPDATE tickets
       SET asunto = ?, solicitante = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ?
       WHERE id = ?`,
      [
        datos.asunto.trim(),
        datos.solicitante.trim(),
        datos.descripcion.trim(),
        datos.categoria,
        datos.prioridad,
        datos.estado,
        id,
      ]
    );
    if (changes === 0) return res.status(404).json({ error: 'Ticket no encontrado' });

    const actualizado = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el ticket' });
  }
});

// DELETE /api/tickets/:id -> elimina
router.delete('/:id', async (req, res) => {
  const id = leerId(req);
  if (!id) return res.status(400).json({ error: 'ID no válido' });

  try {
    const { changes } = await db.run('DELETE FROM tickets WHERE id = ?', [id]);
    if (changes === 0) return res.status(404).json({ error: 'Ticket no encontrado' });
    res.json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el ticket' });
  }
});

module.exports = router;