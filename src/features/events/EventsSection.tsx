import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { useEvents } from "./useEvents";
import { EventGrid } from "./EventGrid";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { Badge } from "../../components/ui/badge";
import { ErrorState } from "../../components/ui/error";
import { Input } from "../../components/ui/input";
import { Search, Calendar } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import type { EventResponse } from "../../interface/Event.interface";

const ITEMS_PER_PAGE = 9;

type DateFilter = "upcoming" | "all" | "past";

// --- Context ---
interface EventsSectionContextType {
  events: EventResponse[]; // The currently paginated page
  fullCount: number; // Total count after filtering
  totalCount: number; // Total count of all events
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  withinEventsSection: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
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

const FilterBar = styled.div.attrs({
  className:
    "flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between",
})``;

const SearchContainer = styled.div.attrs({
  className: "relative w-full sm:max-w-xs",
})``;

const Controls = styled.div.attrs({
  className: "flex flex-wrap items-center gap-3 w-full sm:w-auto",
})``;

interface EventsSectionProps {
  children?: ReactNode;
  className?: string;
  id?: string;
}

// --- Compound Components ---
// --- Compound Components ---
export function EventsSection({ children, id, className }: EventsSectionProps) {
  const { data, isLoading, isError, error, refetch } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);

  const allEvents = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filteredEvents = useMemo(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    const filtered = allEvents.filter((event) => {
      const matchesSearch =
        (event.title?.toLowerCase() || "").includes(term) ||
        (event.venue?.toLowerCase() || "").includes(term);

      if (!matchesSearch) return false;

      const eventDate = new Date(event.date);
      const now = new Date();

      if (dateFilter === "upcoming") {
        return eventDate >= now;
      } else if (dateFilter === "past") {
        return eventDate < now;
      }

      return true;
    });

    const seen = new Set<string>();
    return filtered.filter((event) => {
      const key = `${event.title}-${event.date}-${event.venue}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allEvents, searchTerm, dateFilter]);

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  return (
    <EventsSectionContext.Provider
      value={{
        events: paginatedEvents,
        fullCount: filteredEvents.length,
        totalCount: allEvents.length,
        isLoading,
        isError,
        error: error ?? null,
        refetch,
        withinEventsSection: true,
        searchTerm,
        setSearchTerm: handleSearchChange,
        dateFilter,
        setDateFilter: handleDateFilterChange,
        currentPage,
        setCurrentPage,
        totalPages,
      }}
    >
      <StyledSection id={id ?? ""} className={className ?? ""}>
        {children}
      </StyledSection>
    </EventsSectionContext.Provider>
  );
}

// --- Internal Components ---

function EventsSectionHeader() {
  const { searchTerm, setSearchTerm, dateFilter, setDateFilter, fullCount } =
    useEventsSectionContext("EventsSection.Header");
  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className="space-y-8">
      <SectionHeader
        title={isSearchActive ? "Search Results" : "Upcoming Events"}
        description={
          isSearchActive
            ? `Showing ${fullCount} matches for "${searchTerm}"`
            : "Discover and book tickets for the best events in your area."
        }
      />

      <FilterBar>
        <SearchContainer>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or venue..."
            className="pl-10 h-11 border-2 focus-visible:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <Controls>
          <Select
            value={dateFilter}
            onValueChange={(val: DateFilter) => setDateFilter(val)}
          >
            <SelectTrigger className="w-[180px] h-11 border-2">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="all">Everywhere & Always</SelectItem>
              <SelectItem value="past">Past Memoirs</SelectItem>
            </SelectContent>
          </Select>

          {fullCount > 0 && (
            <Badge
              variant="secondary"
              className="h-11 px-4 text-sm font-bold rounded-xl whitespace-nowrap"
            >
              {fullCount} Events
            </Badge>
          )}
        </Controls>
      </FilterBar>
    </div>
  );
}

function EventsSectionGrid() {
  const {
    events,
    isLoading,
    isError,
    searchTerm,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useEventsSectionContext("EventsSection.Grid");
  const isSearchActive = searchTerm.trim().length > 0;

  if (isError) {
    return (
      <ErrorState
        title="Well, this is awkward..."
        description="We encountered a minor disturbance while fetching your events. Please try again."
      />
    );
  }

  return (
    <div className="space-y-12">
      <EventGrid
        events={events}
        isLoading={isLoading}
        isListMode={isSearchActive}
      />

      {totalPages > 1 && !isLoading && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Attach sub-components
EventsSection.Header = EventsSectionHeader;
EventsSection.Grid = EventsSectionGrid;
