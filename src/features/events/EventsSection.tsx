import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { useEvents } from "./useEvents";
import { EventGrid } from "./EventGrid";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { Badge } from "../../components/ui/badge";
import { ErrorState } from "../../components/ui/error";

import type { EventResponse } from "../../interface/Event.interface";

// --- Context ---
interface EventsSectionContextType {
  events: EventResponse[];
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
  const { data: events = [], isLoading, isError, error, refetch } = useEvents();

  return (
    <EventsSectionContext.Provider
      value={{ events, isLoading, isError, error: error ?? null, refetch, withinEventsSection: true }}
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
  const { events } = useEventsSectionContext("EventsSection.Header");

  return (
    <SectionHeader className={className ?? ""}>
      <SectionHeader.Content>
        <SectionHeader.Title>Upcoming Events</SectionHeader.Title>
        <SectionHeader.Description>
          Book your spot before they sell out
        </SectionHeader.Description>
      </SectionHeader.Content>

      <SectionHeader.Action>
        {events.length > 0 && (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {events.length} Events
          </Badge>
        )}
      </SectionHeader.Action>
    </SectionHeader>
  );
};

EventsSection.Grid = function EventsSectionGrid() {
  const { events, isLoading, isError, error, refetch } = useEventsSectionContext("EventsSection.Grid");

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Failed to load events. Please try again."}
        onRetry={refetch}
      />
    );
  }

  return <EventGrid events={events} isLoading={isLoading} />;
};
