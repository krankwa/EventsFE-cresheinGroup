import type { EventResponse } from "../../interface/Event.interface";
import { EventCard } from "./EventCard/EventCard";
import { Loading, LoadingGridContainer } from "../../components/molecules/Loading";
import { NotFound } from "../../components/molecules/NotFound";
import { useBookTicket } from "../tickets/useBookTicket";

function EventGridItem({ event }: { event: EventResponse }) {
  const { isBooking, handleBook } = useBookTicket(event);
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
        isBooking={isBooking}
        onBook={handleBook}
      />
    </EventCard>
  );
}

interface EventGridProps {
  events: EventResponse[];
  isLoading: boolean;
}

export function EventGrid({ events, isLoading }: EventGridProps) {
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
    <LoadingGridContainer>
      {events.map((event) => (
        <EventGridItem key={event.eventID} event={event} />
      ))}
    </LoadingGridContainer>
  );
}
