import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  CalendarDays 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import type { EventResponse } from "../../../types/Event.types";

interface EventsTableProps {
  events: EventResponse[];
  onEdit: (event: EventResponse) => void;
  onDelete: (event: EventResponse) => void;
}

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Cover</TableHead>
          <TableHead>Event Info</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Tickets</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={event.eventID || `event-${index}`} className="group cursor-pointer">
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
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(event.date), "PPP")}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{event.venue}</TableCell>
            <TableCell>{event.capacity}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                  <span>Sold</span>
                  <span>{((event.ticketsSold / event.capacity) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(event.ticketsSold / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={event.ticketsSold >= event.capacity ? "destructive" : "secondary"} className="font-medium">
                {event.ticketsSold >= event.capacity ? "Sold Out" : "Active"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => onEdit(event)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(event)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="group-hover:hidden h-8 w-8">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
