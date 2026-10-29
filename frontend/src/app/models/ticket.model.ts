// Valores permitidos. Deben coincidir con los del backend (tickets.js).
export const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuenta y acceso', 'Otro'] as const;
export const PRIORIDADES = ['Baja', 'Media', 'Alta'] as const;
export const ESTADOS = ['Abierto', 'En proceso', 'Cerrado'] as const;

export type Categoria = (typeof CATEGORIAS)[number];
export type Prioridad = (typeof PRIORIDADES)[number];
export type Estado = (typeof ESTADOS)[number];

// Un ticket tal como lo devuelve la API
export interface Ticket {
  id: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: Categoria;
  prioridad: Prioridad;
  estado: Estado;
  fechaRegistro: string;
}

// Lo que el formulario envía: sin id ni fecha, porque los genera el servidor
export type TicketDatos = Omit<Ticket, 'id' | 'fechaRegistro'>;