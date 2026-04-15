import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Ticket,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { eventsService } from "../../services/eventsService";
import { ticketsService } from "../../services/ticketsService";
import { useUser } from "../../features/authentication/useUser";
import type {
  EventResponse,
  TicketTierResponse,
} from "../../interface/Event.interface";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { toast } from "react-hot-toast";

// ─── Tier row ────────────────────────────────────────────────────────────────
function TierRow({
  tier,
  onBook,
  isBooking,
  disabled,
}: {
  tier: TicketTierResponse;
  onBook: (tierId: number) => void;
  isBooking: boolean;
  disabled: boolean;
}) {
  const soldOut = tier.availableTickets <= 0;
  const pct = Math.min((tier.ticketsSold / tier.capacity) * 100, 100);

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors
      ${soldOut ? "bg-muted/30 border-muted" : "bg-card hover:border-primary/40"}`}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{tier.name}</span>
          {soldOut ? (
            <Badge variant="destructive" className="text-[10px]">
              Sold Out
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">
              {tier.availableTickets} left
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            {soldOut ? (
              <XCircle className="w-3.5 h-3.5 text-destructive" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            )}
            {tier.ticketsSold} / {tier.capacity} sold
          </span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
        <span className="text-lg font-bold text-primary">
          ₱{tier.price.toLocaleString()}
        </span>
        <Button
          size="sm"
          variant={soldOut ? "outline" : "default"}
          disabled={soldOut || isBooking || disabled}
          onClick={() => onBook(tier.id)}
          className="w-full sm:w-auto gap-1.5"
        >
          {isBooking ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Booking...
            </>
          ) : soldOut ? (
            "Sold Out"
          ) : (
            <>
              <Ticket className="w-3.5 h-3.5" />
              Book
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function EventDetailSection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useUser();

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [bookingTierId, setBookingTierId] = useState<number | null>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    eventsService
      .getById(Number(id))
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  const scrollToTiers = () => {
    tiersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBook = async (tierId: number) => {
    if (!user) {
      toast.error("Please log in to book tickets.");
      navigate("/login");
      return;
    }
    if (isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    setBookingTierId(tierId);
    try {
      await ticketsService.register({ eventId: event!.id, tierId: tierId });
      toast.success(`Ticket booked for ${event!.title}!`);
      navigate("/tickets");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to book ticket.";
      toast.error(msg);
    } finally {
      setBookingTierId(null);
    }
  };

  // ── Loading ──
  if (isLoading)
    return (
      <div className="container mx-auto py-8 max-w-4xl space-y-6 px-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );

  // ── Not found ──
  if (notFound || !event)
    return (
      <div className="container mx-auto py-20 text-center px-4">
        <p className="text-2xl font-bold mb-2">Event not found</p>
        <p className="text-muted-foreground mb-6">
          This event may have been removed or doesn't exist.
        </p>
        <Button
          onClick={() => navigate("/events")}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Button>
      </div>
    );

  const isSoldOut = event.ticketsSold >= event.capacity;
  const pct = Math.min((event.ticketsSold / event.capacity) * 100, 100);
  const lowestPrice =
    event.tiers.length > 0
      ? Math.min(...event.tiers.map((t) => t.price))
      : null;

  return (
    <div className="container mx-auto py-8 max-w-4xl px-4 space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 text-muted-foreground"
        onClick={() => navigate("/events")}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Button>

      {/* Cover image */}
      <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-primary/10">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-20 h-20 text-primary/20" />
          </div>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge
              variant="destructive"
              className="px-6 py-2 text-base font-bold uppercase tracking-wider"
            >
              Sold Out
            </Badge>
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow">
            Upcoming
          </Badge>
          {lowestPrice !== null && (
            <Badge className="bg-primary text-primary-foreground shadow">
              From ₱{lowestPrice.toLocaleString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Title + meta */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {event.title}
          </h1>
          <Button
            size="lg"
            className="gap-2 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            disabled={isSoldOut}
            onClick={scrollToTiers}
          >
            <Ticket className="w-5 h-5" />
            {isSoldOut ? "Sold Out" : "Get Tickets"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {format(new Date(event.date), "PPPP")}
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">
                {event.venue || "TBA"}
              </span>
              <span className="text-muted-foreground">
                {event.venueAddress}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="rounded-xl border bg-card/50 p-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>
              {event.ticketsSold} / {event.capacity} attendees
            </span>
          </div>
          <span className="font-semibold text-primary">
            {Math.round(pct)}% full
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {event.availableTickets} tickets remaining
        </p>
      </div>

      {/* Ticket tiers */}
      {event.tiers.length > 0 && (
        <div className="space-y-3 scroll-mt-20" ref={tiersRef}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" /> Ticket Tiers
          </h2>
          {event.tiers.map((tier: TicketTierResponse) => (
            <TierRow
              key={tier.id}
              tier={tier}
              onBook={handleBook}
              isBooking={bookingTierId === tier.id}
              disabled={bookingTierId !== null && bookingTierId !== tier.id}
            />
          ))}
        </div>
      )}

      {event.tiers.length === 0 && (
        <div className="rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
          <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="font-medium">No ticket tiers available yet.</p>
          <p className="text-sm">Check back soon.</p>
        </div>
      )}
    </div>
  );
}
