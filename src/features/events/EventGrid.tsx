import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { EventResponse } from "../../interface/Event.interface";
import { EventCard } from "./EventCard/EventCard";
import {
  Loading,
  LoadingGridContainer,
} from "../../components/molecules/Loading";
import { NotFound } from "../../components/molecules/NotFound";
import { TicketBookingDialog } from "../../components/organisms/TicketBookingDialog";
import { useUser } from "../authentication/useUser";

function EventGridItem({
  event,
  onBook,
}: {
  event: EventResponse;
  onBook: (event: EventResponse) => void;
}) {
  // Safely calculate capacity to prevent NaN math errors
  const capacity = event.capacity && event.capacity > 0 ? event.capacity : 1;
  const sold = event.ticketsSold || 0;
  const isSoldOut = sold >= capacity;

  return (
    <EventCard className="group">
      <EventCard.Image
        imageUrl={event.coverImageUrl}
        title={event.title || "Untitled Event"}
        isSoldOut={isSoldOut}
      />
      <EventCard.Details event={event} />
      <EventCard.Action
        isSoldOut={isSoldOut}
        isBooking={false}
        onBook={() => onBook(event)}
        hasNoTiers={!event.tiers || event.tiers.length === 0}
      />
    </EventCard>
  );
}

interface EventGridProps {
  events: EventResponse[];
  isLoading: boolean;
  isListMode?: boolean;
}

export function EventGrid({ events, isLoading, isListMode = false }: EventGridProps) {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );

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

  if (isLoading) {
    return <Loading count={6} />;
  }

  // Force to array to prevent .map crashes
  const safeEvents = Array.isArray(events) ? events : [];

  if (safeEvents.length === 0) {
    return (
      <NotFound>
        <p className="text-xl font-medium">No events found</p>
        <p className="text-sm">Check back later for exciting new events!</p>
      </NotFound>
    );
  }

  return (
    <>
      <LoadingGridContainer className={isListMode ? "grid-cols-1 max-w-4xl mx-auto gap-10" : ""}>
        {safeEvents.map((event) => {
          if (!event) return null;
          // Use id (lowercase) from EventResponse interface
          const uniqueKey = event.id || `ev-${event.title || "un"}-${event.date || "un"}`;

          return (
            <div key={uniqueKey} className={isListMode ? "w-full" : ""}>
              <EventGridItem event={event} onBook={handleBook} />
            </div>
          );
        })}
      </LoadingGridContainer>

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
