import { 
  Users, 
  CalendarDays, 
  Ticket, 
  TrendingUp,
  LayoutDashboard,
  Settings,
  Scan
} from "lucide-react";

export const ADMIN_STATS = [
  { label: "Total Events", value: "24", icon: CalendarDays, change: "+3 this month", color: "text-blue-600" },
  { label: "Tickets Sold", value: "1,280", icon: Ticket, change: "+14% from last week", color: "text-emerald-600" },
  { label: "Active Users", value: "482", icon: Users, change: "+12 new today", color: "text-violet-600" },
  { label: "Total Revenue", value: "₱142,500", icon: TrendingUp, change: "+₱12k since Monday", color: "text-amber-600" },
];

export const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/redemption", label: "Redemption", icon: Scan },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
