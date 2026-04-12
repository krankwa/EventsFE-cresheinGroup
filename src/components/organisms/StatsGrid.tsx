import { useEffect, useState } from "react";
import { 
  ArrowUpRight,
  Users, 
  CalendarDays, 
  Ticket, 
  TrendingUp
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { dashboardService, type DashboardStats } from "../../services/dashboardService";

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-10 bg-muted/50 rounded-t-md" />
            <CardContent className="h-20 bg-muted/20 rounded-b-md" />
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    { 
      label: "Total Events", 
      value: stats?.totalEvents || 0, 
      icon: CalendarDays, 
      change: "Live from DB", 
      color: "text-blue-600" 
    },
    { 
      label: "Tickets Sold", 
      value: stats?.totalTicketsSold.toLocaleString() || 0, 
      icon: Ticket, 
      change: "All time", 
      color: "text-emerald-600" 
    },
    { 
      label: "Active Users", 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      change: "Total registered", 
      color: "text-violet-600" 
    },
    { 
      label: "Total Revenue", 
      value: `₱${stats?.totalRevenue.toLocaleString() || 0}`, 
      icon: TrendingUp, 
      change: "Based on pricing", 
      color: "text-amber-600" 
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
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
