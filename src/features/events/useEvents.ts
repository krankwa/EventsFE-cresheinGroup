import { useQuery } from "@tanstack/react-query";
import { eventsService } from "../../services/eventsService";
import type { EventResponse } from "../../interface/Event.interface";

export function useEvents() {
  return useQuery<EventResponse[], Error>({
    queryKey: ["events"],
    queryFn: async (): Promise<EventResponse[]> => {
      const response = await eventsService.getAll();

      if (Array.isArray(response)) {
        return response as EventResponse[];
      }

      if (response && typeof response === "object") {
        const safeResponse = response as Record<string, unknown>;
        if (Array.isArray(safeResponse.events))
          return safeResponse.events as EventResponse[];
        if (Array.isArray(safeResponse.data))
          return safeResponse.data as EventResponse[];
        if (Array.isArray(safeResponse.items))
          return safeResponse.items as EventResponse[];
      }

      // If we reach this line, the server sent us junk data.
      // Throwing this error triggers your UI <ErrorState /> component!
      throw new Error("Invalid data format received from the server.");
    },
    // Optional: Prevent React Query from aggressively retrying broken formatting 3 times
    retry: 1,
  });
}
