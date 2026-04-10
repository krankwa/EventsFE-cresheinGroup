import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings,
  Ticket
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("w-64 border-r bg-background flex flex-col", className)}>
      <div className="p-6 border-b flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <CalendarDays className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight">EventTix</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Support
        </div>
        <button className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Settings className="w-4 h-4" />
          Docs
        </button>
      </div>
    </aside>
  );
}
