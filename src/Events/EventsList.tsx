import { useEffect, useState } from "react";
import { eventsService } from "../api/eventsService";
import type { EventResponse } from "../types/Event.types";

export function EventsList() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventsService
      .getAll()
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading events...</p>;
  console.log(events);
  return (
    <div>
      {events.map((event) => (
        <p key={event.eventID}>
          {event.title} - {event.venue}
        </p>
      ))}
    </div>
  );
}
