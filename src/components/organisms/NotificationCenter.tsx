import { useState, useRef, useEffect } from "react";
import { Bell, Info, Calendar, MapPin } from "lucide-react";
import { useNotifications } from "../../features/notifications/useNotifications";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } =
    useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-primary/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell
          className={cn(
            "w-5 h-5",
            unreadCount > 0
              ? "text-primary animate-pulse"
              : "text-muted-foreground",
          )}
        />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.2rem] h-5 flex items-center justify-center text-[10px] font-bold border-2 border-background"
            variant="destructive"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-[70px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80 md:w-96 bg-background border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top sm:origin-top-right">
          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
            <h3 className="font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] hover:text-primary"
                onClick={() => markAllAsRead()}
              >
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto py-2 custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs">Loading updates...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs">No new updates for your events.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer relative group border-l-2",
                    notification.isRead
                      ? "border-transparent"
                      : "border-primary bg-primary/5",
                  )}
                  onClick={() =>
                    !notification.isRead && markAsRead(notification.id)
                  }
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        notification.type === "EventUpdate"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600",
                      )}
                    >
                      {notification.type === "EventUpdate" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-bold leading-none mb-1",
                          !notification.isRead && "text-primary",
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                        {notification.message}
                      </p>

                      {notification.payload && (
                        <div className="bg-background/50 border rounded-md p-2 mt-2 text-[10px] space-y-1">
                          {notification.payload.OldDate !==
                            notification.payload.NewDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground line-through">
                                {new Date(
                                  notification.payload.OldDate,
                                ).toLocaleDateString()}
                              </span>
                              <span className="text-primary font-semibold">
                                →{" "}
                                {new Date(
                                  notification.payload.NewDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {notification.payload.OldVenue !==
                            notification.payload.NewVenue && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${notification.payload.NewVenue} ${notification.payload.NewVenueAddress || ""}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-start gap-1.5 hover:text-primary transition-colors group/notif-map"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 group-hover/notif-map:animate-bounce shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-muted-foreground line-through block text-[9px] opacity-70">
                                  {notification.payload.OldVenue}
                                </span>
                                <span className="text-primary font-bold block truncate">
                                  {notification.payload.NewVenue}
                                </span>
                              </div>
                            </a>
                          )}
                        </div>
                      )}

                      <p className="text-[9px] text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {!notification.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t bg-muted/10 text-center">
            <p className="text-[10px] text-muted-foreground">
              Notifications are kept for 30 days
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
