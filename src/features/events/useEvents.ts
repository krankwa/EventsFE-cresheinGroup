import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { eventsService } from "../../services/eventsService";
import type { EventsFeedResponse } from "../../interface/Event.interface";
import type { PaginationParams } from "../../interface/pagination";

export function useEvents() {
  return useQuery<EventsFeedResponse, Error>({
    queryKey: ["events"],
    queryFn: async (): Promise<EventsFeedResponse> => {
      const response = await eventsService.getAll();
      // Handle both flat array and categorized object, being resilient to casing
      if (Array.isArray(response)) return response;

      if (response && typeof response === "object") {
        const hasRecommended =
          "recommended" in response || "Recommended" in response;
        if (hasRecommended) return response;
      }

      throw new Error("Invalid data format received from the server.");
    },
    retry: 1,
  });
}

export function usePaginatedEvents(params: PaginationParams) {
  return useQuery({
    queryKey: ["events", "paginated", params],
    queryFn: () => eventsService.getPaginated(params),
    placeholderData: keepPreviousData,
  });
}
