import { useEffect, useState } from "react";
import { eventsService } from "../../api/eventsService";
import type { EventResponse } from "../../types/Event.types";
import { EventCard } from "../molecules/EventCard";
import { Skeleton } from "../ui/skeleton";

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.eventID} event={event} />
      ))}
      {events.length === 0 && (
        <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
          <p className="text-xl font-medium">No events found</p>
          <p className="text-sm">Check back later for exciting new events!</p>
        </div>
      )}
    </div>
  );
}
