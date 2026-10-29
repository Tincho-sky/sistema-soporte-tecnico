import { Component, OnInit, inject } from '@angular/core';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  private ticketService = inject(TicketService);

  ngOnInit(): void {
    this.ticketService.listar().subscribe({
      next: (tickets) => console.log('Tickets recibidos:', tickets),
      error: (err) => console.error('Error de conexión:', err),
    });
  }
}