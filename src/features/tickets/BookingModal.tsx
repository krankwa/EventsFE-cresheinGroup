import { useState } from "react";
import { Ticket, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import type { EventResponse, TicketTierResponse } from "../../interface/Event.interface";

interface BookingModalProps {
  event: EventResponse;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tierId: number) => Promise<void>;
  isBooking: boolean;
}

export function BookingModal({
  event,
  isOpen,
  onClose,
  onConfirm,
  isBooking,
}: BookingModalProps) {
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);

  const handleConfirm = async () => {
    if (selectedTierId === null) return;
    await onConfirm(selectedTierId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" />
            Book Your Spot
          </DialogTitle>
          <DialogDescription>
            Select a ticket tier for <span className="font-semibold text-foreground">{event.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto px-1">
          {event.tiers.map((tier: TicketTierResponse) => {
            const isSoldOut = tier.availableTickets <= 0;
            const isSelected = selectedTierId === tier.id;

            return (
              <div
                key={tier.id}
                onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-200 
                  ${isSoldOut ? "bg-muted/30 border-muted opacity-60 cursor-not-allowed" : 
                    isSelected ? "bg-primary/5 border-primary ring-1 ring-primary" : 
                    "bg-card hover:border-primary/50 hover:bg-accent/5"}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{tier.name}</span>
                      {isSoldOut ? (
                        <Badge variant="destructive" className="text-[10px] py-0">Sold Out</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] py-0">{tier.availableTickets} left</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {isSoldOut ? (
                        <XCircle className="w-3 h-3 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      )}
                      <span>{tier.ticketsSold} / {tier.capacity} sold</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">₱{tier.price.toLocaleString()}</div>
                  </div>
                </div>

                {isSelected && !isSoldOut && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full font-bold shadow-lg shadow-primary/20"
            disabled={selectedTierId === null || isBooking}
            onClick={handleConfirm}
          >
            {isBooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Booking...
              </>
            ) : (
              "Confirm Selection"
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isBooking}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
