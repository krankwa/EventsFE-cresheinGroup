import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Ticket, LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";

export function PublicNavbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDashboard = () => {
    if (isAdmin) navigate("/admin");
    else navigate("/events");
  };

  return (
    <nav className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
          <CalendarDays className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">EventTix</span>
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* My Tickets shortcut for regular users */}
            {!isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
                onClick={() => navigate("/tickets")}
              >
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">My Tickets</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDashboard}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{isAdmin ? "Dashboard" : user.name}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sign Out"
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/login">Get Tickets</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
