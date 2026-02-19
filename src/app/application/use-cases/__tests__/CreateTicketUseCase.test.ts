import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTicketUseCase } from '../CreateTicketUseCase';
import { FakeTicketRepositoryAdapter } from '../../../testing/fakes/FakeTicketRepositoryAdapter';

describe('CreateTicketUseCase', () => {
  let repo: FakeTicketRepositoryAdapter;
  let useCase: CreateTicketUseCase;

  beforeEach(() => {
    repo = new FakeTicketRepositoryAdapter();
    repo.clear();
    useCase = new CreateTicketUseCase(repo);
  });

  it('persists a trimmed + normalized NewTicket via the repository', async () => {
    const created = await useCase.execute({
      title: '  Payment issue  ',
      description: '  This description is definitely long enough.  ',
      email: 'TEST@EXAMPLE.COM',
    });

    // assertions about behavior controlled by the use case
    const stored = repo.getAll();
    expect(stored).toHaveLength(1);

    expect(stored[0].title).toBe('Payment issue');
    expect(stored[0].description).toBe('This description is definitely long enough.');
    expect(stored[0].email.getValue()).toBe('test@example.com');

    // result is whatever the repository returns (don't assert repo internals)
    expect(created.title).toBe('Payment issue');
    expect(created.description).toBe('This description is definitely long enough.');
    expect(created.email.getValue()).toBe('test@example.com');
  });

  it('does not persist when title is empty after trim', async () => {
    await expect(
      useCase.execute({
        title: '   ',
        description: 'This description is definitely long enough.',
        email: 'a@b.com',
      })
    ).rejects.toThrow(/title/i);

    expect(repo.getAll()).toHaveLength(0);
  });

  it('does not persist when description is too short after trim', async () => {
    await expect(
      useCase.execute({
        title: 'Bug',
        description: '                    short                    ',
        email: 'a@b.com',
      })
    ).rejects.toThrow(/20/i);

    expect(repo.getAll()).toHaveLength(0);
  });

  it('does not persist when email is invalid', async () => {
    await expect(
      useCase.execute({
        title: 'Bug',
        description: 'This description is definitely long enough.',
        email: 'not-an-email',
      })
    ).rejects.toThrow(/email/i);

    expect(repo.getAll()).toHaveLength(0);
  });
});
