import { useQuery } from "@tanstack/react-query";
import { eventsService } from "../../services/eventsService";
import type { EventsFeedResponse } from "../../interface/Event.interface";

export function useEvents() {
  return useQuery<EventsFeedResponse, Error>({
    queryKey: ["events"],
    queryFn: async (): Promise<EventsFeedResponse> => {
      // 1. Fetch data from backend
      const response = await eventsService.getAll();

      // 2. Unauthenticated Scenario: The API responds with a raw array
      if (Array.isArray(response)) {
        return response;
      }

      // 3. Authenticated Scenario: The API responds with categorized object
      if (
        response &&
        typeof response === "object" &&
        "recommended" in response &&
        "popular" in response &&
        "allOthers" in response
      ) {
        return response; // Return the new categorized data seamlessly
      }

      // Fallback: This correctly catches 500s or unexpected model changes
      throw new Error("Invalid data format received from the server.");
    },
    // Optional: Prevent React Query from aggressively retrying broken formatting 3 times
    retry: 1,
  });
}
