import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/apiEvents";

export function useEvents() {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return { events: events ?? [], isLoading, error };
}
