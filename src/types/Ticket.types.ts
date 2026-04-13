export interface TicketResponse {
  ticketId: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
  eventCoverImageUrl?: string | null;
  tierName?: string | null;
  price: number;
  isRedeemed: boolean;
}

export interface TicketCreateRequest {
  eventId: number;
   tierId: number;
}
