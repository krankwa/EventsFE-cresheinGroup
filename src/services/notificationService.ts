import { apiRequest } from "./client";

export interface UserNotification {
  id: number;
  userId: number;
  eventId?: number;
  title: string;
  message: string;
  type: string;
  payload?: any;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getAll: (): Promise<UserNotification[]> =>
    apiRequest<UserNotification[]>("/Notifications", {
      method: "GET",
      requiresAuth: true,
    }),

  getUnreadCount: (): Promise<number> =>
    apiRequest<number>("/Notifications/unread-count", {
      method: "GET",
      requiresAuth: true,
    }),

  markAsRead: (id: number): Promise<void> =>
    apiRequest<void>(`/Notifications/${id}/read`, {
      method: "PUT",
      requiresAuth: true,
    }),

  markAllAsRead: (): Promise<void> =>
    apiRequest<void>("/Notifications/read-all", {
      method: "PUT",
      requiresAuth: true,
    }),
};
