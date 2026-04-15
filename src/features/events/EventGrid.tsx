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
  const isSoldOut = event.ticketsSold >= event.capacity;

  return (
    <EventCard className="group">
      <EventCard.Image
        imageUrl={event.coverImageUrl}
        title={event.title}
        isSoldOut={isSoldOut}
      />
      <EventCard.Details event={event} />
      <EventCard.Action
        isSoldOut={isSoldOut}
        isBooking={false}
        onBook={() => onBook(event)}
      />
    </EventCard>
  );
}

interface EventGridProps {
  events: EventResponse[];
  isLoading: boolean;
}

export function EventGrid({ events, isLoading }: EventGridProps) {
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

  if (events.length === 0) {
    return (
      <NotFound>
        <p className="text-xl font-medium">No events found</p>
        <p className="text-sm">Check back later for exciting new events!</p>
      </NotFound>
    );
  }

  return (
    <>
      <LoadingGridContainer>
        {events.map((event) => (
          <EventGridItem key={event.Id} event={event} onBook={handleBook} />
        ))}
      </LoadingGridContainer>

      <TicketBookingDialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onSuccess={() => navigate("/tickets")}
      />
    </>
  );
}
