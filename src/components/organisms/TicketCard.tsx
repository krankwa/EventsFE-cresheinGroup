import { Ticket, Calendar, Loader2, Trash2, MapPin, Tag, User } from "lucide-react";
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
  onViewQR: () => void;
}

export function TicketCard({
  ticket,
  onCancel,
  isCancelling,
  onViewQR,
}: TicketCardProps) {
  // If the ticket is redeemed, we can gray out the card or disable certain actions
  const isRedeemed = ticket.isRedeemed;

  return (
    <Card className={`group overflow-hidden border-2 transition-all duration-300 shadow-lg ${
      isRedeemed ? "border-muted/50 opacity-80" : "border-muted/50 hover:border-primary/20 hover:shadow-2xl"
    }`}>
      <div className="relative h-36 overflow-hidden bg-muted/10 border-b border-muted/30">
        {ticket.eventCoverImageUrl ? (
          <img
            src={ticket.eventCoverImageUrl}
            alt={ticket.eventTitle}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              !isRedeemed && "group-hover:scale-110"
            } ${isRedeemed && "grayscale"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <Ticket className="w-8 h-8 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge 
            className={`border-none shadow-sm ${
              isRedeemed 
                ? "bg-secondary text-secondary-foreground" 
                : "bg-emerald-500/90 text-white"
            }`}
          >
            {isRedeemed ? "Redeemed" : "Confirmed"}
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-5 pb-2">
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {ticket.eventTitle}
        </CardTitle>
        <div className="space-y-1 mt-2">
          <CardDescription className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {format(new Date(ticket.eventDate), "PPP")}
          </CardDescription>
          {ticket.venue && (
            <CardDescription className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{ticket.venue}</span>
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Tier, Price, and Attendee Info */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between items-center bg-muted/10 p-2 rounded-md">
            <div className="flex items-center gap-2 text-foreground/80">
              <Tag className="w-3.5 h-3.5 text-primary/70" />
              <span className="font-medium">{ticket.tierName || "General Admission"}</span>
            </div>
            <span className="font-semibold text-primary">
              {ticket.price > 0 ? `$${ticket.price.toFixed(2)}` : "Free"}
            </span>
          </div>

          {ticket.attendeeName && (
            <div className="flex items-center gap-2 text-muted-foreground px-2">
              <User className="w-3.5 h-3.5" />
              <span>{ticket.attendeeName}</span>
            </div>
          )}
        </div>

        {/* Ticket ID & Registration Date */}
        <div className="flex items-center justify-between text-sm py-2 px-3 bg-muted/20 rounded-md">
          <span className="text-muted-foreground font-medium">Ticket ID</span>
          <span className="font-mono font-bold">
            #T-{ticket.ticketId.toString().padStart(5, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/60">
            Registered on:
          </span>
          {format(new Date(ticket.registrationDate), "MMM dd, yyyy")}
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex gap-2">
        <Button
          variant="outline"
          className="flex-1 font-semibold group-hover:bg-accent transition-colors"
          onClick={onViewQR}
        >
          View QR
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => onCancel(ticket.ticketId)}
          // Disable cancel button if the ticket is already redeemed
          disabled={isCancelling || isRedeemed}
          title={isRedeemed ? "Cannot cancel a redeemed ticket" : "Cancel ticket"}
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
