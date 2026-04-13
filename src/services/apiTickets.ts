import { apiFetch } from "./api";
import type {
  TicketResponse,
  TicketCreateRequest,
} from "../interface/Ticket.interface";
import { apiRequest } from "./client";

// POST /api/tickets — User only
export async function registerTicket(
  data: TicketCreateRequest,
): Promise<TicketResponse> {
  return apiFetch<TicketResponse>("/tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET /api/tickets/mine — User only
export async function getMyTickets(): Promise<TicketResponse[]> {
  return apiFetch<TicketResponse[]>("/tickets/mine");
}

// DELETE /api/tickets/{id} — User only
export async function cancelTicket(id: number): Promise<null> {
  return apiFetch<null>(`/tickets/${id}`, { method: "DELETE" });
}

export const getAllTickets = (): Promise<TicketResponse[]> =>
  apiRequest<TicketResponse[]>("/tickets", {
    method: "GET",
    requiresAuth: true,
  });

export const scanTicket = (id: number): Promise<{ message: string }> =>
  apiRequest<{ message: string }>(`/tickets/scan/${id}`, {
    method: "POST",
    requiresAuth: true,
  });
