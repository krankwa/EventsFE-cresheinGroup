import type {
  PaginatedResponse,
  PaginationParams,
} from "@/interface/pagination";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
} from "../interface/Event.interface";
import { apiRequest } from "./client";
import { paginatedRequest } from "./paginatedClient";

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const eventsService = {
  getAll: (): Promise<EventResponse[]> =>
    apiRequest<EventResponse[]>("/Event", {
      method: "GET",
      requiresAuth: false,
    }),

  getAllPaginated: (
    params: PaginationParams,
  ): Promise<PaginatedResponse<EventResponse>> => {
    const queryString = buildQueryString({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      searchTerm: params.searchTerm,
    });

    return paginatedRequest<PaginatedResponse<EventResponse>>(
      `/Event/paginated${queryString}`,
      { method: "GET", requiresAuth: false },
    );
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
