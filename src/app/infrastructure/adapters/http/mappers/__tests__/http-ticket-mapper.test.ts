import { describe, it, expect } from 'vitest';
import { NewTicket } from '../../../../../domain/entities/Ticket';
import { Email } from '../../../../../domain/value-objects/Email';
import { toCreateTicketRequestDto, toDomainTicket } from '../ http-ticket.mapper';
import { TicketResponseDto } from '../../dtos/ticket-response.dto';

describe('http-ticket.mapper', () => {
  it('maps NewTicket -> CreateTicketRequestDto', () => {
    const ticket: NewTicket = {
      title: 'Title',
      description: 'This description is definitely long enough.',
      email: Email.create('Test@Example.com'),
    };

    const dto = toCreateTicketRequestDto(ticket);

    expect(dto).toEqual({
      email: 'test@example.com',
      subject: 'Title',
      description: 'This description is definitely long enough.',
    });
  });

  it('maps TicketResponseDto -> domain Ticket', () => {
    const dto: TicketResponseDto = {
      id: 'T-42',
      trackingId: 'TRK-42',
      title: 'Hello',
      description: 'This description is definitely long enough.',
      status: 'open',
      email: 'User@Example.com',
      createdAt: '2026-02-01T10:00:00.000Z',
      updatedAt: '2026-02-01T11:00:00.000Z',
    };

    const ticket = toDomainTicket(dto);

    expect(ticket.id).toBe('T-42');
    expect(ticket.trackingId).toBe('TRK-42');
    expect(ticket.status).toBe('open');
    expect(ticket.email.getValue()).toBe('user@example.com');
    expect(ticket.createdAt.toISOString()).toBe('2026-02-01T10:00:00.000Z');
    expect(ticket.updatedAt!.toISOString()).toBe('2026-02-01T11:00:00.000Z');
  });

  it('keeps updatedAt undefined when omitted', () => {
    const dto: TicketResponseDto = {
      id: 'T-1',
      trackingId: 'TRK-1',
      title: 'Hello',
      description: 'This description is definitely long enough.',
      status: 'open',
      email: 'user@example.com',
      createdAt: '2026-02-01T10:00:00.000Z',
    };

    const ticket = toDomainTicket(dto);
    expect(ticket.updatedAt).toBeUndefined();
  });
});
