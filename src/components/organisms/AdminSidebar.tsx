import { NavLink, Link } from "react-router-dom";
import {
  LogOut,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useUser } from "../../features/authentication/useUser";
import { UserInfo } from "./UserInfo";

import { NAV_ITEMS } from "../../features/admin/constants";
import { Button } from "../ui/button";
import { useLogoutWithConfirm } from "../hooks/useLogoutwithConfirm";
import logo from "../../assets/logo.png";


interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const { user } = useUser();
  const { logoutWithConfirm } = useLogoutWithConfirm();

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (user?.role === "Staff") {
      return item.label === "Redemption";
    }
    return true;
  });

  return (
    <aside className={cn(
      "w-72 flex flex-col h-screen bg-blue-950 text-white shadow-xl transition-all duration-300",
      className
    )}>
      {/* Brand Header */}
      <div className="px-6 py-8 flex items-center justify-between">
        <Link to="/redirect" className="flex items-center gap-3 active:scale-95 transition-transform group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
            <img src={logo} alt="Logo" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            EventTix
          </span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="px-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          {/* Administration */}
        </div>

        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/admin"}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                  : "hover:bg-slate-800/50 text-white"
              )
            }
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200",
              "group-hover:scale-110"
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Section */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-blue-950">
        <div className="mb-4 ">
          <UserInfo className="px-2 text-white " />
        </div>

        <button
          onClick={() => {
            onClose?.(); // Close mobile sidebar if applicable
            logoutWithConfirm();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white transition-all hover:bg-red-500/10 hover:text-red-400 group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}