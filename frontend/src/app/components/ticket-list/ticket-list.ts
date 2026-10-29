import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Estado, Prioridad, Ticket } from '../../models/ticket.model';
import { mensajeDeError } from '../../utils/mensaje-error';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  private ticketService = inject(TicketService);

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.ticketService.listar().subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(ticket: Ticket): void {
    // confirm() muestra el cuadro nativo Aceptar / Cancelar
    if (!confirm(`¿Eliminar el ticket #${ticket.id} "${ticket.asunto}"?`)) {
      return;
    }
    this.ticketService.eliminar(ticket.id).subscribe({
      next: () => this.cargar(), // recargamos desde la API: lo que se ve es lo que hay en la BD
      error: (err) => this.error.set(mensajeDeError(err)),
    });
  }

  // Devuelven la clase CSS según el valor, para distinguir visualmente
  clasePrioridad(prioridad: Prioridad): string {
    const clases: Record<Prioridad, string> = {
      Baja: 'prioridad-baja',
      Media: 'prioridad-media',
      Alta: 'prioridad-alta',
    };
    return clases[prioridad];
  }

  claseEstado(estado: Estado): string {
    const clases: Record<Estado, string> = {
      Abierto: 'estado-abierto',
      'En proceso': 'estado-proceso',
      Cerrado: 'estado-cerrado',
    };
    return clases[estado];
  }

  // SQLite guarda la fecha en UTC como "2026-10-28 18:00:00".
  // La convertimos a formato ISO con "Z" para que el navegador la muestre en hora local.
  fecha(ticket: Ticket): Date {
    return new Date(ticket.fechaRegistro.replace(' ', 'T') + 'Z');
  }
}