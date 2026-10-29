import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketDatos } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tickets';

  // GET /api/tickets
  listar(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  // GET /api/tickets/:id
  obtener(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  // POST /api/tickets
  crear(datos: TicketDatos): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, datos);
  }

  // PUT /api/tickets/:id
  actualizar(id: number, datos: TicketDatos): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, datos);
  }

  // DELETE /api/tickets/:id
  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
  }
}