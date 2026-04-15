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

export interface TicketTierCreateDTO {
  id?: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold?: number;
}

export interface EventResponse {
  Id: number;
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

export interface EventCreateDTO {
  title: string;
  date: string;
  venue: string;
  venueAddress?: string;
  capacity: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateDTO[];
}

export interface EventUpdateDTO {
  title: string;
  date: string;
  venue: string;
  venueAddress?: string;
  capacity: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string;
  tiers: TicketTierCreateDTO[];
}