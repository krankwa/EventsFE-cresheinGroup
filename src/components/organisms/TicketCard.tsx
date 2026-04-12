import { Ticket, Calendar, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { TicketResponse } from "../../interface/Ticket.interface";

interface TicketCardProps {
  ticket: TicketResponse;
  onCancel: (id: number) => void;
  isCancelling: boolean;
}

export function TicketCard({ ticket, onCancel, isCancelling }: TicketCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-muted/50 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
      <div className="relative h-36 overflow-hidden bg-muted/10 border-b border-muted/30">
        {ticket.eventCoverImageUrl ? (
          <img
            src={ticket.eventCoverImageUrl}
            alt={ticket.eventTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <Ticket className="w-8 h-8 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-emerald-500/90 text-white border-none shadow-sm">
            Confirmed
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-5 pb-2">
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {ticket.eventTitle}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          {format(new Date(ticket.eventDate), "PPP")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between text-sm py-2 px-3 bg-muted/20 rounded-md">
          <span className="text-muted-foreground font-medium">Ticket ID</span>
          <span className="font-mono font-bold">
            #T-{ticket.ticketId.toString().padStart(5, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/60">Registered on:</span>
          {format(new Date(ticket.registrationDate), "MMM dd, yyyy")}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 font-semibold group-hover:bg-accent transition-colors"
        >
          View QR
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => onCancel(ticket.ticketId)}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
