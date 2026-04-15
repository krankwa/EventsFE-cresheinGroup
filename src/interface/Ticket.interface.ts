export interface TicketResponse {
  ticketId: number;
  userId: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
  eventCoverImageUrl?: string | null;
  tierName?: string | null;
  price: number;
  isRedeemed: boolean;

  venue?: string | null;
  attendeeName?: string;
  attendeeEmail: string;
}

export interface TicketCreateRequest {
  eventId: number;
  tierId: number;
}
