import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketForm } from './ticket-form';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('TicketForm', () => {
  let component: TicketForm;
  let fixture: ComponentFixture<TicketForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketForm],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
