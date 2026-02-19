import { NewTicket, Ticket } from "../../../../domain/entities/Ticket";
import { Email } from "../../../../domain/value-objects/Email";
import { CreateTicketRequestDto } from "../dtos/create-ticket-request.dto";
import { TicketResponseDto } from "../dtos/ticket-response.dto";

export function toCreateTicketRequestDto(ticket: NewTicket): CreateTicketRequestDto {
  return {
    email: ticket.email.getValue(),
    subject: ticket.title,
    description: ticket.description,
  };
}

export function toDomainTicket(dto: TicketResponseDto): Ticket {
    
  return {
    id: dto.id,
    trackingId: dto.trackingId,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    email: Email.create(dto.email),
    createdAt: new Date(dto.createdAt),
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
  };
}