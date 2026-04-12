// bases: EventManagementAPI/DTOs/Tickets/TicketCreateRequest.cs
export interface TicketCreateRequest {
  eventId: number; // [Required]
}

// bases: EventManagementAPI/DTOs/Tickets/TicketResponse.cs
export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
}
