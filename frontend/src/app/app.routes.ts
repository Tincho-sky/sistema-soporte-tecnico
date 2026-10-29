import { Routes } from '@angular/router';
import { TicketList } from './components/ticket-list/ticket-list';
import { TicketForm } from './components/ticket-form/ticket-form';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: TicketList },
  { path: 'tickets/nuevo', component: TicketForm },
  { path: 'tickets/editar/:id', component: TicketForm },
  { path: '**', redirectTo: 'tickets' },
];