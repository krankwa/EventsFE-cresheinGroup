import { useState, useEffect } from "react";
import { eventsService } from "../../services/eventsService";
import type { EventResponse } from "../../interface/Event.interface";

export function useEvents() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventsService
      .getAll()
      .then(setEvents)
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return { events, isLoading };
}
