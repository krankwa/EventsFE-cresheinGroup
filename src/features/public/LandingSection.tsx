import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";
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

// Decoupled Components
import { LandingEventCard } from "./components/LandingEventCard";
import { EventBillboard } from "./components/EventBillboard";

// ─── Landing Page ─────────
export function LandingSection() {
  const { data: eventsResult = [], isLoading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBook = (event: EventResponse) => {
    if (user && isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    setSelectedEvent(event);
  };

  // Data Deduplication Logic
  const categorized = !Array.isArray(eventsResult)
    ? (eventsResult as EventRecommendResponse)
    : null;

  const rawRecommended = categorized?.recommended || [];
  const popular = categorized?.popular || [];
  const allOthers = categorized?.allOthers || [];

  // 1. Featured Billboard (Top Recommended)
  const billboardEvent = rawRecommended[0] || popular[0];
  
  // 2. Personal Recommendations (Excluding Billboard)
  const recItems = rawRecommended.filter(e => e.id !== billboardEvent?.id);
  const recIds = new Set([billboardEvent?.id, ...recItems.map(e => e.id)]);

  // 3. Explore All (Excluding everything above)
  const regularEvents = Array.isArray(eventsResult)
    ? eventsResult
    : [...popular, ...allOthers].filter(e => !recIds.has(e.id));

  // Authenticated vs Guest title phrasing
  const recTitle = user ? "Trending Highlights" : "Curated Experience";
  const recDescription = user ? "Based on your unique profile" : "The most anticipated events this season";

  return (
    <div className="bg-[#fcfcfd] min-h-screen">
      {/* ── Hero Section with Mesh Gradient ── */}
      <section className="relative overflow-hidden pt-20 md:pt-32 pb-36 md:pb-48 px-4 mesh-gradient">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full shadow-2xl shadow-blue-950/5 mb-10 border border-white/50 animate-reveal">
              <Badge className="bg-blue-600 text-white border-none text-[10px] font-black uppercase tracking-[0.2em] py-1 px-3">
                Live
              </Badge>
              <span className="text-blue-950 text-xs font-bold tracking-tight">500+ Experiences across the globe</span>
              <div className="flex -space-x-2 ml-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-blue-100" />)}
              </div>
            </div>

            <h1 className="text-5xl xs:text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-10 text-gray-900 animate-reveal" style={{ animationDelay: '0.1s' }}>
              THE ART OF<br />
              <span className="text-blue-600 inline-block hover:scale-105 transition-transform cursor-default">GATHERING.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500/80 mb-12 leading-relaxed max-w-2xl mx-auto font-medium animate-reveal" style={{ animationDelay: '0.2s' }}>
              From secret jazz clubs to global tech summits. Discover, secure, and experience the world’s most exclusive moments.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-reveal" style={{ animationDelay: '0.3s' }}>
              <Button
                size="lg"
                className="text-base px-16 py-9 font-black uppercase tracking-widest gap-4 shadow-2xl shadow-blue-950/20 transition-all bg-blue-950 hover:bg-black text-white rounded-[2rem] group"
                onClick={() => {
                  document
                    .getElementById("explore-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explorer Library
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </section>

      {/* ── Spotlight Component ── */}
      <section className="relative -mt-28 md:-mt-36 px-4 z-20">
        <div className="container mx-auto">
           {billboardEvent && (
             <EventBillboard 
                event={billboardEvent}
                onBook={handleBook}
                isLoggedIn={!!user}
             />
           )}
        </div>
      </section>

      <section className="py-16 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase">
              {recTitle}
            </h2>
            <p className="text-gray-500 font-medium text-lg md:text-xl mt-4">
              {recDescription}
            </p>
          </div>

          {isLoading ? (
             <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[280px] md:min-w-[340px] space-y-4 bg-white/50 p-5 md:p-6 rounded-3xl border border-gray-100">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
              ))}
            </div>
          ) : recItems.length === 0 ? (
            <div className="py-24 text-center glass-premium rounded-[40px] border-dashed">
                <Users className="w-16 h-16 mx-auto mb-6 text-blue-950/20 animate-bounce" />
                <p className="text-2xl font-black text-gray-400 tracking-tight uppercase">Your curated feed is being prepared.</p>
            </div>
          ) : (
            <div className="relative group/gallery">
              {/* Navigation Arrows (Desktop Only) */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 
                           hidden md:flex items-center justify-center w-12 h-12 
                           rounded-full bg-white/10 backdrop-blur-xl border border-white/20 
                           text-blue-950 shadow-2xl transition-all opacity-0 group-hover/gallery:opacity-100
                           hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 
                           hidden md:flex items-center justify-center w-12 h-12 
                           rounded-full bg-white/10 backdrop-blur-xl border border-white/20 
                           text-blue-950 shadow-2xl transition-all opacity-0 group-hover/gallery:opacity-100
                           hover:bg-white hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div 
                ref={scrollRef}
                className="flex gap-6 md:gap-10 overflow-x-auto pb-16 px-4 -mx-4 scrollbar-hide snap-x"
              >
                {recItems.map((event: EventResponse) => (
                  <div key={event.id} className="snap-start">
                    <LandingEventCard
                      event={event}
                      onBook={handleBook}
                      isLoggedIn={!!user}
                      isRecommended={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── All Events Grid ── */}
      <section
        id="explore-section"
        className="container mx-auto px-4 pb-20 md:pb-32"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-16 gap-6 px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Explore All Events
            </h2>
            <p className="text-base md:text-gray-500 font-medium mt-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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

