import { apiRequest } from "./client";
import type { EventResponse } from "../interface/Event.interface";

export interface DashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalUsers: number;
  totalRevenue: number;
  topEvents: EventResponse[];
}

export const dashboardService = {
  getStats: (): Promise<DashboardStats> =>
    apiRequest<DashboardStats>("/Dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    }),
};
