import { apiRequest } from "./client";
import { eventsService } from "./eventsService";
import { ticketsService } from "./ticketsService";
import type { EventResponse } from "../interface/Event.interface";

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalTicketsSold: number;
  activeUsers: number;
  totalRevenue: number;
  topEvents: EventResponse[];
}

interface BackendDashboardStats {
  totalEvents: number;
  totalTicketsSold: number;
  totalUsers: number;
  totalRevenue: number;
  topEvents: EventResponse[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const stats = await apiRequest<BackendDashboardStats>("/Dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    });

    return {
      totalEvents: stats.totalEvents,
      totalTicketsSold: stats.totalTicketsSold,
      totalUsers: stats.totalUsers,
      activeUsers: stats.totalUsers,
      totalRevenue: stats.totalRevenue,
      topEvents: stats.topEvents,
    };
  },

  getUserStats: async () => {
    const [tickets, eventsResponse] = await Promise.all([
      ticketsService.getMine(),
      eventsService.getAll(),
    ]);

    const upcomingTickets = tickets.filter(
      (t) => new Date(t.eventDate) >= new Date(),
    );
    const attendedTickets = tickets.filter((t) => t.isRedeemed);

    // Identify next event
    const sortedUpcoming = [...upcomingTickets].sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );
    const nextEvent = sortedUpcoming[0] || null;

    // Recommendations
    let recommendations: EventResponse[] = [];
    if (!Array.isArray(eventsResponse)) {
      recommendations = eventsResponse.recommended || [];
    }

    return {
      totalBooked: tickets.length,
      upcomingCount: upcomingTickets.length,
      attendedCount: attendedTickets.length,
      nextEvent,
      recommendations,
    };
  },
};
