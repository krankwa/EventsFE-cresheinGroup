import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  CalendarDays,
  Zap,
  Search,
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
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { eventsService } from "../../services/eventsService";
import { useUser } from "../../features/authentication/useUser";
import type { EventResponse } from "../../interface/Event.interface";
import { toast } from "react-hot-toast";
import { TicketBookingDialog } from "../../components/organisms/TicketBookingDialog";

// ─── Compact Event Card for Landing Page ────────────────────────────────────
function LandingEventCard({
  event,
  onBook,
  user,
  isListMode = false,
}: {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
  user: any;
  isListMode?: boolean;
}) {
  const capacity = event.capacity && event.capacity > 0 ? event.capacity : 1;
  const sold = event.ticketsSold || 0;
  const isSoldOut = sold >= capacity;
  const fillPct = Math.min((sold / capacity) * 100, 100);

  return (
    <Card className={`overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-muted/40 bg-card/60 backdrop-blur-sm ${isListMode ? "max-w-2xl mx-auto" : ""}`}>
      {/* Cover Image */}
      <div className={`relative ${isListMode ? "h-64" : "h-44"} overflow-hidden`}>
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow-lg text-xs">
            Upcoming
          </Badge>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
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
          <h3 className={`${isListMode ? "text-2xl" : "text-lg"} font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors`}>
            {event.title}
          </h3>
          <span className="text-primary font-bold text-lg whitespace-nowrap">
            ₱999+
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-0 space-y-2">
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span className="italic truncate">
            {format(new Date(event.date), "PPP")}
          </span>
        </div>
        <div className="flex items-start gap-2 text-base text-muted-foreground min-h-[40px]">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground leading-tight">
              {event.venue || "TBA"}
            </span>
            <span className="text-sm">
              {event.venueAddress}
            </span>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="pt-4 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4" />
            <span>
              {sold} / {capacity} tickets booked
            </span>
          </div>
          <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${fillPct > 90 ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-6">
        <Button
          className={`w-full gap-2 font-semibold group/btn ${isListMode ? "py-6 text-lg" : ""}`}
          variant={isSoldOut ? "outline" : "default"}
          disabled={isSoldOut}
          onClick={() => onBook(event)}
        >
          {isSoldOut ? (
            "Sold Out"
          ) : (
            <>
              {user ? "Book My Spot" : "Sign In to Book"}
              <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Landing Page ─────────
export function LandingSection() {
  const [allEvents, setAllEvents] = useState<EventResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();

  const handleBook = (event: EventResponse) => {
    if (!user) {
      toast("Please sign in to book tickets.", { icon: "🎟️" });
      navigate("/login");
      return;
    }
    if (isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    setSelectedEvent(event);
  };

  const filteredEvents = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    const filtered = term 
      ? allEvents.filter(e => 
          (e.title?.toLowerCase() || "").includes(term) || 
          (e.venue?.toLowerCase() || "").includes(term)
        )
      : allEvents;

    // Deduplicate by Title + Date + Venue to remove any "identical" redundancies
    const seen = new Set<string>();
    return filtered.filter(event => {
      const key = `${event.title}-${event.date}-${event.venue}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allEvents, searchTerm]);

  useEffect(() => {
    eventsService
      .getAll()
      .then((response) => {
        // Safe extraction for paginated or direct array responses
        if (Array.isArray(response)) {
          setAllEvents(response);
        } else if (response && typeof response === "object") {
          const res = response as any;
          setAllEvents(res.events || res.data || res.items || []);
        } else {
          setAllEvents([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setAllEvents([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4 bg-muted/5">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -ml-48 -mb-32 pointer-events-none" />

        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            Discover Live Events Near You
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
            Your Next{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Legendary
            </span>{" "}
            Night Out
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl mx-auto">
            Experience the best concerts, festivals, and exclusive gatherings.
            Find your perfect match below.
          </p>

          <div className="flex flex-col gap-8 max-w-xl mx-auto">
            {/* Search Box in Hero */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-card rounded-xl border border-border/50 shadow-2xl p-2">
                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Seach by artist, event, or city..." 
                  className="border-none bg-transparent focus-visible:ring-0 text-lg h-12 shadow-none placeholder:text-muted-foreground/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  size="lg" 
                  className="hidden sm:flex rounded-lg px-8 mr-1 transition-all"
                  onClick={() => {
                    document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Find Now
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="link"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => {
                  document
                    .getElementById("events-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Or Browse All Upcoming Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events Grid ── */}
      <section id="events-section" className="container mx-auto px-4 pb-24 scroll-mt-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {isSearchActive ? "Search Results" : "Upcoming Events"}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {isSearchActive 
                ? `Showing ${filteredEvents.length} matches for "${searchTerm}"`
                : "Book your spot before they sell out"}
            </p>
          </div>
          {filteredEvents.length > 0 && (
            <Badge variant="secondary" className="text-sm px-4 py-1.5 rounded-full font-bold">
              {filteredEvents.length} Events
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-32 text-center text-muted-foreground border-2 border-dashed rounded-[2.5rem] bg-muted/5">
            <CalendarDays className="w-16 h-16 mx-auto mb-6 opacity-20" />
            <p className="text-2xl font-bold text-foreground">No matches found</p>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              We couldn't find any events matching your search. Try a different term or browse our full schedule.
            </p>
            <Button 
              variant="outline" 
              className="mt-8 px-8"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className={`grid gap-10 ${isSearchActive ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {filteredEvents.map((event) => (
              <LandingEventCard
                key={event.Id}
                event={event}
                onBook={handleBook}
                user={user}
                isListMode={isSearchActive}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-muted/20 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 EventTix — The Premier Event Management Platform
          </p>
        </div>
      </footer>
      <TicketBookingDialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onSuccess={() => navigate("/tickets")}
      />
    </>
  );
}
