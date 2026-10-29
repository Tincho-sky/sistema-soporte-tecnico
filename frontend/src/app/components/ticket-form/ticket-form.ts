import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { CATEGORIAS, ESTADOS, PRIORIDADES, TicketDatos } from '../../models/ticket.model';
import { mensajeDeError } from '../../utils/mensaje-error';

// Validador propio: rechaza textos que contienen solo espacios.
// Validators.required acepta "   " porque tiene longitud mayor a 0.
function noSoloEspacios(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  return typeof valor === 'string' && valor.length > 0 && valor.trim().length === 0
    ? { soloEspacios: true }
    : null;
}

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);

  // Listas para llenar los <select>
  categorias = CATEGORIAS;
  prioridades = PRIORIDADES;
  estados = ESTADOS;

  ticketId: number | null = null; // null = creando, número = editando
  error = signal('');
  enviando = signal(false);

  formulario = this.fb.nonNullable.group({
    asunto: ['', [Validators.required, noSoloEspacios, Validators.minLength(5), Validators.maxLength(100)]],
    solicitante: ['', [Validators.required, noSoloEspacios, Validators.minLength(3), Validators.maxLength(60)]],
    descripcion: ['', [Validators.required, noSoloEspacios, Validators.minLength(10)]],
    categoria: ['', Validators.required],
    prioridad: ['Media', Validators.required],
    estado: ['Abierto', Validators.required],
  });

  get esEdicion(): boolean {
    return this.ticketId !== null;
  }

  ngOnInit(): void {
    // Leemos el :id de la URL (/tickets/editar/:id)
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.ticketId = Number(id);
      this.ticketService.obtener(this.ticketId).subscribe({
        // patchValue rellena el formulario con los datos del ticket
        next: (ticket) => this.formulario.patchValue(ticket),
        error: (err) => this.error.set(mensajeDeError(err)),
      });
    }
  }

  // Devuelve el mensaje de error de un campo, o '' si no hay que mostrar nada
  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return '';
    }
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('soloEspacios')) return 'No puede contener solo espacios.';
    const min = control.getError('minlength');
    if (min) return `Mínimo ${min.requiredLength} caracteres.`;
    const max = control.getError('maxlength');
    if (max) return `Máximo ${max.requiredLength} caracteres.`;
    return 'Valor no válido.';
  }

  guardar(): void {
    // Si hay errores, marcamos todo como "tocado" para que se muestren y NO enviamos
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set('');
    const datos = this.formulario.getRawValue() as TicketDatos;

    const peticion =
      this.ticketId === null
        ? this.ticketService.crear(datos)
        : this.ticketService.actualizar(this.ticketId, datos);

    peticion.subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.enviando.set(false);
      },
    });
  }
}