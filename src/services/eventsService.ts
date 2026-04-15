import { apiRequest } from "./client";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
  EventsFeedResponse,
} from "../interface/Event.interface";

export const eventsService = {
  getAll: (): Promise<EventsFeedResponse> =>
    apiRequest<EventsFeedResponse>("/Event", {
      method: "GET",
      //requiresAuth: false,
    }),

  getAllPaginated: (params: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
  }): Promise<EventsFeedResponse> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
    });
    if (params.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm);
    }
    return apiRequest<EventsFeedResponse>(`/Event?${queryParams.toString()}`, {
      method: "GET",
    });
  },

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
