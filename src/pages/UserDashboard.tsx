import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserStatsGrid } from "../features/account/components/UserStatsGrid";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { dashboardService } from "@/services/dashboardService";
import { useUser } from "@/features/authentication/useUser";
import logo from "../assets/logo.png";
import type { EventResponse } from "@/interface/Event.interface";
import type { TicketResponse } from "@/interface/Ticket.interface";

export function UserDashboard() {
  const { user } = useUser();
  const [data, setData] = useState<{
    totalBooked: number;
    upcomingCount: number;
    attendedCount: number;
    nextEvent: TicketResponse | null;
    recommendations: EventResponse[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getUserStats()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground text-lg mt-1 font-medium">
            Here's what's happening with your events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/events">
            <Button
              variant="outline"
              className="rounded-full px-6 border-primary/20 hover:bg-primary/5"
            >
              Browse All
            </Button>
          </Link>
          <Link to="/tickets">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
              My Tickets
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <UserStatsGrid stats={data} isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Event / Featured Card */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/10 via-background to-background relative group">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
              <Calendar className="w-3 h-3" />
              Your Next Adventure
            </div>
            <CardTitle className="text-2xl pb-1">
              {isLoading
                ? "Loading your next event..."
                : data?.nextEvent
                  ? data.nextEvent.eventTitle
                  : "No upcoming events"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              {data?.nextEvent ? (
                <>
                  <MapPin className="w-3 h-3" />
                  {data.nextEvent.venue}
                </>
              ) : (
                "Time to book a new experience!"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 pb-8">
            {data?.nextEvent ? (
              <div className="space-y-8">
                <div className="flex flex-wrap gap-4 md:gap-6 items-center">
                  <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border shadow-sm flex-1 min-w-[200px] hover:bg-primary/[0.02] transition-colors">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                      When
                    </p>
                    <p className="font-bold text-xl">
                      {format(
                        new Date(data.nextEvent.eventDate),
                        "MMMM d, yyyy",
                      )}
                    </p>
                    <p className="text-sm text-primary font-bold mt-1 uppercase tracking-wide">
                      {format(new Date(data.nextEvent.eventDate), "p")}
                    </p>
                  </div>
                  <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border shadow-sm flex-1 min-w-[200px] hover:bg-primary/[0.02] transition-colors">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">
                      Seat / Tier
                    </p>
                    <p className="font-bold text-xl">
                      {data.nextEvent.tierName}
                    </p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                      Confirmed
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-primary/5">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-md">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold leading-none">
                        Shared Experience
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-tighter">
                        Join <span className="text-primary font-bold">50+</span>{" "}
                        others attending
                      </p>
                    </div>
                  </div>
                  <Link to="/tickets" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 group h-12 px-8 rounded-xl shadow-lg shadow-primary/20">
                      View Ticket
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Ticket className="w-10 h-10 text-primary/40" />
                </div>
                <div className="max-w-[280px]">
                  <p className="text-sm font-medium">
                    You haven't booked any upcoming events yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Discover trending events nearby and secure your spot today!
                  </p>
                </div>
                <Link to="/events">
                  <Button variant="default" className="rounded-full">
                    Explore Events
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Small Action / Info Card */}
        <Card className="h-full flex flex-col justify-between border-primary/10 shadow-lg group hover:border-primary/30 transition-colors overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">Pro Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can now add your tickets to Apple Wallet or Google Pay
              directly from the ticket details view. Make sure to have your QR
              code ready at the venue entrance.
            </p>
          </div>
          <div className="p-6 pt-0 mt-auto">
            <div className="aspect-video rounded-xl bg-gradient-to-tr from-violet-600/20 to-primary/20 border border-primary/10 flex items-center justify-center">
              <img
                src={logo}
                className="w-12 h-12 grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                alt=""
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recommended Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Handpicked for You
            </h2>
            <p className="text-muted-foreground text-sm">
              Recommended based on your preferences
            </p>
          </div>
          <Link
            to="/events"
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            Explore all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-3xl bg-muted animate-pulse"
              />
            ))
          ) : data?.recommendations && data.recommendations.length > 0 ? (
            data.recommendations.slice(0, 4).map((event) => (
              <Link key={event.id} to={`/events/${event.id}`} className="group">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-3 shadow-md group-hover:shadow-2xl transition-all duration-500">
                  {event.coverImageUrl ? (
                    <img
                      src={event.coverImageUrl}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={event.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <p className="text-white font-bold leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                    <p className="text-white/70 text-[10px] mt-1 uppercase tracking-widest font-bold">
                      {event.venue} • {format(new Date(event.date), "MMM d")}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground">
              <Sparkles className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No recommendations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
