import type { VenueResponse, VenueUpdateDTO } from "../interface/Venue.interface";
import { apiRequest } from "./client";

export const venueService = {
  getAll: (): Promise<VenueResponse[]> =>
    apiRequest<VenueResponse[]>("/venues", {
      method: "GET",
      requiresAuth: false,
    }),

  getById: (id: number): Promise<VenueResponse> =>
    apiRequest<VenueResponse>(`/venues/${id}`, {
      method: "GET",
      requiresAuth: false,
    }),

  update: (id: number, data: VenueUpdateDTO): Promise<VenueResponse> =>
    apiRequest<VenueResponse>(`/venues/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  create: (data: VenueUpdateDTO): Promise<VenueResponse> =>
    apiRequest<VenueResponse>("/venues", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),
};
