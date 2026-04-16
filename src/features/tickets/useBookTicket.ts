import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useUser } from "../authentication/useUser";
import type { EventResponse } from "../../interface/Event.interface";

interface UseBookTicketReturn {
  isBooking: boolean;
  handleBook: () => Promise<void>;
}

export function useBookTicket(event: EventResponse): UseBookTicketReturn {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [isBooking] = useState(false);

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
    // Navigate to the event detail page so the user can choose a tier
    navigate(`/events/${event.id}`);
  };

  return { isBooking, handleBook };
}
