import { Ticket, Search, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "react-router-dom";
import { useMyTickets } from "../features/tickets/useMyTickets";
import { TicketCard } from "../components/organisms/TicketCard";

export function MyTicketsPage() {
  const { tickets, isLoading, isCancelling, handleCancel } = useMyTickets();

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">
          Fetching your tickets...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">
            Manage your event registrations and upcoming experiences.
          </p>
        </div>
        <div className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full shadow-sm">
          {tickets.length} Active Tickets
        </div>
      </div>

      {tickets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              onCancel={handleCancel}
              isCancelling={isCancelling === ticket.ticketId}
            />
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
              <Button
                size="lg"
                className="rounded-full px-8 font-bold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
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
