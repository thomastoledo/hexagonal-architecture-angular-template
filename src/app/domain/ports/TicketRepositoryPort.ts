import { NewTicket, Ticket } from "../../domain/entities/Ticket";

export interface TicketRepositoryPort {
  create(ticket: NewTicket): Promise<Ticket>;
}
