import { useEffect, useState } from "react";
import { Search, Plus, Filter, Download } from "lucide-react";
import { eventsService } from "../../services/eventsService";
import type { EventResponse } from "../../interface/Event.interface";
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
import type { EventCreateDTO, EventUpdateDTO } from "../../interface/Event.interface";
import { useServerPagination } from "@/components/hooks/useServerPagination";
import { PaginationWrapper } from "@/components/organisms/PaginationWrapper";

export function EventsManagement() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Dialog States
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null);

  // Server-side pagination
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      goToPage(1); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function loadEvents(page: number = pageNumber, size: number = pageSize, search: string = debouncedSearch) {
    setIsLoading(true);
    try {
      const response = await eventsService.getAllPaginated({
        pageNumber: page,
        pageSize: size,
        ...(search && { searchTerm: search }),
      });``
      setEvents(response.items);
      updatePaginationInfo(response);
    } catch (error) {
      console.error("Failed to load events", error);
      toast.error("Failed to fetch events from the server.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEvents(1, pageSize, debouncedSearch);
  }, [debouncedSearch]);

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
        await eventsService.update(selectedEvent.eventID, data as EventUpdateDTO);
        toast.success("Event updated successfully!");
      } else {
        await eventsService.create(data as EventCreateDTO);
        toast.success("Event created successfully!");
      }
      setIsEventDialogOpen(false);
      loadEvents(pageNumber, pageSize, debouncedSearch);
    } catch (error) {
      console.error("Failed to save event", error);
      toast.error(error instanceof Error ? error.message : "Failed to save event.");
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
      loadEvents(pageNumber, pageSize, debouncedSearch);
    } catch (error) {
      console.error("Failed to delete event", error);
      toast.error("Failed to delete the event. It might have linked data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground">Review, edit, and organize your upcoming event list.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>Events List</CardTitle>
            <CardDescription>Total of {totalCount} events in the database.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Filter events..."
                className="pl-9 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground animate-pulse">
              Loading your events...
            </div>
          ) : (
            <>
              <EventsTable events={events} onEdit={handleEdit} onDelete={handleDeleteClick} />
              <PaginationWrapper
                currentPage={pageNumber}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalCount}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      <EventDialog
        key={selectedEvent?.eventID || "new"}
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
        title={selectedEvent?.title || ""}
        isLoading={isSaving}
      />
    </div>
  );
}