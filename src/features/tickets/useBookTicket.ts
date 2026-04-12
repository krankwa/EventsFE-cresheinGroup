import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ticketsService } from "../../services/ticketsService";
import { useUser } from "../authentication/useUser";
import type { EventResponse } from "../../interface/Event.interface";

interface UseBookTicketReturn {
  isBooking: boolean;
  handleBook: () => Promise<void>;
}

export function useBookTicket(event: EventResponse): UseBookTicketReturn {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (!user) {
      toast("Please sign in to book tickets.", { icon: "🎟️" });
      navigate("/login");
      return;
    }
    if (isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    setIsBooking(true);
    try {
      await ticketsService.register({ eventId: event.eventID, tierId: 1 });
      toast.success(`Booked for ${event.title}! 🎉`);
      navigate("/tickets");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to book ticket.";
      toast.error(msg);
    } finally {
      setIsBooking(false);
    }
  };

  return { isBooking, handleBook };
}
