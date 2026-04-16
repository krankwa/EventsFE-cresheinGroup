import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services/notificationService";
import type { UserNotification } from "../../services/notificationService";

export function useNotifications() {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery<UserNotification[], Error>({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const unreadCountQuery = useQuery<number, Error>({
    queryKey: ["notifications-unread-count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
    },
  });

  return {
    notifications: notificationsQuery.data ?? [],
    unreadCount: unreadCountQuery.data ?? 0,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}
