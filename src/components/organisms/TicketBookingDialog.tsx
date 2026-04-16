import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2, Ticket, Check, CreditCard } from "lucide-react";
import type { EventResponse } from "../../interface/Event.interface";
import { ticketsService } from "../../services/ticketsService";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { MODAL_STYLES } from "../../features/admin/constants";

interface TicketBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventResponse | null;
  onSuccess: () => void;
}

type BookingStep = "select-tier" | "payment";
 
export function TicketBookingDialog({
  isOpen,
  onClose,
  event,
  onSuccess,
}: TicketBookingDialogProps) {
  const [step, setStep] = useState<BookingStep>("select-tier");
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [userBookedCount, setUserBookedCount] = useState(0);
  const [isLoadingQuota, setIsLoadingQuota] = useState(true);

  // Fetch current user's tickets for this event
  useEffect(() => {
    if (isOpen && event) {
      const fetchHistory = async () => {
        setIsLoadingQuota(true);
        try {
          const tickets = await ticketsService.getMine();
          const count = tickets.filter((t) => t.eventId === event.id).length;
          setUserBookedCount(count);
        } catch (error) {
          console.error("Failed to fetch booking history", error);
        } finally {
          setIsLoadingQuota(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, event]);

  if (!event) return null;

  const hasTiers = !!event.tiers && event.tiers.length > 0;

  const handleNextStep = () => {
    if (hasTiers && !selectedTierId) {
      toast.error("Please select a ticket tier.");
      return;
    }
    if (hasTiers) {
      const selectedTier = event.tiers.find((t) => t.id === selectedTierId);
      if (selectedTier && selectedTier.price > 0) {
        setStep("payment");
      } else {
        handleBook(); // If free, just book directly
      }
    } else {
      setStep("payment");
    }
  };

  const handleBook = async () => {
    if (hasTiers && !selectedTierId) {
      toast.error("Please select a ticket tier.");
      return;
    }

    setIsBooking(true);
    try {
      const eventId = event.id;
      if (!eventId) {
        toast.error("Invalid event reference.");
        return;
      }

      await ticketsService.register({
        eventId: eventId,
        tierId: selectedTierId as number,
      });
      toast.success(`Successfully booked ticket for ${event.title}!`);
      onSuccess();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to process booking.";
      toast.error(message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset state on close
      setTimeout(() => {
        setSelectedTierId(null);
        setStep("select-tier");
        setPaymentDetails({
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
        });
      }, 200);
    }
  };

  const selectedTier = event.tiers?.find((t) => t.id === selectedTierId);
  const displayPrice = selectedTier ? selectedTier.price : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("sm:max-w-[500px]", MODAL_STYLES)}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight">
            {step === "select-tier" ? "Select Your Ticket" : "Payment details"}
          </DialogTitle>
          <DialogDescription>
            {step === "select-tier" ? (
              <>
                Choose a ticket tier for <strong>{event.title}</strong>
              </>
            ) : (
              <>
                Enter your card details to book <strong>{event.title}</strong>
              </>
            )}
          </DialogDescription>
          {!isLoadingQuota && (
            <div className="mt-2 text-xs font-bold text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full inline-block">
              Registration Status: {userBookedCount} / {event.maxTicketsPerPerson} tickets booked
            </div>
          )}
        </DialogHeader>

        <div className="py-4 space-y-4">
          {step === "select-tier" ? (
            event.tiers && event.tiers.length > 0 ? (
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
            )
          ) : (
            <div className="space-y-4">
              <div className="mb-4 p-4 rounded-xl border bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTier?.name || "Standard Ticket"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-extrabold text-xl text-primary">
                    {displayPrice > 0 ? `₱${displayPrice}` : "FREE"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="Kent Francois Aroma"
                  value={paymentDetails.cardholderName}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardholderName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="pl-9 font-mono"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const parsed = e.target.value.replace(/\D/g, "");
                      const formatted = parsed.replace(/(.{4})/g, "$1 ").trim();
                      setPaymentDetails({
                        ...paymentDetails,
                        cardNumber: formatted,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={paymentDetails.expiryDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      }
                      setPaymentDetails({ ...paymentDetails, expiryDate: val });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cvv: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          {step === "payment" && hasTiers && (
            <Button
              variant="outline"
              onClick={() => setStep("select-tier")}
              disabled={isBooking}
              className="font-bold mr-auto"
            >
              Back
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isBooking}
            className="font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={step === "select-tier" && (hasTiers || displayPrice > 0) ? handleNextStep : handleBook}
            disabled={
              isBooking || 
              (hasTiers && !selectedTierId) || 
              isLoadingQuota || 
              userBookedCount >= event.maxTicketsPerPerson
            }
            className="font-bold min-w-[140px] shadow-lg shadow-primary/20 gap-2"
          >
            {isBooking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : userBookedCount >= event.maxTicketsPerPerson ? (
              "Limit Reached"
            ) : step === "select-tier" && (hasTiers || displayPrice > 0) ? (
              "Continue"
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
