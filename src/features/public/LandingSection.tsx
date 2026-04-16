import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Ticket,
  CalendarDays,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useEvents } from "../../features/events/useEvents";
import { useUser } from "../../features/authentication/useUser";
import type {
  EventResponse,
  EventRecommendResponse,
} from "../../interface/Event.interface";
import { toast } from "react-hot-toast";
import { TicketBookingDialog } from "../../components/organisms/TicketBookingDialog";

// ─── Compact Event Card for Landing Page ────────────────────────────────────
function LandingEventCard({
  event,
  onBook,
  isLoggedIn,
}: {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
  isLoggedIn: boolean;
}) {
  const capacity = event.capacity && event.capacity > 0 ? event.capacity : 1;
  const sold = event.ticketsSold || 0;
  const isSoldOut = sold >= capacity;
  const fillPct = Math.min((sold / capacity) * 100, 100);

  return (
    <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-blue-950/20 bg-white/60 backdrop-blur-sm">
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-950/20 to-blue-950/5 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-blue-950/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-blue-950/80 backdrop-blur-md text-white border-none shadow-lg text-xs">
            Upcoming
          </Badge>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge
              variant="destructive"
              className="px-4 py-1 text-sm font-bold uppercase tracking-wider"
            >
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-blue-950 transition-colors">
            {event.title}
          </h3>
          <span className="text-blue-950 font-bold text-sm whitespace-nowrap">
            ₱999+
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-0 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-blue-950 shrink-0" />
          <span className="italic truncate">
            {format(new Date(event.date), "PPP")}
          </span>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.venueAddress}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 text-sm text-muted-foreground min-h-[40px] hover:text-primary transition-colors group/map"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-950 shrink-0 mt-0.5 group-hover/map:animate-bounce" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground leading-tight">
              {event.venue || "TBA"}
            </span>
            <span className="text-[11px] line-clamp-1">
              {event.venueAddress}
            </span>
          </div>
        </a>

        {/* Capacity bar */}
        <div className="pt-3 border-t border-blue-950/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <span>
              {sold} / {capacity}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-950 transition-all duration-1000 rounded-full"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-4">
        <Button
          className="w-full gap-2 font-semibold group/btn bg-blue-950 hover:bg-blue-900 text-white"
          variant={isSoldOut ? "outline" : "default"}
          disabled={isSoldOut}
          onClick={() => onBook(event)}
        >
          {isSoldOut ? (
            "Sold Out"
          ) : !isLoggedIn ? (
            <>
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </>
          ) : (
            <>
              Book Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Landing Page ─────────
export function LandingSection() {
  const { data: eventsResult = [], isLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();

  const handleBook = (event: EventResponse) => {
    if (user && isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    setSelectedEvent(event);
  };

  // Extract events from potentially categorized response
  // FOR LANDING PAGE: Only show 'Popular' events if categorized data exists
  const categorized = !Array.isArray(eventsResult)
    ? (eventsResult as EventRecommendResponse)
    : null;
  const popular = (categorized?.popular ?? []) as EventResponse[];

  const events = Array.isArray(eventsResult)
    ? eventsResult
    : popular.length > 0
      ? popular
      : [];

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-950/5 rounded-full blur-[120px] -mr-64 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-950/5 rounded-full blur-[100px] -ml-48 -mb-32 pointer-events-none" />

        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/10 border border-blue-950/20 text-blue-950 text-sm font-medium mb-6 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            Discover Live Events Near You
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            Your Next{" "}
            <span className="bg-gradient-to-r from-blue-950 to-blue-800 bg-clip-text text-transparent">
              Unforgettable
            </span>{" "}
            Experience Awaits
          </h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto">
            Browse hundreds of events — concerts, conferences, sports, and more.
            Secure your tickets in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-7 font-bold gap-3 shadow-xl shadow-blue-950/20 hover:scale-105 transition-all bg-blue-950 hover:bg-blue-900 text-white rounded-full group"
              onClick={() => {
                document
                  .getElementById("events-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Ticket className="w-6 h-6" />
              Get Tickets
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Events Grid ── */}
      <section
        id="events-section"
        className="container mx-auto px-4 pb-24 bg-white"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Upcoming Events
            </h2>
            <p className="text-gray-600 mt-1">
              Book your spot before they sell out
            </p>
          </div>
          {events.length > 0 && (
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 bg-blue-950 text-white"
            >
              {events.length} Events
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-24 text-center text-gray-500 border-2 border-dashed rounded-3xl border-blue-950/20">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-medium">No events yet</p>
            <p className="text-sm mt-1">
              Check back soon for exciting upcoming events!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: EventResponse) => (
              <LandingEventCard
                key={event.id}
                event={event}
                onBook={handleBook}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-blue-950/20 bg-blue-950 text-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-white/80 font-medium">
            © 2026 EventTix — The Premier Event Management Platform
          </p>
        </div>
      </footer>
      <TicketBookingDialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        isLoggedIn={!!user}
        onSuccess={() => navigate("/tickets")}
      />
    </>
  );
}
