import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Filter, Download, RefreshCcw } from "lucide-react";
import { eventsService } from "../../services/eventsService";
import { useEvents } from "../../features/events/useEvents";
import { useQueryClient } from "@tanstack/react-query";
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
import { ViewEventDialog } from "../../components/organisms/ViewEventDialog";
import { DeleteConfirmDialog } from "../../components/organisms/DeleteConfirmDialog";
import { toast } from "react-hot-toast";
import type {
  EventCreateDTO,
  EventUpdateDTO,
} from "../../interface/Event.interface";
import { usePagination } from "@/utils/pagination/usePagination";
import { PaginationWrapper } from "@/components/organisms/PaginationWrapper";

export function EventsManagement() {
  const { data: events = [], isLoading, refetch } = useEvents();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );

  // Client-side pagination hook
  const {
    page,
    pageSize,
    totalPages,
    totalItems,
    setTotalItems,
    goToPage,
    setPageSize,
    searchQuery: debouncedSearch,
    handleSearch,
  } = usePagination({ initialPageSize: 10 });

  // Debounce search to update the pagination hook
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  // Derived data for display
  const filteredEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const searchLower = debouncedSearch.toLowerCase();
      return (
        event.title?.toLowerCase().includes(searchLower) ||
        event.venue?.toLowerCase().includes(searchLower) ||
        event.venueAddress?.toLowerCase().includes(searchLower)
      );
    });
    return filtered;
  }, [events, debouncedSearch]);

  // Update total items when filtered data changes
  useEffect(() => {
    setTotalItems(filteredEvents.length);
  }, [filteredEvents, setTotalItems]);

  const paginatedEvents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, page, pageSize]);

  // Fetch all events
  // Fetch and state are now managed by useEvents hook
  const loadEvents = () => refetch();

  // --- Handlers ---
  const handleCreate = () => {
    setSelectedEvent(null);
    setIsEventDialogOpen(true);
  };

  const handleEdit = (event: EventResponse) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleView = (event: EventResponse) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save event.",
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
    } catch (error) {
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
          <p className="text-muted-foreground">
            Review, edit, and organize your upcoming event list.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={loadEvents}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {/* <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button> */}
          <Button className="gap-2 bg-blue-900" onClick={handleCreate}>
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>Events List</CardTitle>
            <CardDescription>
              Total of {totalItems} events found.
            </CardDescription>
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
              <EventsTable
                events={paginatedEvents}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDeleteClick}
                onCreateNew={() => setIsEventDialogOpen(true)}
              />
              <PaginationWrapper
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={goToPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      <EventDialog
        key={selectedEvent?.id || "new"}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSave}
        event={selectedEvent}
        isLoading={isSaving}
      />

      <ViewEventDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={selectedEvent?.title || ""}
        isLoading={isSaving}
      />
    </div>
  );
}
