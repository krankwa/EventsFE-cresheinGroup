import { apiRequest } from "./client";
import type {
  TicketTierCreateRequest,
  TicketTierResponse,
} from "../interface/Event.interface";

export const ticketTiersService = {
  getAllTiers: (): Promise<TicketTierResponse[]> =>
    apiRequest<TicketTierResponse[]>("/TicketTier", {
      method: "GET",
      requiresAuth: false,
    }),

  getTiersByEventId: (eventId: number): Promise<TicketTierResponse[]> =>
    apiRequest<TicketTierResponse[]>(`/Event/${eventId}/TicketTiers`, {
      method: "GET",
      requiresAuth: true,
    }),

  createTier: (tier: TicketTierCreateRequest): Promise<TicketTierResponse> =>
    apiRequest<TicketTierResponse>("/TicketTier", {
      method: "POST",
      body: JSON.stringify(tier),
      requiresAuth: true,
    }),

  updateTier: (
    id: number,
    tier: TicketTierCreateRequest,
  ): Promise<TicketTierResponse> =>
    apiRequest<TicketTierResponse>(`/TicketTier/${id}`, {
      method: "PUT",
      body: JSON.stringify(tier),
      requiresAuth: true,
    }),

  deleteTier: (id: number): Promise<void> =>
    apiRequest<void>(`/TicketTier/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    }),
};
