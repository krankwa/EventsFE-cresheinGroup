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
  isRecommended = false,
}: {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
  isLoggedIn: boolean;
  isRecommended?: boolean;
}) {
  const capacity = event.capacity && event.capacity > 0 ? event.capacity : 1;
  const sold = event.ticketsSold || 0;
  const isSoldOut = sold >= capacity;
  const fillPct = Math.min((sold / capacity) * 100, 100);

  return (
    <Card className={`overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-white/40 backdrop-blur-md ring-1 ring-blue-950/5 ${isRecommended ? 'min-w-[280px] md:min-w-[340px]' : ''}`}>
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-950/20 to-blue-950/5 flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-blue-950/20" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isRecommended && (
            <Badge className="bg-blue-600 text-white border-none shadow-lg text-[10px] uppercase tracking-widest font-bold py-1 px-2 animate-pulse">
              ✨ For You
            </Badge>
          )}
          <Badge className="bg-white/90 backdrop-blur-md text-blue-950 border-none shadow-sm text-[10px] uppercase tracking-widest font-bold py-1 px-2">
            Upcoming
          </Badge>
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <Badge
              variant="destructive"
              className="px-6 py-2 text-xs font-black uppercase tracking-[0.2em]"
            >
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <span className="text-blue-900 font-black text-base whitespace-nowrap">
            ₱999+
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-2 space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="p-1.5 rounded-full bg-blue-50">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          </div>
          <span className="font-medium tracking-tight">
            {format(new Date(event.date), "MMMM d, yyyy")}
          </span>
        </div>
        
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.venueAddress}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 text-sm text-gray-500 hover:text-blue-700 transition-colors group/map"
        >
          <div className="p-1.5 rounded-full bg-blue-50 group-hover/map:bg-blue-100 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover/map:animate-bounce" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 leading-tight">
              {event.venue || "TBA"}
            </span>
            <span className="text-xs text-gray-400 line-clamp-1 mt-0.5">
              {event.venueAddress}
            </span>
          </div>
        </a>

        {/* Capacity bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              {sold} / {capacity} ATTENDEES
            </span>
            <span>{Math.round(fillPct)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${fillPct > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4">
        <Button
          className={`w-full py-6 gap-3 font-bold uppercase tracking-[0.1em] text-xs transition-all duration-300 group/btn rounded-xl ${isSoldOut ? 'bg-gray-100 text-gray-400 hover:bg-gray-100' : 'bg-blue-950 hover:bg-blue-900 text-white shadow-lg shadow-blue-950/20 hover:shadow-blue-950/30 active:scale-[0.98]'}`}
          disabled={isSoldOut}
          onClick={() => onBook(event)}
        >
          {isSoldOut ? (
            "Fully Booked"
          ) : !isLoggedIn ? (
            <>
              Explore Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
            </>
          ) : (
            <>
              Reserve Seat
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
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

  // Logic: Everyone gets the recommender section.
  const categorized = !Array.isArray(eventsResult)
    ? (eventsResult as EventRecommendResponse)
    : null;
    
  // Authenticated vs Guest title phrasing
  const recTitle = user ? "Recommended For You" : "Trending Events";
  const recDescription = user ? "Personalized based on your interests" : "What everyone is booking right now";

  const recommended = categorized?.recommended || [];
  const popular = categorized?.popular || [];
  const allOthers = categorized?.allOthers || [];

  // Union of regular events (De-duplicated)
  const regularEvents = Array.isArray(eventsResult)
    ? eventsResult
    : [...popular, ...allOthers];

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              ✨ Discover Your Next Experience
            </Badge>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-gray-900 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              THE WORLD'S<br />
              <span className="text-blue-600">LIVE EVENTS</span><br />
              HUB.
            </h1>

            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Experience the best concerts, workshops, and gatherings around the world. Secure your spot in just a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
              <Button
                size="lg"
                className="text-base px-12 py-8 font-black uppercase tracking-widest gap-4 shadow-2xl shadow-blue-900/10 hover:shadow-blue-900/20 transition-all bg-blue-950 hover:bg-black text-white rounded-2xl group"
                onClick={() => {
                  document
                    .getElementById("explore-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start Exploring
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recommended Section (Always visible) ── */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mb-12">
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              {recTitle}
            </h2>
            <p className="text-gray-500 font-medium text-lg mt-2">
              {recDescription}
            </p>
          </div>

          {isLoading ? (
             <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[340px] space-y-4 bg-white/50 p-6 rounded-3xl border border-gray-100">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-12 w-full rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : recommended.length === 0 ? (
            <div className="py-20 text-center bg-white/50 backdrop-blur-sm rounded-[40px] border border-blue-950/5 border-dashed">
                <Users className="w-12 h-12 mx-auto mb-4 text-blue-950/20" />
                <p className="text-xl font-bold text-gray-400">Loading your highlights...</p>
            </div>
          ) : (
            <div className="flex gap-8 overflow-x-auto pb-12 px-2 -mx-2 scrollbar-hide snap-x">
              {recommended.map((event: EventResponse) => (
                <div key={event.id} className="snap-start shrink-0">
                  <LandingEventCard
                    event={event}
                    onBook={handleBook}
                    isLoggedIn={!!user}
                    isRecommended={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── All Events Grid ── */}
      <section
        id="explore-section"
        className="container mx-auto px-4 pb-32"
      >
        <div className="flex items-center justify-between mb-16 px-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              Explore All Events
            </h2>
            <p className="text-gray-500 font-medium mt-2">
              Browse the catalog and secure your future memories
            </p>
          </div>
          {regularEvents.length > 0 && (
            <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
                <span className="text-blue-600 font-black text-xl">{regularEvents.length}</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-3">Total Live</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : regularEvents.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[50px] shadow-sm border border-gray-100">
            <CalendarDays className="w-16 h-16 mx-auto mb-6 text-gray-200" />
            <p className="text-2xl font-black text-gray-900 tracking-tight">STAY TUNED.</p>
            <p className="text-gray-400 font-medium mt-2 max-w-xs mx-auto">
              We're curating more incredible experiences for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {regularEvents.map((event: EventResponse) => (
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
      <footer className="py-20 bg-blue-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tighter mb-4">EventTix<span className="text-blue-500">.</span></h2>
              <p className="text-gray-400 font-medium max-w-sm">
                The premier platform for managing and attending global experiences.
              </p>
            </div>
            <div className="flex gap-8 items-center border-t border-white/10 pt-8 w-full justify-center md:border-none md:pt-0 md:justify-end">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                © 2026 EVENTTIX GROUP
              </p>
            </div>
          </div>
        </div>
      </footer>

      <TicketBookingDialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        isLoggedIn={!!user}
        onSuccess={() => navigate("/tickets")}
      />
    </div>
  );
}

