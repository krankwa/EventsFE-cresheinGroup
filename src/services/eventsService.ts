import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
  TierTypeResponse,
} from "../interface/Event.interface";

import { apiRequest } from "./client";

export const eventsService = {
  getAll: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),

  getTierTypes: (): Promise<TierTypeResponse[]> =>
    apiRequest<TierTypeResponse[]>("/Event/tier-types", {
      method: "GET",
      requiresAuth: true,
    }),

  getById: (id: number): Promise<EventResponse> =>
    apiRequest<EventResponse>(`/Event/${id}`, {
      method: "GET",
      requiresAuth: false,
    }),

  create: (data: EventCreateDTO): Promise<EventResponse> =>
    apiRequest<EventResponse>("/Event", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  update: (eventID: number, data: EventUpdateDTO): Promise<EventResponse> =>
    apiRequest<EventResponse>(`/Event/${eventID}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  delete: (eventID: number): Promise<void> =>
    apiRequest<void>(`/Event/${eventID}`, {
      method: "DELETE",
      requiresAuth: true,
    }),
};
