import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTicketRepositoryAdapter } from '../HttpTicketRepositoryAdapter';
import { NewTicket } from '../../../../domain/entities/Ticket';
import { Email } from '../../../../domain/value-objects/Email';
import { TicketResponseDto } from '../dtos/ticket-response.dto';

describe('HttpTicketRepositoryAdapter', () => {
  let adapter: HttpTicketRepositoryAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpTicketRepositoryAdapter,
      ],
    });

    adapter = TestBed.inject(HttpTicketRepositoryAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST mapped DTO and return mapped domain Ticket', async () => {
    const newTicket: NewTicket = {
      title: 'Payment issue',
      description: 'This description is definitely long enough.',
      email: Email.create('User@Example.com'),
    };

    const promise = adapter.create(newTicket);

    const req = httpMock.expectOne('/api/tickets');
    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      email: 'user@example.com',
      subject: 'Payment issue',
      description: 'This description is definitely long enough.',
    });

    const response: TicketResponseDto = {
      id: 'T-99',
      trackingId: 'TRK-99',
      title: 'Payment issue',
      description: 'This description is definitely long enough.',
      status: 'open',
      email: 'user@example.com',
      createdAt: '2026-02-01T10:00:00.000Z',
      updatedAt: '2026-02-01T10:05:00.000Z',
    };

    req.flush(response);

    const created = await promise;

    expect(created.id).toBe('T-99');
    expect(created.trackingId).toBe('TRK-99');
    expect(created.email.getValue()).toBe('user@example.com');
    expect(created.createdAt.toISOString()).toBe('2026-02-01T10:00:00.000Z');
    expect(created.updatedAt!.toISOString()).toBe('2026-02-01T10:05:00.000Z');
  });

  it('should surface HTTP errors as rejections', async () => {
    const newTicket: NewTicket = {
      title: 'Payment issue',
      description: 'This description is definitely long enough.',
      email: Email.create('user@example.com'),
    };

    const promise = adapter.create(newTicket);

    const req = httpMock.expectOne('/api/tickets');
    req.flush({ message: 'Boom' }, { status: 500, statusText: 'Server Error' });

    await expect(promise).rejects.toThrow();
  });
});
