export type EmailValidationError = 'EMPTY' | 'INVALID_FORMAT';

export class Email {
  private constructor(private readonly value: string) {}

  static create(raw: string): Email {
    const { ok, value, error } = this.tryCreate(raw);
    if (!ok) {
      throw new Error(`Invalid email: ${error}`);
    }
    return value!;
  }
  
  static tryCreate(raw: string): { ok: boolean; value?: Email; error?: EmailValidationError } {
    if (!raw || raw.trim().length === 0) return { ok: false, error: 'EMPTY' };

    const normalized = raw.trim().toLowerCase();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!EMAIL_REGEX.test(normalized)) return { ok: false, error: 'INVALID_FORMAT' };

    return { ok: true, value: new Email(normalized) };
  }

  getValue(): string {
    return this.value;
  }
}
