export interface EventCreateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
}

export interface EventDTO {
  id: string;
  title: string;
  date: string;
  venue: string;
  capacity: number;
  ticketsSold: number;
  ticketsAvailable: number;
}

export interface EventUpdateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
}
