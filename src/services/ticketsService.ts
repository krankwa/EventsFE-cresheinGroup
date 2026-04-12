import { apiRequest } from "./client";
import type {
  TicketResponse,
  TicketCreateRequest,
} from "../interface/Ticket.interface";

export const ticketsService = {
  getMine: (): Promise<TicketResponse[]> =>
    apiRequest<TicketResponse[]>("/tickets/mine", {
      method: "GET",
      requiresAuth: true,
    }),

  register: (data: TicketCreateRequest): Promise<TicketResponse> =>
    apiRequest<TicketResponse>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  cancel: (id: number): Promise<void> =>
    apiRequest<void>(`/tickets/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),

  scan: (id: number): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(`/tickets/scan/${id}`, {
      method: "POST",
      requiresAuth: true,
    }),
};
