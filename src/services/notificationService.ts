import { apiRequest } from "./client";

export interface EventUpdatePayload {
  OldDate: string;
  NewDate: string;
  OldVenue: string;
  NewVenue: string;
  NewVenueAddress?: string;
}

export interface UserNotification {
  id: number;
  userId: number;
  eventId?: number;
  title: string;
  message: string;
  type: string;
  payload?: EventUpdatePayload | Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getAll: (): Promise<UserNotification[]> =>
    apiRequest<UserNotification[]>("/notifications", {
      method: "GET",
      requiresAuth: true,
    }),

  getUnreadCount: (): Promise<number> =>
    apiRequest<number>("/notifications/unread-count", {
      method: "GET",
      requiresAuth: true,
    }),

  markAsRead: (id: number): Promise<void> =>
    apiRequest<void>(`/notifications/${id}/read`, {
      method: "PUT",
      requiresAuth: true,
    }),

  markAllAsRead: (): Promise<void> =>
    apiRequest<void>("/notifications/read-all", {
      method: "PUT",
      requiresAuth: true,
    }),
};
