import type { EventResponse } from "../types/Event.types";
import { apiRequest } from "./client";

// GET https://localhost:7080/api/Event
// Get all events
// no auth neded
export const eventsService = {
  getAll: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),
};
