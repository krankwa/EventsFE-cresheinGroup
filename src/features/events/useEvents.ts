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
    // Keep data fresh for 1 minute before checking for updates
    staleTime: 60000, 
    // Keep data in cache for 5 minutes even if not used
    gcTime: 1000 * 60 * 5,
    // Prevent React Query from aggressively retrying broken formatting 3 times
    retry: 1,
  });
}
