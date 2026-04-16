import { apiRequest } from "./client";
import type {
  TicketResponse,
  TicketCreateRequest,
} from "../interface/Ticket.interface";
import type { PaginationParams, PaginatedResponse } from "../interface/pagination";

export const ticketsService = {
  getMine: (): Promise<TicketResponse[]> =>
    apiRequest<TicketResponse[]>("/tickets/mine", {
      method: "GET",
      requiresAuth: true,
    }),

  getMyTicketsPaginated: (params: PaginationParams): Promise<PaginatedResponse<TicketResponse>> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
    });
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.status) queryParams.append("status", params.status as string);
    
    return apiRequest<PaginatedResponse<TicketResponse>>(`/tickets/mine/list?${queryParams.toString()}`, {
      method: "GET",
      requiresAuth: true,
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

  getPaginated: (params: PaginationParams): Promise<PaginatedResponse<TicketResponse>> => {
    const queryParams = new URLSearchParams({
      pageNumber: params.pageNumber.toString(),
      pageSize: params.pageSize.toString(),
    });
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.status) queryParams.append("status", params.status as string);
    
    return apiRequest<PaginatedResponse<TicketResponse>>(`/tickets/paginated?${queryParams.toString()}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  validatePayment: (data: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }): Promise<{ isValid: boolean; message: string }> =>
    apiRequest<{ isValid: boolean; message: string }>("/payment/validate", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),
};
