import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { useEvents } from "./useEvents";
import { EventGrid } from "./EventGrid";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { Badge } from "../../components/ui/badge";
import { ErrorState } from "../../components/ui/error";

import type {
  //EventResponse,
  EventsFeedResponse,
  EventRecommendResponse,
} from "../../interface/Event.interface";

// --- Context ---
interface EventsSectionContextType {
  data: EventsFeedResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  withinEventsSection: boolean;
}

const EventsSectionContext = createContext<EventsSectionContextType | null>(
  null,
);

function useEventsSectionContext(componentName: string) {
  const context = useContext(EventsSectionContext);
  if (!context) {
    throw new Error(`${componentName} must be used within <EventsSection>`);
  }
  return context;
}

// --- Styled Components ---
const StyledSection = styled.section.attrs<{ className?: string }>(
  ({ className }) => ({
    className: `container mx-auto px-4 pb-24 ${className || ""}`.trim(),
  }),
)``;

interface EventsSectionProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

// --- Compound Components ---
export function EventsSection({ children, id, className }: EventsSectionProps) {
  const { data, isLoading, isError, error, refetch } = useEvents();

  // FIX: Force to an array. If API returns null, this prevents the white screen.
  //const safeEvents = Array.isArray(data) ? data : [];

  return (
    <EventsSectionContext.Provider
      value={{
        data,
        isLoading,
        isError,
        error: error ?? null,
        refetch,
        withinEventsSection: true,
      }}
    >
      <StyledSection id={id ?? ""} className={className ?? ""}>
        {children}
      </StyledSection>
    </EventsSectionContext.Provider>
  );
}

EventsSection.Header = function EventsSectionHeader({
  className,
}: {
  className?: string;
}) {
  const { data } = useEventsSectionContext("EventsSection.Header");

  // Calculate safe length based on the payload type
  let eventCount = 0;
  if (Array.isArray(data)) {
    eventCount = data.length;
  } else if (data) {
    eventCount =
      (data.recommended?.length || 0) +
      (data.popular?.length || 0) +
      (data.allOthers?.length || 0);
  }

  return (
    <SectionHeader className={className ?? ""}>
      <SectionHeader.Content>
        <SectionHeader.Title>Upcoming Events</SectionHeader.Title>
        <SectionHeader.Description>
          Book your spot before they sell out
        </SectionHeader.Description>
      </SectionHeader.Content>

      <SectionHeader.Action>
        {eventCount > 0 && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {eventCount} Events
          </Badge>
        )}
      </SectionHeader.Action>
    </SectionHeader>
  );
};

EventsSection.Grid = function EventsSectionGrid() {
  const { data, isLoading, isError, error, refetch } =
    useEventsSectionContext("EventsSection.Grid");

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Failed to load events. Please try again."}
        onRetry={refetch}
      />
    );
  }
  //unauthenticated scenario
  // standard array
  if (Array.isArray(data)) {
    return <EventGrid events={data} isLoading={isLoading} />;
  }

  //authenticated scenario
  //an object with Recommended, Popular, AllOthers
  if (data && !Array.isArray(data)) {
    const { recommended, popular, allOthers } = data as EventRecommendResponse;
    const topRecommended = recommended?.slice(0, 6) || [];
    const topPopular = popular?.slice(0, 6) || [];
    const hasRecommendations = topRecommended.length > 0;
    const hasPopular = topPopular.length > 0;

    return (
      <div className="flex flex-col gap-12">
        {hasRecommendations && (
          <div id="recommended-section">
            <h3 className="text-2xl font-bold mb-4">Recommended For You</h3>
            <EventGrid events={topRecommended} isLoading={isLoading} />
          </div>
        )}

        {hasPopular && (
          <div id="popular-section">
            <h3 className="text-2xl font-bold mb-4">Popular Right Now</h3>
            <EventGrid events={topPopular} isLoading={isLoading} />
          </div>
        )}

        <div id="all-events-section">
          <h3 className="text-2xl font-bold mb-4">More Events</h3>
          <EventGrid events={allOthers} isLoading={isLoading} />
        </div>
      </div>
    );
  }
  return <EventGrid events={[]} isLoading={isLoading} />;
};
