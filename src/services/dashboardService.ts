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
    const [eventsResponse, users] = await Promise.all([
      eventsService.getAll(),
      userService.getAll(),
    ]);
    let events: EventResponse[] = [];
    if (Array.isArray(eventsResponse)) {
      events = eventsResponse;
    } else {
      // It's the authenticated object -> merge them all
      events = [
        ...(eventsResponse.recommended || []),
        ...(eventsResponse.popular || []),
        ...(eventsResponse.allOthers || []),
      ];
    }

    const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);

    // Simulations for metrics not yet in DB
    const totalRevenue = totalTicketsSold * 250; // Mock price of 250

    // Sort by conversion rate
    const topEvents = [...events]
      .sort(
        (a, b) =>
          (b.capacity ? b.ticketsSold / b.capacity : 0) -
          (a.capacity ? a.ticketsSold / a.capacity : 0),
      )
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
