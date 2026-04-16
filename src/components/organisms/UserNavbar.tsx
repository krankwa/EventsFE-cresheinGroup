import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Ticket,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { NotificationCenter } from "./NotificationCenter";
import { useUser } from "../../features/authentication/useUser";
import { useLogout } from "../../features/authentication/useLogout";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useConfirm } from "../ui/confirm-context";
import logo from "../../assets/logo.png";
import { Separator } from "../ui/separator";

export function UserNavbar() {
  const { user } = useUser();
  const { logout } = useLogout();
  const { confirm } = useConfirm();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [location.pathname]); // Only trigger on path change, avoids dependency loop with isDrawerOpen

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isDrawerOpen]);

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
    <>
      <nav className="h-16 border-b bg-gray-100 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-primary"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Left: Website Name/Logo */}
          <Link to={user ? "/redirect" : "/"} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <img src={logo} alt="Logo" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              EventTix
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4 md:gap-6 flex-1 justify-start ml-12">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            Dashboard
          </NavLink>
          <div className="flex items-center gap-4">
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
              <span>Tickets</span>
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
              <span>Events</span>
            </NavLink>
          </div>
        </div>

        {/* Right: Notifications & Profile Trigger */}
        <div className="flex items-center gap-2 md:gap-4">
          <NotificationCenter />

          <div className="hidden md:block h-8 w-px bg-border mx-1" />

          <div className="hidden md:flex items-center gap-3">
            <div className="flex flex-col text-right">
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

      {/* --- Mobile Drawer (Side App Menu) --- */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden",
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-background z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b flex items-center justify-between bg-primary/5">
          <Link to={user ? "/redirect" : "/"} className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-6 h-6" />
            <span className="font-bold text-lg">EventTix</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Drawer Profile Info */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate italic">
                {user?.email}
              </p>
            </div>
          </div>

          <Separator className="mb-6 opacity-50" />

          {/* Drawer Nav Links */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-3">
              Experience
            </p>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-primary/5 text-foreground",
                )
              }
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-primary/5 text-foreground",
                )
              }
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-5 h-5" />
                <span className="font-medium">My Tickets</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>

            <NavLink
              to="/events"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-primary/5 text-foreground",
                )
              }
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5" />
                <span className="font-medium">Browse Events</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>

            <NavLink
              to="/myaccount"
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between p-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "hover:bg-primary/5 text-foreground",
                )
              }
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5" />
                <span className="font-medium">Account Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </NavLink>
          </div>
        </div>

        {/* Drawer Footer (Sign Out) */}
        <div className="mt-auto p-6 border-t bg-muted/20">
          <Button
            variant="destructive"
            className="w-full justify-start gap-3 h-12 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold">Sign Out</span>
          </Button>
          <p className="text-[10px] text-center text-muted-foreground mt-4 opacity-60 font-medium">
            v2.4.0 • Secured by EventTix Cloud
          </p>
        </div>
      </div>
    </>
  );
}
