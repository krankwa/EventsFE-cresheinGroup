// bases: EventManagementAPI/DTOs/Events/EventDTO.cs
export interface EventDTO {
  id: number;
  title: string;
  date: string;
  venue: string;
  capacity: number;
  ticketsSold: number;
  ticketsAvailable: number;
}

// bases: EventManagementAPI/DTOs/Events/EventCreateDTO.cs
//all required
export interface EventCreateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
}

// bases: EventManagementAPI/DTOs/Events/EventUpdateDTO.cs
//all required
export interface EventUpdateDTO {
  title: string;
  date: string;
  venue: string;
  capacity: number;
}
