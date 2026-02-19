import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function trimmedRequired(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value ?? '';
    return value.trim().length === 0 ? { required: true } : null;
  };
}

export function trimmedMinLength(min: number): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value ?? '';
    return value.trim().length < min
      ? { minlength: { requiredLength: min, actualLength: value.trim().length } }
      : null;
  };
}

export function trimmedMaxLength(max: number): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value ?? '';
    return value.trim().length > max
      ? { maxlength: { requiredLength: max, actualLength: value.trim().length } }
      : null;
  };
}

export const trimmedEmail = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    if (!v) return null;
    return Validators.email({ value: v } as any);
  };
};
