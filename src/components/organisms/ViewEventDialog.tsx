import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { cn } from "@/lib/utils";
import { MODAL_STYLES } from "../../features/admin/constants";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  CalendarDays, 
  MapPin, 
  Ticket, 
  Users, 
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { format } from "date-fns";
import type { EventResponse } from "../../interface/Event.interface";

interface ViewEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventResponse | null;
}

export function ViewEventDialog({
  isOpen,
  onClose,
  event,
}: ViewEventDialogProps) {
  if (!event) return null;

  const totalCapacity = event.capacity;
  const totalSold = event.ticketsSold || 0;
  const totalPercentage = ((totalSold / totalCapacity) * 100).toFixed(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[600px]", MODAL_STYLES)}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
              Event Analytics
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {event.title}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-1.5 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="w-4 h-4 text-primary" />
              {format(new Date(event.date), "PPP")}
            </div>
            <div className="flex items-center gap-2 text-sm italic">
              <MapPin className="w-4 h-4 text-primary" />
              {event.venue || "TBA"} ({event.venueAddress || "No address"})
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-tighter">
                <TrendingUp className="w-3.5 h-3.5" />
                Sales Progress
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{totalPercentage}%</span>
                <span className="text-xs text-muted-foreground font-medium">reached</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-muted/50 border space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                <Users className="w-3.5 h-3.5" />
                Total Attendees
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{totalSold}</span>
                <span className="text-xs text-muted-foreground font-medium">/ {totalCapacity}</span>
              </div>
            </div>
          </div>

          {/* Tier Breakdown */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Tier Breakdown
            </h3>
            
            <div className="grid gap-3">
              {event.tiers && event.tiers.length > 0 ? (
                event.tiers.map((tier) => {
                  const tierPercentage = ((tier.ticketsSold / tier.capacity) * 100).toFixed(0);
                  return (
                    <div 
                      key={tier.id}
                      className="group p-4 rounded-2xl bg-background border transition-all hover:shadow-md hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-base leading-none mb-1">{tier.name}</p>
                          <p className="text-xs font-semibold text-primary">₱{tier.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black">{tier.ticketsSold} / {tier.capacity}</p>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tabular-nums">
                            {tierPercentage}% Sold
                          </p>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000 group-hover:bg-primary/80"
                          style={{ width: `${tierPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-muted-foreground italic text-sm border-2 border-dashed rounded-2xl">
                  No ticket tiers configured for this event.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" className="font-bold" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
