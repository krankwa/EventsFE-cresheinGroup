import { NavLink, Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Ticket,
  Search,
  User,
  LogOut,
  Bell,
  Star,
  Flame,
  List,
} from "lucide-react";
import { useUser } from "../../features/authentication/useUser";
import { useLogout } from "../../features/authentication/useLogout";
import { useEvents } from "../../features/events/useEvents";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useConfirm } from "../ui/confirm-context";

export function UserNavbar() {
  const { user } = useUser();
  const { logout } = useLogout();
  const { confirm } = useConfirm();
  const location = useLocation();

  // Only fetch events feed if we are on the events page/home page where it matters
  const isEventsPage =
    location.pathname === "/events" || location.pathname === "/";
  const { data: eventsData } = useEvents();

  let hasRecommendations = false;
  let hasPopular = false;
  let hasAllEvents = false;

  if (isEventsPage && eventsData && !Array.isArray(eventsData)) {
    hasRecommendations = (eventsData.recommended?.length ?? 0) > 0;
    hasPopular = (eventsData.popular?.length ?? 0) > 0;
    hasAllEvents = (eventsData.allOthers?.length ?? 0) > 0;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    confirm({
      title: "Sign Out",
      description: (
        <div className="space-y-2">
          <p>Are you sure you want to sign out?</p>
          <p className="text-sm text-muted-foreground">
            You will need to log in again to access your account.
          </p>
        </div>
      ),
      confirmText: "Sign Out",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await logout();
      },
    });
  };

  return (
    <nav className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Website Name */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
          <CalendarDays className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">
          EventTix
        </span>
      </Link>

      {/* Center: Navigation Links & Search */}
      <div className="flex items-center gap-6 md:gap-8 flex-1 justify-center md:justify-start md:ml-12">
        <div className="flex items-center gap-1 md:gap-4">
          <NavLink
            to="/tickets"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Tickets</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </NavLink>

          {/* Quick Scroll Links (only visible on pages with these sections) */}
          {isEventsPage && (
            <div className="hidden lg:flex items-center gap-1 border-l pl-4 ml-2">
              {hasRecommendations && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection("recommended-section")}
                  className="text-muted-foreground gap-2"
                >
                  <Star className="w-4 h-4 text-yellow-500" />
                  Recommended
                </Button>
              )}
              {hasPopular && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection("popular-section")}
                  className="text-muted-foreground gap-2"
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  Popular
                </Button>
              )}
              {hasAllEvents && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection("all-events-section")}
                  className="text-muted-foreground gap-2"
                >
                  <List className="w-4 h-4 text-primary" />
                  All Events
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search amazing events..."
            className="pl-9 h-10 w-full bg-muted/50 border-muted placeholder:text-muted-foreground focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-primary text-[10px] border-background animate-pulse">
            3
          </Badge>
        </Button>

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <p className="text-sm font-semibold leading-none">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all overflow-hidden"
            >
              <User className="w-5 h-5 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
