import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { useEvents, usePaginatedEvents } from "./useEvents";
import { EventGrid } from "./EventGrid";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { Badge } from "../../components/ui/badge";
import { ErrorState } from "../../components/ui/error";
import { PaginationWrapper } from "../../components/organisms/PaginationWrapper";

import type { EventRecommendResponse, EventResponse } from "../../interface/Event.interface";

// --- Context ---
interface EventsSectionContextType {
  data: EventResponse[] | EventRecommendResponse | null; // Can be categorized or array
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  withinEventsSection: boolean;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
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

// --- Internal Components ---

function EventsSectionHeader({ className }: { className?: string }) {
  const { data } = useEventsSectionContext("EventsSection.Header");

  // Calculate unique event count
  let uniqueCount = 0;
  if (Array.isArray(data)) {
    uniqueCount = data.length;
  } else if (data) {
    const allEvents = [
      ...(data.recommended || []),
      ...(data.popular || []),
      ...(data.allOthers || []),
    ];
    uniqueCount = new Set(allEvents.map((e) => e.id)).size;
  }

  return (
    <SectionHeader className="p-5">
      <SectionHeader.Content >
        <SectionHeader.Title>Upcoming Events</SectionHeader.Title>
        <SectionHeader.Description>
          Book your spot before they sell out
        </SectionHeader.Description>
      </SectionHeader.Content >

      <SectionHeader.Action>
        {uniqueCount > 0 && (
          <Badge
            variant="secondary"
            className="text-sm px-3 py-1 bg-blue-950 text-white"
          >
            {uniqueCount} {uniqueCount === 1 ? "Event" : "Events"}
          </Badge>
        )}
      </SectionHeader.Action>
    </SectionHeader>
  );
}

function EventsSectionGrid() {
  const {
    data,
    isLoading,
    isError,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useEventsSectionContext("EventsSection.Grid");

  const { data: paginatedData, isLoading: isPaginatedLoading } =
    usePaginatedEvents({
      pageNumber: page,
      pageSize: pageSize,
    });

  if (isError) {
    return (
      <ErrorState
        message={
          error?.message ??
          "We encountered a minor disturbance while fetching your events. Please try again."
        }
      />
    );
  }

  // Unauthenticated Scenario: The API responds with a raw array
  if (Array.isArray(data)) {
    return (
      <div className="space-y-12">
        <EventGrid
          events={paginatedData?.items || []}
          isLoading={isPaginatedLoading || isLoading}
        />
        {paginatedData && (
          <PaginationWrapper
            currentPage={page}
            totalPages={paginatedData.totalPages}
            pageSize={pageSize}
            totalItems={paginatedData.totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    );
  }

  // Authenticated Scenario: The API responds with Categorized structure
  if (data && !Array.isArray(data)) {
    const renderedIds = new Set<string>();

    // 1. Process Recommended
    const categorized = !Array.isArray(data) ? (data as EventRecommendResponse) : null;
    const recommended = (categorized?.recommended ?? categorized?.Recommended ?? []) as EventResponse[];
    const topRecommended = recommended.slice(0, 6);
    
    // Store IDs as strings for reliable comparison
    topRecommended.forEach((e: EventResponse) => {
      if (e && e.id) renderedIds.add(String(e.id));
    });

    // 2. Process More Events (strictly deduplicate against Recommended)
    const filteredPaginated = (paginatedData?.items || []).filter(
      (e: EventResponse) => !renderedIds.has(String(e.id)),
    );

    const hasRecommendations = topRecommended.length > 0;

    return (
      <div className="flex flex-col gap-12">
        {hasRecommendations && (
          <div id="recommended-section">
            <h3 className="text-2xl font-bold mb-4">Recommended For You</h3>
            <EventGrid events={topRecommended} isLoading={isLoading} />
          </div>
        )}

        <div id="all-events-section" className="space-y-6">
          <h3 className="text-2xl font-bold">More Events</h3>
          <EventGrid
            events={filteredPaginated}
            isLoading={isPaginatedLoading}
          />
          {paginatedData && (
            <PaginationWrapper
              currentPage={page}
              totalPages={paginatedData.totalPages}
              pageSize={pageSize}
              totalItems={paginatedData.totalCount}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      </div>
    );
  }
  return <EventGrid events={[]} isLoading={isLoading} />;
}

// --- Main Component ---

interface EventsSectionComponent extends React.FC<EventsSectionProps> {
  Header: typeof EventsSectionHeader;
  Grid: typeof EventsSectionGrid;
}

export const EventsSection: EventsSectionComponent = ({
  children,
  id,
  className,
}: EventsSectionProps) => {
  const { data, isLoading, isError, error, refetch } = useEvents();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  return (
    <EventsSectionContext.Provider
      value={{
        data: data ?? null,
        isLoading,
        isError,
        error: error ?? null,
        refetch,
        withinEventsSection: true,
        page,
        setPage,
        pageSize,
        setPageSize,
      }}
    >
      <StyledSection id={id ?? ""} className={className ?? ""}>
        {children}
      </StyledSection>
    </EventsSectionContext.Provider>
  );
};

EventsSection.Header = EventsSectionHeader;
EventsSection.Grid = EventsSectionGrid;
