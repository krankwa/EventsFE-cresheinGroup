import type { EventDTO } from "../types/Event.types";
import { apiRequest } from "./client";

// GET https://localhost:7080/api/Event
// Get all events
// no auth neded
export const eventsService = {
  getAll: (): Promise<EventDTO[]> =>
    apiRequest<EventDTO[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),
};
