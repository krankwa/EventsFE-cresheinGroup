export interface TicketAddRequest {
  userID: string;
  eventID: string;
  bookedAt: string;
}

export interface TicketResponse {
  ticketID: string;
  eventID: string;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
}
