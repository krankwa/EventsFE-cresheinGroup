import { useEffect, useState } from "react";
import { Ticket, Calendar, Search,  Trash2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { ticketsService } from "../api/ticketsService";
import type { TicketResponse } from "../types/Ticket.types";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function MyTicketsPage() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const data = await ticketsService.getMine();
      setTickets(data);
    } catch (error) {
      console.error("Failed to load tickets", error);
      toast.error("Could not retrieve your tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCancel = async (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this ticket? This action cannot be undone.")) return;
    
    setIsCancelling(id);
    try {
      await ticketsService.cancel(id);
      toast.success("Ticket cancelled successfully.");
      setTickets(prev => prev.filter(t => t.ticketId !== id));
    } catch (error) {
      console.error("Cancellation failed", error);
      toast.error("Failed to cancel the ticket.");
    } finally {
      setIsCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Fetching your tickets...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">Manage your event registrations and upcoming experiences.</p>
        </div>
        <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full shadow-sm">
          {tickets.length} Active Tickets
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <Card key={ticket.ticketId} className="group overflow-hidden border-2 border-muted/50 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Ticket className="w-5 h-5 text-primary" />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Confirmed</Badge>
                </div>
                <CardTitle className="mt-4 text-xl line-clamp-1 group-hover:text-primary transition-colors">
                  {ticket.eventTitle}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(ticket.eventDate), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between text-sm py-2 px-3 bg-muted/20 rounded-md">
                   <span className="text-muted-foreground font-medium">Ticket ID</span>
                   <span className="font-mono font-bold">#T-{ticket.ticketId.toString().padStart(5, '0')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                   <span className="font-semibold text-foreground/60">Registered on:</span>
                   {format(new Date(ticket.registrationDate), "MMM dd, yyyy")}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex gap-2">
                <Button variant="outline" className="flex-1 font-semibold group-hover:bg-accent transition-colors">
                  View QR
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => handleCancel(ticket.ticketId)}
                  disabled={isCancelling === ticket.ticketId}
                >
                  {isCancelling === ticket.ticketId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 bg-muted/10 border-2 border-dashed border-muted/60 rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center animate-bounce duration-3000">
              <Ticket className="w-10 h-10 text-muted-foreground/60" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No tickets yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Discover amazing experiences and start your journey today.
              </p>
            </div>
            <Link to="/events">
              <Button size="lg" className="rounded-full px-8 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
                Explore Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset", className)}>
      {children}
    </span>
  );
}
