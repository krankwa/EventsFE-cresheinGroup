import { apiFetch } from "./api";
import type { EventResponse } from "../interface/Event.interface";

// GET /api/event — Public
export async function getEvents(): Promise<EventResponse[]> {
  return apiFetch<EventResponse[]>("/event");
}

// GET /api/event/{id}
export async function getEvent(id: number): Promise<EventResponse> {
  return apiFetch<EventResponse>(`/event/${id}`);
}

//needs more of the ff:
// POST /api/event — Admin only

// PUT /api/event/{id} — Admin only

// DELETE /api/event/{id} — Admin only (204 code is normal)
