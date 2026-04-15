// import type {
//   PaginatedResponse,
//   PaginationParams,
// } from "@/interface/pagination";
import type { PaginationParams } from "@/interface/pagination";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
} from "../interface/Event.interface";
import { apiRequest } from "./client";

export const eventsService = {
  getAll: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),

  getAllPaginated: (params: PaginationParams): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
      params,
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

  update: (id: number, data: EventUpdateDTO): Promise<EventResponse> =>
    apiRequest<EventResponse>(`/Event/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  delete: (id: number): Promise<void> =>
    apiRequest<void>(`/Event/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),
};
