import { apiFetch } from "./api";
import type {
  TicketResponse,
  TicketCreateRequest,
} from "../interface/Ticket.interface";

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
