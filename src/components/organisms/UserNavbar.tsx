import { NavLink, Link } from "react-router-dom";
import { CalendarDays, Ticket, Search, User, LogOut, Bell } from "lucide-react";
import { useUser } from "../../features/authentication/useUser";
import { useLogout } from "../../features/authentication/useLogout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useConfirm } from "../ui/confirm-context";
import logo from "../../assets/logo.png";

export function UserNavbar() {
  const { user } = useUser();
  const { logout } = useLogout();
  const { confirm } = useConfirm();

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
         <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
          <img src={logo} alt="Logo" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">
          EventTix
        </span>
      </Link>

      {/* Center: Navigation Links */}
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
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
       

        <div className="h-8 w-px bg-border mx-1" />

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <p className="text-sm font-semibold leading-none">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[120px]">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/myaccount">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-2 border-primary/20 hover:border-primary/50 transition-all overflow-hidden"
              >
                <User className="w-5 h-5 text-primary" />
              </Button>
            </Link>
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
