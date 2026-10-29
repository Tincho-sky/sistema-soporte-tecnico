# Sistema de Gestión de Soporte Técnico

## Descripción
Aplicación web full stack para registrar, consultar, actualizar y eliminar tickets de soporte técnico, reemplazando el registro manual en mensajes y planillas. Los datos se guardan en una base de datos SQLite, por lo que se mantienen después de recargar la aplicación o reiniciar la API.

## Autor
Martín Isaí Llanos Ortiz — Electivo Angular, Ingeniería en Informática, Instituto Profesional Virginio Gómez, sede Chillán.
Repositorio: https://github.com/Tincho-sky/sistema-soporte-tecnico

## Tecnologías utilizadas
- **Frontend:** Angular 22 (componentes standalone, Router, HttpClient, formularios reactivos, signals), TypeScript, CSS.
- **Backend:** Node.js, Express, CORS.
- **Base de datos:** SQLite (paquete `sqlite3`).

## Requisitos previos
- Node.js v24.22.0 y npm.
- Git.
- Angular CLI: `npm install -g @angular/cli@22`.

## Instalación
```bash
git clone https://github.com/Tincho-sky/sistema-soporte-tecnico.git
cd sistema-soporte-tecnico

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

> **Nota sobre npm y sqlite3:** las versiones recientes de npm bloquean por seguridad los scripts de instalación. `sqlite3` necesita el suyo para descargar su binario nativo. Si `npm install` muestra una advertencia sobre `install-scripts`, ejecuta dentro de `backend/`:
> ```bash
> npm install-scripts approve sqlite3
> npm rebuild sqlite3
> ```

## Ejecución
Se necesitan dos terminales.

```bash
# Terminal 1 — API (http://localhost:3000)
cd backend
npm run dev        # o: npm start

# Terminal 2 — Angular (http://localhost:4200)
cd frontend
ng serve
```
Abrir http://localhost:4200 en el navegador.

**Base de datos:** no requiere instalación ni configuración. Al iniciar, la API crea automáticamente el archivo `backend/soporte.db` y la tabla `tickets` (esquema en `backend/schema.sql`). Ese archivo no se versiona en Git.

## Estructura del proyecto
```
sistema-soporte-tecnico/
├── backend/
│   ├── server.js                 # Servidor Express, middlewares y manejo de errores
│   ├── schema.sql                # Esquema de la base de datos (referencia)
│   └── src/
│       ├── database/db.js        # Conexión SQLite, creación de tabla y helpers run/get/all
│       └── routes/tickets.js     # Endpoints CRUD y validaciones
└── frontend/
    └── src/app/
        ├── models/ticket.model.ts        # Interface Ticket y valores permitidos
        ├── services/ticket.service.ts    # Peticiones HTTP centralizadas (HttpClient)
        ├── utils/mensaje-error.ts        # Traducción de errores HTTP a mensajes
        ├── components/ticket-list/       # Listado, estado/prioridad visual, eliminar
        ├── components/ticket-form/       # Formulario reactivo (crear y editar)
        ├── app.routes.ts                 # Rutas
        └── app.ts / app.html             # Componente raíz y navegación
```

## API REST
| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/tickets` | Lista todos los tickets | 200 |
| GET | `/api/tickets/:id` | Obtiene un ticket | 200, 400, 404 |
| POST | `/api/tickets` | Crea un ticket | 201, 400 |
| PUT | `/api/tickets/:id` | Actualiza un ticket | 200, 400, 404 |
| DELETE | `/api/tickets/:id` | Elimina un ticket | 200, 400, 404 |

Todas las consultas SQL son **parametrizadas** (`?`), por lo que los datos del usuario nunca se concatenan en el SQL.

## Modelo de datos (tabla `tickets`)
| Campo | Descripción |
|---|---|
| id | Identificador único autoincremental |
| asunto | Resumen de la solicitud |
| solicitante | Persona que solicita soporte |
| descripcion | Detalle del problema |
| categoria | Hardware, Software, Red, Cuenta y acceso, Otro |
| prioridad | Baja, Media, Alta |
| estado | Abierto, En proceso, Cerrado |
| fechaRegistro | Fecha de registro (la asigna la base de datos) |

## Funcionalidades implementadas
- Listado de tickets obtenidos desde la base de datos.
- Registro de tickets mediante formulario reactivo.
- Edición de tickets existentes.
- Eliminación con confirmación previa.
- Distinción visual de prioridad y estado mediante insignias de color con texto.
- Validación de datos en Angular (obligatorio, largo mínimo/máximo, sin solo espacios) y en el backend.
- Mensajes de error al usuario (API caída, ticket inexistente, datos inválidos).
- Persistencia real en SQLite.

## Decisiones técnicas
- **SQLite:** es una base de datos relacional real basada en un archivo local, sin servidor ni permisos de administrador, por lo que cualquier revisor puede ejecutar el proyecto sin instalar MySQL. El enunciado permite una base equivalente.
- **Servicio Angular centralizado:** todas las peticiones HTTP están en `TicketService`; los componentes no conocen la URL de la API.
- **Un solo componente de formulario** para crear y editar, según si la ruta trae `:id`.
- **Doble validación:** Angular para la experiencia de usuario; Express porque la API no debe confiar en el cliente.

## Pruebas realizadas

| Prueba | Procedimiento | Resultado esperado | Resultado |
|---|---|---|---|
| Inicio | Levantar API y Angular siguiendo este README en un clon limpio | Ambos arrancan | ✔ 29-10-2026 20:26hrs|
| GET | Abrir el listado | Se muestran los tickets guardados | ✔ 29-10-2026 20:27hrs|
| POST | Crear un ticket desde el formulario | Aparece en el listado y en la BD | ✔ 29-10-2026 20:27hrs|
| PUT | Editar un ticket y recargar con F5 | El cambio permanece | ✔ 29-10-2026 20:27hrs|
| DELETE | Eliminar (cancelar y luego aceptar) | Cancelar no borra; aceptar lo quita del listado y de la BD | ✔ 29-10-2026 20:28hrs |
| Validación | Enviar vacío, asunto corto y solo espacios | Se muestran errores y no se envía la petición | ✔ 29-10-2026 20:28hrs|
| Error de conexión | Apagar la API e intentar listar/guardar | Alerta roja de error de conexión | ✔ 29-10-2026 20:28hrs|
| Ticket inexistente | Abrir `/tickets/editar/999` | Mensaje "Ticket no encontrado" | ✔ 29-10-2026 20:28hrs|
| Persistencia | Reiniciar la API y recargar Angular | Los datos siguen disponibles | ✔ 29-10-2026 20:28hrs|

## Declaración de uso de Inteligencia Artificial
**Herramienta utilizada:** Claude (Anthropic), usado como asistente y tutor en una conversación guiada por fases.

**Actividades para las que se utilizó:**
- Planificación del proyecto en 5 fases alineadas con la rúbrica.
- Generación de una propuesta inicial de código del backend (`server.js`, `db.js`, `tickets.js`) y del frontend (modelo, servicio, rutas, componentes, formulario y estilos).
- Explicación de conceptos (CORS, consultas parametrizadas, Observables, formularios reactivos, signals, rutas).
- Apoyo en depuración: (1) advertencia de npm sobre scripts de instalación de `sqlite3`; (2) error de compilación de Angular causado por pegar código TypeScript dentro de `app.html`.
- Borrador inicial de este README.

**Elementos que recibieron apoyo de IA:** código del backend y del frontend, estilos CSS, explicaciones técnicas, depuración y estructura de la documentación.

**Modificaciones, verificaciones y adaptaciones realizadas por mí:**
- Creé el repositorio, configuré el entorno y ejecuté cada fase, haciendo un commit por avance.
- Instalé las dependencias y resolví personalmente el bloqueo de scripts de npm para `sqlite3`.
- Detecté y corregí el error de `app.html` (contenido de `app.ts` pegado en el archivo equivocado).
- Probé todos los endpoints con curl (casos válidos, 400 y 404) y todo el flujo desde la interfaz, según la tabla de pruebas.
- Verifiqué la persistencia reiniciando la API y la reproducibilidad con un clon limpio del repositorio.
- Estudié el código de cada archivo y puedo explicarlo y modificarlo sin asistencia de IA.