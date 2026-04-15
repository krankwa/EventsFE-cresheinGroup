import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import styled from "styled-components";
import { Search, Plus, Filter, Download } from "lucide-react";
import {
  AdminSectionContainer,
  AdminHeaderContainer,
  AdminHeaderText,
  AdminTitle,
  AdminSubtitle,
} from "./adminSectionStyles";
import { eventsService } from "../../services/eventsService";
import type {
  EventResponse,
  EventCreateDTO,
  EventUpdateDTO,
} from "../../interface/Event.interface";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { EventsTable } from "../../components/organisms/EventsTable";
import { EventDialog } from "../../components/organisms/EventDialog";
import { DeleteConfirmDialog } from "../../components/organisms/DeleteConfirmDialog";
import { useServerPagination } from "../../components/hooks/useServerPagination";
import { PaginationWrapper } from "../../components/organisms/PaginationWrapper";
import { toast } from "react-hot-toast";

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 768px) {
    width: 16rem;
  }
`;

const SearchInput = styled.input`
  height: 2.5rem;
  width: 100%;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  font-size: 0.875rem;
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
`;

interface EventsManagementContextType {
  events: EventResponse[];
  isLoading: boolean;
  isSaving: boolean;
  isEventDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedEvent: EventResponse | null;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  handleCreate: () => void;
  handleEdit: (event: EventResponse) => void;
  handleDeleteClick: (event: EventResponse) => void;
  handleSave: (data: EventCreateDTO | EventUpdateDTO) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  setIsEventDialogOpen: (val: boolean) => void;
  setIsDeleteDialogOpen: (val: boolean) => void;
}

const EventsManagementContext = createContext<
  EventsManagementContextType | undefined
>(undefined);

const useEventsContext = () => {
  const context = useContext(EventsManagementContext);
  if (!context) throw new Error("Must be used within EventsManagementSection");
  return context;
};

export function EventsManagementSection({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Initialize the Pagination Hook
  const {
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    goToPage,
    changePageSize,
    updatePaginationInfo,
  } = useServerPagination({
    initialPageSize: 10,
    onPageChange: (page, size) => {
      loadEvents(page, size, debouncedSearch);
    },
  });

  // Debounce effect for searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (pageNumber !== 1) goToPage(1);
      else loadEvents(1, pageSize, searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function loadEvents(
    page: number = pageNumber,
    size: number = pageSize,
    search: string = debouncedSearch,
  ) {
    setIsLoading(true);
    try {
      const response = await eventsService.getAllPaginated({
        pageNumber: page,
        pageSize: size,
        ...(search && { searchTerm: search }),
      });

      type ExpectedServerResponse = {
        events?: EventResponse[];
        data?: EventResponse[];
        items?: EventResponse[];
        pagination?: {
          totalPages?: number;
          totalCount?: number;
        };
      };

      const responseData = response as unknown as ExpectedServerResponse;

      const eventList =
        responseData?.events || responseData?.data || responseData?.items || [];
      const newTotalPages = responseData?.pagination?.totalPages || 1;
      const newTotalCount =
        responseData?.pagination?.totalCount || eventList.length;

      setEvents(eventList);

      updatePaginationInfo({
        totalPages: newTotalPages,
        totalCount: newTotalCount,
      });
    } catch (error) {
      console.error("Failed to load events", error);
      toast.error("Failed to fetch events from the server.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load is handled by the search debounce effect above
  // so we don't need a separate bare useEffect to prevent double-fetching

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEdit = (event: EventResponse) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteClick = (event: EventResponse) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async (data: EventCreateDTO | EventUpdateDTO) => {
    setIsSaving(true);
    try {
      if (selectedEvent && selectedEvent.id) {
        await eventsService.update(selectedEvent.id, data as EventUpdateDTO);
        toast.success("Event updated successfully!");
      } else {
        await eventsService.create(data as EventCreateDTO);
        toast.success("Event created successfully!");
      }
      setIsEventDialogOpen(false);
      loadEvents();
    } catch (error) {
      toast.error(
        selectedEvent ? "Failed to update event." : "Failed to create event.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent || !selectedEvent.id) return;
    setIsSaving(true);
    try {
      await eventsService.delete(selectedEvent.id);
      toast.success("Event deleted successfully.");
      setIsDeleteDialogOpen(false);
      loadEvents();
    } catch (error) {
      toast.error("Failed to delete the event. It might have linked data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EventsManagementContext.Provider
      value={{
        events,
        isLoading,
        isSaving,
        isEventDialogOpen,
        isDeleteDialogOpen,
        selectedEvent,
        searchQuery,
        setSearchQuery,
        pageNumber,
        totalPages,
        pageSize,
        totalCount,
        goToPage,
        changePageSize,
        handleCreate,
        handleEdit,
        handleDeleteClick,
        handleSave,
        handleDeleteConfirm,
        setIsEventDialogOpen,
        setIsDeleteDialogOpen,
      }}
    >
      <AdminSectionContainer>
        {children}

        <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          onSave={handleSave}
          event={selectedEvent}
          isLoading={isSaving}
        />

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={selectedEvent?.title || "Unknown Event"}
          isLoading={isSaving}
        />
      </AdminSectionContainer>
    </EventsManagementContext.Provider>
  );
}

EventsManagementSection.Header = function EventsManagementSectionHeader() {
  const { handleCreate } = useEventsContext();
  return (
    <AdminHeaderContainer>
      <AdminHeaderText>
        <AdminTitle>Manage Events</AdminTitle>
        <AdminSubtitle>
          Review, edit, and organize your upcoming event list.
        </AdminSubtitle>
      </AdminHeaderText>
      <ActionButtons>
        <Button variant="outline" className="gap-2">
          <Download style={{ width: "1rem", height: "1rem" }} />
          Export
        </Button>
        <Button className="gap-2" onClick={handleCreate}>
          <Plus style={{ width: "1rem", height: "1rem" }} />
          New Event
        </Button>
      </ActionButtons>
    </AdminHeaderContainer>
  );
};

EventsManagementSection.Content = function EventsManagementSectionContent() {
  const {
    events,
    handleEdit,
    handleDeleteClick,
    searchQuery,
    setSearchQuery,
    pageNumber,
    totalPages,
    pageSize,
    totalCount,
    goToPage,
    changePageSize,
  } = useEventsContext();

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle>Events List</CardTitle>
          <CardDescription>
            You have {totalCount} events scheduled in the database.
          </CardDescription>
        </div>
        <SearchContainer>
          <SearchInputWrapper>
            <Search
              style={{
                position: "absolute",
                left: "0.625rem",
                top: "0.625rem",
                height: "1rem",
                width: "1rem",
                color: "hsl(var(--muted-foreground))",
              }}
            />
            <SearchInput
              type="search"
              placeholder="Filter events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputWrapper>
          <Button variant="outline" size="icon">
            <Filter style={{ width: "1rem", height: "1rem" }} />
          </Button>
        </SearchContainer>
      </CardHeader>
      <CardContent>
        <EventsTable
          events={events}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
        {totalCount > 0 && (
          <div className="mt-4">
            <PaginationWrapper
              currentPage={pageNumber}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalCount}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
