import { apiRequest } from "./client";
import type { TicketResponse, TicketCreateRequest } from "../types/Ticket.types";

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
};
