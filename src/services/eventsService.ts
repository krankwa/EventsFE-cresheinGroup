import { apiRequest } from "./client";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
} from "../interface/Event.interface";
import type { PaginationParams, PaginatedResponse } from "../interface/pagination";


export const eventsService = {
  getAll: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),

  getPaginated: (params: PaginationParams): Promise<PaginatedResponse<EventResponse>> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
    });
    if (params.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm);
    }
    return apiRequest<PaginatedResponse<EventResponse>>(`/Event/paginated?${queryParams.toString()}`, {
      method: "GET",
    });
  },

  getRecommendations: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event/recommendations", {
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
