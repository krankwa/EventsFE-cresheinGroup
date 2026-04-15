import { eventsService } from "./eventsService";
import { userService } from "./userService";
import type { EventResponse } from "../interface/Event.interface";

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalTicketsSold: number;
  activeUsers: number;
  totalRevenue: number;
  topEvents: EventResponse[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const [events, users] = await Promise.all([
      eventsService.getAll(),
      userService.getAll(),
    ]);

    const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);

    // Simulations for metrics not yet in DB
    const totalRevenue = totalTicketsSold * 250; // Mock price of 250

    // Sort by conversion rate
    const topEvents = [...events]
      .sort((a, b) => b.ticketsSold / b.capacity - a.ticketsSold / a.capacity)
      .slice(0, 4);
 
    return {
      totalUsers: users.length,
      totalEvents: events.length,
      totalTicketsSold,
      activeUsers: users.length,
      totalRevenue,
      topEvents,
    };
  },
};
