import { 
  Users, 
  CalendarDays, 
  Ticket, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

const stats = [
  { label: "Total Events", value: "24", icon: CalendarDays, change: "+3 this month", color: "text-blue-600" },
  { label: "Tickets Sold", value: "1,280", icon: Ticket, change: "+14% from last week", color: "text-emerald-600" },
  { label: "Active Users", value: "482", icon: Users, change: "+12 new today", color: "text-violet-600" },
  { label: "Total Revenue", value: "₱142,500", icon: TrendingUp, change: "+₱12k since Monday", color: "text-amber-600" },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your events today.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                Chart Placeholder (Add Chart.js / Recharts later)
             </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Events</CardTitle>
            <CardDescription>Based on ticket conversion rates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">IMG</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Summer Music Festival {i}</p>
                  <p className="text-xs text-muted-foreground">April 24, 2026</p>
                </div>
                <div className="text-sm font-semibold text-emerald-600">₱45.2k</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
