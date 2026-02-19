import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicket } from './create-ticket';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import type { TicketRepositoryPort } from '../../../application/ports/TicketRepositoryPort';
import { FakeTicketRepositoryAdapter } from '../../../testing/fakes/FakeTicketRepositoryAdapter';
import { TICKET_REPOSITORY } from '../../../di/tickets-providers';

function setFormValues(
  component: CreateTicket,
  overrides?: Partial<{ title: string; description: string; email: string }>
) {
  component.form.setValue({
    title: overrides?.title ?? 'Payment issue',
    description: overrides?.description ?? 'This description is definitely long enough.',
    email: overrides?.email ?? 'user@example.com',
  });
}

function getFieldErrorText(fixture: ComponentFixture<CreateTicket>, fieldId: 'title' | 'description' | 'email') {
  const root: HTMLElement = fixture.nativeElement;
  const container = root.querySelector(`#${fieldId}`)?.closest('.form-group');
  if (!container) return null;
  const el = container.querySelector('small.error');
  return el?.textContent?.trim() ?? null;
}

function getGlobalErrorTexts(fixture: ComponentFixture<CreateTicket>) {
  const root: HTMLElement = fixture.nativeElement;
  const errors = Array.from(root.querySelectorAll('div.error')).map((e) => e.textContent?.trim() ?? '');
  // field errors are <small.error>, global errors are <div.error>
  return errors.filter(Boolean);
}

describe('CreateTicket (template + component)', () => {
  let fixture: ComponentFixture<CreateTicket>;
  let component: CreateTicket;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTicket],
      providers: [
        FakeTicketRepositoryAdapter,
        { provide: TICKET_REPOSITORY, useExisting: FakeTicketRepositoryAdapter },
        {
          provide: CreateTicketUseCase,
          useFactory: (repo: TicketRepositoryPort) => new CreateTicketUseCase(repo),
          deps: [TICKET_REPOSITORY],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the form skeleton', () => {
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('form.create-ticket-form')).not.toBeNull();
    expect(root.querySelector('h2')?.textContent ?? '').toContain('Create Support Ticket');

    expect(root.querySelector('#title')).not.toBeNull();
    expect(root.querySelector('#description')).not.toBeNull();
    expect(root.querySelector('#email')).not.toBeNull();

    const button = root.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(button).not.toBeNull();
  });

  it('does not render field errors until touched', () => {
    component.form.controls.title.setValue('');
    component.form.controls.description.setValue('');
    component.form.controls.email.setValue('');
    fixture.detectChanges();

    expect(getFieldErrorText(fixture, 'title')).toBeNull();
    expect(getFieldErrorText(fixture, 'description')).toBeNull();
    expect(getFieldErrorText(fixture, 'email')).toBeNull();
  });

  it('disables submit button when form invalid', () => {
    const root: HTMLElement = fixture.nativeElement;
    const button = root.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('enables submit button when form becomes valid', async () => {
    setFormValues(component);
    component.form.markAllAsTouched();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement;
    const button = root.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(component.form.valid).toBe(true);
    expect(button.disabled).toBe(false);
  });

  it('submits, calls use case with trimmed values, resets the form, and keeps no global error', async () => {
    const uc = TestBed.inject(CreateTicketUseCase);
    const executeSpy = vi.spyOn(uc, 'execute');

    setFormValues(component, {
      title: '  Payment issue  ',
      description: '  This description is definitely long enough.  ',
      email: '  USER@EXAMPLE.COM  ',
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    await component.submit();
    fixture.detectChanges();

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy.mock.calls[0][0]).toEqual({
      title: 'Payment issue',
      description: 'This description is definitely long enough.',
      email: 'USER@EXAMPLE.COM',
    });


    expect(component.form.controls.title.value).toBe('');
    expect(component.form.controls.description.value).toBe('');
    expect(component.form.controls.email.value).toBe('');

    expect(getGlobalErrorTexts(fixture)).toEqual([]);
  });

  it('renders global submit error when use case throws', async () => {
    const uc = TestBed.inject(CreateTicketUseCase);
    vi.spyOn(uc, 'execute').mockRejectedValue(new Error('Boom'));

    setFormValues(component);
    component.form.markAllAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();

    await component.submit();
    fixture.detectChanges();

    expect(component.submitError()).toBe('Boom');

    const globalErrors = getGlobalErrorTexts(fixture);
    expect(globalErrors).toContain('Boom');
  });
});
