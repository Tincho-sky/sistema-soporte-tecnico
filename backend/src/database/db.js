const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// El archivo de la BD queda en backend/soporte.db (ignorado por Git)
const DB_PATH = path.join(__dirname, '..', '..', 'soporte.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
    process.exit(1);
  }
  console.log('Base de datos SQLite conectada:', DB_PATH);
});

// Crea la tabla solo si todavía no existe
db.run(`
  CREATE TABLE IF NOT EXISTS tickets (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    asunto        TEXT NOT NULL,
    solicitante   TEXT NOT NULL,
    descripcion   TEXT NOT NULL,
    categoria     TEXT NOT NULL,
    prioridad     TEXT NOT NULL,
    estado        TEXT NOT NULL DEFAULT 'Abierto',
    fechaRegistro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// sqlite3 trabaja con callbacks; las envolvemos en Promesas para usar async/await.

// INSERT, UPDATE, DELETE
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      // "this" solo existe dentro de function(), por eso no usamos arrow function
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// SELECT de una sola fila
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

// SELECT de varias filas
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

module.exports = { run, get, all };