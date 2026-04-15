import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Loader2, Ticket, Check } from "lucide-react";
import type { EventResponse } from "../../interface/Event.interface";
import { ticketsService } from "../../services/ticketsService";
import { toast } from "react-hot-toast";

interface TicketBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventResponse | null;
  onSuccess: () => void;
}

export function TicketBookingDialog({
  isOpen,
  onClose,
  event,
  onSuccess,
}: TicketBookingDialogProps) {
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  if (!event) return null;

  const handleBook = async () => {
    if (!selectedTierId) {
      toast.error("Please select a ticket tier.");
      return;
    }

    setIsBooking(true);
    try {
      await ticketsService.register({
        Id: event.Id,
        tierId: selectedTierId,
      });
      toast.success(`Successfully booked ticket for ${event.title}!`);
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to book ticket.";
      toast.error(message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state on close
      setTimeout(() => setSelectedTierId(null), 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-2 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            Select Your Ticket
          </DialogTitle>
          <DialogDescription>
            Choose a ticket tier for <strong>{event.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {event.tiers && event.tiers.length > 0 ? (
            event.tiers.map((tier) => {
              const isSoldOut = tier.ticketsSold >= tier.capacity;
              const isSelected = selectedTierId === tier.id;

              return (
                <div
                  key={tier.id}
                  onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between
                    ${
                      isSoldOut
                        ? "opacity-60 cursor-not-allowed bg-muted/30 border-muted"
                        : isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/10"
                    }
                  `}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{tier.name}</span>
                      {isSoldOut && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5" />
                      {tier.capacity - tier.ticketsSold} remaining
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-extrabold tracking-tight text-primary">
                      {tier.price > 0 ? `₱${tier.price}` : "FREE"}
                    </span>
                    <div
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        }
                      `}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No ticket tiers available for this event yet.
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isBooking}
            className="font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBook}
            disabled={isBooking || !selectedTierId}
            className="font-bold min-w-[140px] shadow-lg shadow-primary/20 gap-2"
          >
            {isBooking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
