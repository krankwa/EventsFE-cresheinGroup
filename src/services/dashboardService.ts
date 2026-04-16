import { eventsService } from "./eventsService";
import { userService } from "./userService";
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

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // ... (existing code remains fine, but adding getUserStats below)
    const [eventsResponse, users] = await Promise.all([
      eventsService.getAll(),
      userService.getAll(),
    ]);
    let events: EventResponse[] = [];
    if (Array.isArray(eventsResponse)) {
      events = eventsResponse;
    } else {
      events = [
        ...(eventsResponse.recommended || []),
        ...(eventsResponse.popular || []),
        ...(eventsResponse.allOthers || []),
      ];
    }

    const totalTicketsSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
    const totalRevenue = totalTicketsSold * 250;
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
      recommendations = eventsResponse.recommended;
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
