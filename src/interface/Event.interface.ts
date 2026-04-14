export interface VenueResponse {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface TicketTierResponse {
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
  id?: number;
  name: string;
  price: number;
  capacity: number;
  ticketsSold?: number;
}

export interface EventResponse {
  eventID: number;
  title: string;
  date: string;
  capacity: number;
  ticketsSold: number;
  availableTickets: number;
  maxTicketsPerPerson: number;
  coverImageUrl: string | null;
  venue: VenueResponse;
  tiers: TicketTierResponse[];
}

export interface EventCreateDTO {
  title: string;
  date: string;
  venueId?: number | undefined;
  venueName?: string;
  venueAddress?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  capacity: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateDTO[];
}

export interface EventUpdateDTO {
  title: string;
  date: string;
  venueId?: number | undefined;
  venueName?: string;
  venueAddress?: string;
  venueLatitude?: number;
  venueLongitude?: number;
  capacity: number;
  maxTicketsPerPerson: number;
  coverImageUrl?: string | null;
  tiers: TicketTierCreateDTO[];
}
