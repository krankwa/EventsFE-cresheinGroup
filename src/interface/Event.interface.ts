export interface TicketTierResponse {
  id: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
}

export interface TierTypeResponse {
  id: number;
  name: string;
}

export type EventAvailability =
  | { readonly status: "available"; availableTickets: number }
  | { readonly status: "sold-out" }
  | { readonly status: "upcoming" };

export interface TicketTierCreateRequest {
  name: string;
  price: number;
  capacity: number;
}

export interface TicketTierUpdateRequest {
  id: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold?: number;
}

export interface EventResponse {
  id: number;
  title: string;
  date: string;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
  maxTicketsPerPerson: number;
  coverImageUrl: string | null;
  venue: string;
  venueAddress?: string;
  tiers: TicketTierResponse[];
}

export interface EventRecommendResponse {
  recommended: EventResponse[] | null;
  popular: EventResponse[];
  allOthers?: EventResponse[];
}

export type EventsFeedResponse = EventRecommendResponse;

export interface EventCreateDTO {
  title: string;
  date: string;
  venue: string;
  venueAddress: string;
  capacity: number;
  ticketsSold?: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateRequest[];
}

export interface EventUpdateDTO {
  title: string;
  date: string;
  venue: string;
  venueAddress: string;
  capacity: number;
  ticketsSold?: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string;
  tiers: TicketTierUpdateRequest[];
}
