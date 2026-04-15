import {
  Users,
  CalendarDays,
  Ticket,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import type { DashboardStats } from "../../../services/dashboardService";
import { Spinner } from "@/components/ui/spinner";

interface StatsGridProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const items = [
    {
      label: "Total Events",
      value: stats?.totalEvents.toString() || "0",
      icon: CalendarDays,
      color: "text-blue-600",
      change: "+3 this month"
    },
    {
      label: "Tickets Sold",
      value: stats?.totalTicketsSold.toLocaleString() || "0",
      icon: Ticket,
      color: "text-emerald-600",
      change: "+14% from last week"
    },
    {
      label: "Active Users",
      value: stats?.activeUsers.toString() || "0",
      icon: Users,
      color: "text-violet-600",
      change: "Live count"
    },
    {
      label: "App Revenue",
      value: `₱${stats?.totalRevenue.toLocaleString() || "0"}`,
      icon: TrendingUp,
      color: "text-amber-600",
      change: "Simulated"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner/>
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
