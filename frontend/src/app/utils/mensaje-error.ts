import { HttpErrorResponse } from '@angular/common/http';

// Convierte un error HTTP en un mensaje entendible para el usuario
export function mensajeDeError(err: HttpErrorResponse): string {
  // status 0 = el navegador no pudo comunicarse con la API (apagada, sin red)
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que la API esté encendida.';
  }
  // 400 con lista de errores de validación del backend
  if (Array.isArray(err.error?.errores)) {
    return err.error.errores.join(' · ');
  }
  // 404, 500, etc. con { error: '...' }
  if (err.error?.error) {
    return err.error.error;
  }
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
}