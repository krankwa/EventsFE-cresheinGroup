import { NavLink } from "react-router-dom";
import { 
  CalendarDays, 
  LogOut,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useUser } from "../../features/authentication/useUser";
import { useLogout } from "../../features/authentication/useLogout";
import { UserInfo } from "./UserInfo";

import { NAV_ITEMS } from "../../features/admin/constants";
import { Button } from "../ui/button";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const { user } = useUser();
  const { logout } = useLogout();

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (user?.role === "Staff") {
      // Staff only sees Redemption
      return item.label === "Redemption";
    }
    // Admin sees everything
    return true;
  });

  return (
    <aside className={cn("w-64 border-r bg-background flex flex-col h-screen", className)}>
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CalendarDays className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">EventTix</span>
        </div>
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/admin"}
            onClick={() => onClose?.()}
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

      <div className="p-4 border-t space-y-4 bg-muted/5">
        <UserInfo className="px-3 pb-2" />

        <div className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
            Session
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive transition-all hover:bg-destructive/10 hover:pl-4 group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
