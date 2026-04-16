import {
  Ticket,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../../components/ui/card";
import { cn } from "../../../lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface UserStatsGridProps {
  stats: {
    totalBooked: number;
    upcomingCount: number;
    attendedCount: number;
  } | null;
  isLoading?: boolean;
}

export function UserStatsGrid({ stats, isLoading }: UserStatsGridProps) {
  const items = [
    {
      label: "Total Tickets",
      value: stats?.totalBooked.toString() || "0",
      icon: Ticket,
      color: "text-blue-600",
      description: "Total bookings made"
    },
    {
      label: "Upcoming Events",
      value: stats?.upcomingCount.toString() || "0",
      icon: CalendarDays,
      color: "text-emerald-600",
      description: "Registered & future"
    },
    {
      label: "Events Attended",
      value: stats?.attendedCount.toString() || "0",
      icon: CheckCircle2,
      color: "text-violet-600",
      description: "Successfully scanned"
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((stat) => (
        <Card key={stat.label} className="overflow-hidden border-2 border-transparent hover:border-primary/10 transition-all duration-300 shadow-sm bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="text-2xl font-bold">{stat.value}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
