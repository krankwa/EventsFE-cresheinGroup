export interface TicketResponse {
  ticketId: number;
  Id: number;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
  eventCoverImageUrl?: string | null;
  tierName?: string | null;
  price: number;
  isRedeemed: boolean;
}

export interface TicketCreateRequest {
  Id: number;
  tierId: number;
}
