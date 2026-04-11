export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
}

export interface TicketCreateRequest {
  eventId: number;
}
