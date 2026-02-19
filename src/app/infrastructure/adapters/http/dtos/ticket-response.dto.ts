export type TicketResponseDto = {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  email: string;
  createdAt: string;
  updatedAt?: string;
};
