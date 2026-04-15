import { useEffect, useState } from "react";
import { Plus, Calendar, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatsGrid } from "../../features/admin/components/StatsGrid";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  dashboardService,
  type DashboardStats,
} from "@/services/dashboardService";
import { DashboardCharts } from "@/components/organisms/DashboardCharts";

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
        setStats(null); // Fallback on error
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Safely extract the array to prevent the "blinking" crash
  const safeTopEvents = Array.isArray(stats?.topEvents) ? stats.topEvents : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Real-time performance metrics for your event platform.
          </p>
        </div>
        <Link to="/admin/events">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </Link>
      </div>

      <StatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Engagement Trends</CardTitle>
                <CardDescription>
                  Daily sales and registration activity.
                </CardDescription>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Live Feed
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <DashboardCharts />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Events</CardTitle>
            <CardDescription>
              Based on real-time conversion rates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
              ))
            ) : safeTopEvents.length === 0 ? (
              <div className="h-[200px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl grayscale opacity-50">
                <Calendar className="w-10 h-10 mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">No events found</p>
                <p className="text-xs text-muted-foreground">
                  Start by creating your first event
                </p>
              </div>
            ) : (
              safeTopEvents.map((event, index) => {
                // Determine safe capacity to prevent division by zero NaN errors
                const capacity =
                  event.capacity && event.capacity > 0 ? event.capacity : 1;
                const sold = event.ticketsSold || 0;
                const percentage = ((sold / capacity) * 100).toFixed(0);

                return (
                  // FIX: Check for event.id, fallback to event.Id, fallback to index
                  <div
                    key={event.id || index}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-12 h-12 rounded overflow-hidden border bg-muted flex-shrink-0">
                      {event.coverImageUrl ? (
                        <img
                          src={event.coverImageUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Calendar className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                        {event.title || "Untitled Event"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.date
                          ? format(new Date(event.date), "MMM d, yyyy")
                          : "No date set"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">
                        {percentage}%
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-medium">
                        {sold >= capacity ? "Sold-out" : "Filling"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
