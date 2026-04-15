import { apiRequest } from "./client";
import type {
  TicketResponse,
  TicketCreateRequest,
} from "../interface/Ticket.interface";
// import type { PaginationParams, PaginatedResponse } from "@/interface/pagination";

export const ticketsService = {
  getMine: (): Promise<TicketResponse[]> => {
    const searchQuery = ""; // Define searchQuery with a default value
    const page = 1; // Define page with a default value
    const pageSize = 10; // Define pageSize with a default value
    return apiRequest<TicketResponse[]>("/tickets/mine", {
      method: "GET",
      requiresAuth: true,
      params: { search: searchQuery, page, pageSize },
    });
  },

  register: (data: TicketCreateRequest): Promise<TicketResponse> =>
    apiRequest<TicketResponse>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  cancel: (id: number): Promise<void> =>
    apiRequest<void>(`/tickets/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),

  scan: (id: number): Promise<{ message: string }> =>
    apiRequest<{ message: string }>(`/tickets/scan/${id}`, {
      method: "POST",
      requiresAuth: true,
    }),

  getAll: (): Promise<TicketResponse[]> =>
    apiRequest<TicketResponse[]>("/tickets", {
      method: "GET",
      requiresAuth: true,
    }),

  //   getAllPaginated: (params: PaginationParams & { status?: string }): Promise<PaginatedResponse<TicketResponse>> =>
  // apiRequest<PaginatedResponse<TicketResponse>>("/tickets/paginated", {
  //   method: "GET",
  //   params: params as unknown as Record<string, unknown>,
  //   requiresAuth: true,
  // }),
};
