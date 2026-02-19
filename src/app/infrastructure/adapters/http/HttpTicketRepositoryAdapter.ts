import { inject, Injectable } from "@angular/core";
import { TicketRepositoryPort } from "../../../application/ports/TicketRepositoryPort";
import { NewTicket, Ticket } from "../../../domain/entities/Ticket";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { toCreateTicketRequestDto, toDomainTicket } from "./mappers/ http-ticket.mapper";
import { TicketResponseDto } from "./dtos/ticket-response.dto";

@Injectable()
export class HttpTicketRepositoryAdapter implements TicketRepositoryPort {
    private readonly httpClient: HttpClient = inject(HttpClient);
    async create(ticket: NewTicket): Promise<Ticket> {
        const payload = toCreateTicketRequestDto(ticket);
        const result = await firstValueFrom(this.httpClient.post<TicketResponseDto>("/api/tickets", payload));
        return toDomainTicket(result);
    }
}