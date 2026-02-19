import { TicketRepositoryPort } from "../ports/TicketRepositoryPort";
import { NewTicket, Ticket } from "../../domain/entities/Ticket";
import { Email } from "../../domain/value-objects/Email";

export interface CreateTicketCommand {
    title: string;
    description: string;
    email: string;
}

export class CreateTicketUseCase {

    constructor(
        private readonly ticketRepository: TicketRepositoryPort
    ) { }

    async execute(command: CreateTicketCommand): Promise<Ticket> {
        // 1. Validate and construct Value Objects
        if (!command.title || command.title.trim().length === 0) {
            throw new Error("Title cannot be empty.");
        }

        if (command.description.trim().length < 20) {
            throw new Error("Description must be at least 20 characters.");
        }

        const { ok, value: email } = Email.tryCreate(command.email);

        if (!ok) {
            throw new Error("Invalid email address.");
        }

        // 2. Build the domain input
        const newTicket: NewTicket = {
            title: command.title.trim(),
            description: command.description.trim(),
            email: email!,
        };

        // 3. Persist through the port
        const createdTicket = await this.ticketRepository.create(newTicket);

        // 4. Return the result
        return createdTicket;
    }
}