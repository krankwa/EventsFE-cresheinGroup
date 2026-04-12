import { useQuery } from "@tanstack/react-query";
import { eventsService } from "../../services/eventsService";
import type { EventResponse } from "../../interface/Event.interface";

export function useEvents() {
  return useQuery<EventResponse[], Error>({
    queryKey: ["events"],
    queryFn: () => eventsService.getAll(),
  });
}
