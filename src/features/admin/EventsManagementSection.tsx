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

  async function loadEvents() {
    setIsLoading(true);
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events", error);
      toast.error("Failed to fetch events from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

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
      if (selectedEvent && selectedEvent.eventID) {
        await eventsService.update(
          selectedEvent.eventID,
          data as EventUpdateDTO,
        );
        toast.success("Event updated successfully!");
      } else {
        await eventsService.create(data as EventCreateDTO);
        toast.success("Event created successfully!");
      }
      setIsEventDialogOpen(false);
      loadEvents();
    } catch (error) {
      console.error("Failed to save event", error);
      toast.error(
        selectedEvent ? "Failed to update event." : "Failed to create event.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent || !selectedEvent.eventID) return;
    setIsSaving(true);
    try {
      await eventsService.delete(selectedEvent.eventID);
      toast.success("Event deleted successfully.");
      setIsDeleteDialogOpen(false);
      loadEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
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
  const { events, handleEdit, handleDeleteClick } = useEventsContext();

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle>Events List</CardTitle>
          <CardDescription>
            You have {events.length} events scheduled in the database.
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
            <SearchInput type="search" placeholder="Filter events..." />
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
      </CardContent>
    </Card>
  );
};
