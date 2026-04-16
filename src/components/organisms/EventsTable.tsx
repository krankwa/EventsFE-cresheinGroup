import { memo } from "react";
import { MoreVertical, Edit, Trash2, Eye, CalendarDays, ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import type { EventResponse } from "../../interface/Event.interface";

import { TableEmptyState } from "./TableEmptyState";
import { cn } from "@/lib/utils";

interface EventsTableProps {
  events: EventResponse[];
  onEdit: (event: EventResponse) => void;
  onDelete: (event: EventResponse) => void;
  onView: (event: EventResponse) => void;
  onCreateNew?: () => void;
  sortBy?: string | undefined;
  isDescending?: boolean | undefined;
  onSort?: (field: string) => void;
}

const SortIcon = ({ 
  field, 
  sortBy, 
  isDescending 
}: { 
  field: string, 
  sortBy?: string | undefined, 
  isDescending?: boolean | undefined 
}) => {
  if (sortBy !== field) return null;
  return isDescending ? (
    <ChevronDown className="ml-1 w-4 h-4 inline-block" />
  ) : (
    <ChevronUp className="ml-1 w-4 h-4 inline-block" />
  );
};

const HeaderCell = ({ 
  label, 
  field, 
  className,
  sortBy,
  isDescending,
  onSort
}: { 
  label: string, 
  field?: string, 
  className?: string | undefined,
  sortBy?: string | undefined,
  isDescending?: boolean | undefined,
  onSort?: ((field: string) => void) | undefined
}) => (
  <TableHead 
    className={cn(field ? "cursor-pointer hover:text-primary transition-colors select-none" : "", className)}
    onClick={() => field && onSort?.(field)}
  >
    <div className="flex items-center">
      {label}
      {field && <SortIcon field={field} sortBy={sortBy} isDescending={isDescending} />}
    </div>
  </TableHead>
);

export const EventsTable = memo(function EventsTable({
  events,
  onEdit,
  onDelete,
  onView,
  onCreateNew,
  sortBy,
  isDescending,
  onSort,
}: EventsTableProps) {
  if (events.length === 0) {
    return (
      <TableEmptyState
        icon={CalendarDays}
        title="No Masterwork Events Found"
        description="Your stage is currently empty. Start by creating a new event to begin managing your masterwork."
        {...(onCreateNew && {
          actionLabel: "Create New Event",
          onAction: onCreateNew,
        })}
      />
    );
  }

  return (
    <Table>
      <TableHeader className="bg-gray-100 rounded-t-lg">
        <TableRow>
          <TableHead className="w-[80px]">Cover</TableHead>
          <HeaderCell label="Event Info" field="title" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCell label="Location" field="venue" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCell label="Capacity" field="capacity" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <HeaderCell label="Tickets" field="ticketssold" sortBy={sortBy} isDescending={isDescending} onSort={onSort} />
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          if (!event) return null;
          const capacity =
            event.capacity && event.capacity > 0 ? event.capacity : 1;
          const sold = event.ticketsSold || 0;
          const percentage = ((sold / capacity) * 100).toFixed(0);

          return (
            <TableRow
              key={
                event.id || `ev-${event.title || "un"}-${event.date || "un"}`
              }
              className="group cursor-pointer"
            >
              <TableCell>
                {event.coverImageUrl ? (
                  <div className="w-12 h-12 rounded overflow-hidden border">
                    <img
                      src={event.coverImageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "PPP")}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {event.venue || "TBA"}
                  </span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {event.venueAddress || "No address provided"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{event.capacity}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 w-24">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Sold</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "font-medium",
                    sold >= capacity
                      ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                  )}
                >
                  {sold >= capacity ? "Sold Out" : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(event);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(event);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group-hover:hidden h-8 w-8"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});
