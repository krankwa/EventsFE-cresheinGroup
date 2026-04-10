import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { CalendarDays, MapPin, Users, ImageIcon } from "lucide-react";
import type { EventResponse, EventCreateDTO, EventUpdateDTO } from "../../../types/Event.types";
import { format } from "date-fns";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventCreateDTO | EventUpdateDTO) => void;
  event?: EventResponse | null;
  isLoading?: boolean;
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  event,
  isLoading
}: EventDialogProps) {
  const [formData, setFormData] = useState<EventCreateDTO>({
    title: "",
    date: "",
    venue: "",
    capacity: 0,
    coverImageUrl: ""
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date.split("T")[0], // Keep only YYYY-MM-DD for input type="date"
        venue: event.venue,
        capacity: event.capacity,
        coverImageUrl: event.coverImageUrl || ""
      });
    } else {
      setFormData({
        title: "",
        date: format(new Date(), "yyyy-MM-dd"),
        venue: "",
        capacity: 100,
        coverImageUrl: ""
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {event ? "Update the details of your event below." : "Fill in the details to schedule a new event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                Event Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Summer Tech Conference"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-sm">
                  <CalendarDays className="w-3 h-3" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="flex items-center gap-2 text-sm">
                  <Users className="w-3 h-3" />
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={formData.capacity || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                    setFormData({ ...formData, capacity: val });
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue" className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Venue
              </Label>
              <Input
                id="venue"
                placeholder="e.g. Grand Ballroom"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <ImageIcon className="w-3 h-3" />
                Cover Image URL
              </Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (event ? "Updating..." : "Creating...") : (event ? "Update Event" : "Create Event")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
