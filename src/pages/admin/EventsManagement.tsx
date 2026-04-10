import { useEffect, useState } from "react";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  Filter,
  Download,
  CalendarDays
} from "lucide-react";
import { eventsService } from "../../api/eventsService";
import type { EventResponse } from "../../types/Event.types";
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
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../../components/ui/card";
import { format } from "date-fns";

export function EventsManagement() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await eventsService.getAll();
        setEvents(data);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

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
           <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle>Events List</CardTitle>
            <CardDescription>You have {events.length} events scheduled in the database.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Filter events..."
                  className="pl-9 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                {events.map((event) => (
                  <TableRow key={event.id} className="group cursor-pointer">
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
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                             <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

