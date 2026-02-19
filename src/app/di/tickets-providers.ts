import { InjectionToken, Provider } from "@angular/core";
import { TicketRepositoryPort } from "../application/ports/TicketRepositoryPort";
import { CreateTicketUseCase } from "../application/use-cases/CreateTicketUseCase";
import { HttpTicketRepositoryAdapter } from "../infrastructure/adapters/http/HttpTicketRepositoryAdapter";

export const TICKET_REPOSITORY = new InjectionToken<TicketRepositoryPort>("TICKET_REPOSITORY");

export const TICKETS_PROVIDERS: Provider[] = [
  // adapter (Angular service)
  HttpTicketRepositoryAdapter,

  // port => adapter binding
  { provide: TICKET_REPOSITORY, useExisting: HttpTicketRepositoryAdapter },

  // use case (constructed with the port)
  {
    provide: CreateTicketUseCase,
    deps: [TICKET_REPOSITORY],
    useFactory: (repo: TicketRepositoryPort) => new CreateTicketUseCase(repo),
  },
];
