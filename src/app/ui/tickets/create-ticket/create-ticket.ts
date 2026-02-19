import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { trimmedEmail, trimmedMaxLength, trimmedMinLength, trimmedRequired } from '../../validators/trimmed.validators';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss',
})
export class CreateTicket implements OnInit {
  private readonly createTicketUseCase = inject(CreateTicketUseCase);
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', [trimmedRequired(), trimmedMaxLength(120)]],
    description: ['', [trimmedRequired(), trimmedMinLength(20), trimmedMaxLength(5000)]],
    email: ['', [trimmedRequired(), trimmedEmail()]],
  });

  readonly titleError = computed(() => {
    const c = this.form.controls.title;
    if (!c.touched) return null;
    if (c.errors?.['required']) return 'Title is required.';
    if (c.errors?.['maxlength']) return 'Title must be ≤ 120 characters.';
    return null;
  });

  readonly descriptionError = computed(() => {
    const c = this.form.controls.description;
    if (!c.touched) return null;
    if (c.errors?.['required']) return 'Description is required.';
    if (c.errors?.['minlength']) return 'Description must be at least 20 characters.';
    if (c.errors?.['maxlength']) return 'Description must be ≤ 5000 characters.';
    return null;
  });

  readonly emailError = computed(() => {
    const c = this.form.controls.email;
    if (!c.touched) return null;
    if (c.errors?.['required']) return 'Email is required.';
    if (c.errors?.['email']) return 'Invalid email format.';
    return null;
  });

  readonly canSubmit = signal(false);

  ngOnInit(): void {
    this.form.statusChanges.subscribe(() => {
      this.canSubmit.set(this.form.valid && !this.isSubmitting());
    });
  }
  
  async submit(): Promise<void> {
    if (this.isSubmitting() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { title, description, email } = this.form.getRawValue();

    try {
      await this.createTicketUseCase.execute({
        title: title.trim(),
        description: description.trim(),
        email: email.trim(),
      });

      this.form.reset();
    } catch (e) {
      this.submitError.set(e instanceof Error ? e.message : 'Unable to create ticket.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
