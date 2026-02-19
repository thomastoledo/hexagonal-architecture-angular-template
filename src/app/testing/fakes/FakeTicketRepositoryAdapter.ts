import { TicketRepositoryPort } from "../../application/ports/TicketRepositoryPort";
import { NewTicket, Ticket } from "../../domain/entities/Ticket";

export class FakeTicketRepositoryAdapter implements TicketRepositoryPort {
  private store: Ticket[] = [];
  private idSequence = 1;
  private trackingSequence = 1;

  constructor(private readonly fixedNow = new Date('2026-01-01T00:00:00.000Z')) {}

  async create(ticket: NewTicket): Promise<Ticket> {
    const created: Ticket = {
      id: `T-${this.idSequence++}`,
      trackingId: `TRACK-${this.trackingSequence++}`,
      title: ticket.title,
      description: ticket.description,
      email: ticket.email,
      status: 'open',
      createdAt: this.fixedNow,
      updatedAt: this.fixedNow,
    };

    this.store.push(created);
    return created;
  }

  getAll(): Ticket[] {
    return [...this.store];
  }

  clear(): void {
    this.store = [];
    this.idSequence = 1;
    this.trackingSequence = 1;
  }
}
