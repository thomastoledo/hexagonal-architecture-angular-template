import { Email } from "../value-objects/Email";

export interface Ticket {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  email: Email;
  createdAt: Date;
  updatedAt?: Date;
}

export type NewTicket = Omit<Ticket, 'id' | 'trackingId' | 'status' | 'createdAt' | 'updatedAt'>;
