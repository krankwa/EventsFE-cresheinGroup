export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
  eventCoverImageUrl?: string | null;
}

export interface TicketCreateRequest {
  eventId: number;
}
