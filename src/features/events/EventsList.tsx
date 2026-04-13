import { useEvents } from "./useEvents";
import { EventGrid } from "./EventGrid";
import { ErrorState } from "../../components/ui/error";

export function EventsList() {
  const { data: events, isLoading, isError, error, refetch } = useEvents();

  if (isError) {
    return (
      <ErrorState
        message={`Error loading events: ${error instanceof Error ? error.message : "Unknown error"}`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <EventGrid events={events || []} isLoading={isLoading} />
    </div>
  );
}
