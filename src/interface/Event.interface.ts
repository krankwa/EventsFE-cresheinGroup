export interface TicketTierResponse {
  tierId: number;
  id: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
}

export type EventAvailability =
  | { readonly status: "available"; availableTickets: number }
  | { readonly status: "sold-out" }
  | { readonly status: "upcoming" };

export interface TicketTierCreateDTO {
  name: string;
  price: number;
  capacity: number;
}

export interface EventResponse {
  eventID: number;
  title: string;
  date: string;
  venue: string;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
  coverImageUrl: string | null;
  tiers: TicketTierResponse[];
}

export interface EventCreateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateDTO[];
}

export interface EventUpdateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateDTO[];
}
