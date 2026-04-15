import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsService } from "../../services/ticketsService";
import { useUser } from "../authentication/useUser";
import type { EventResponse } from "../../interface/Event.interface";

interface UseBookTicketReturn {
  isBooking: boolean;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleBook: (tierId: number) => Promise<void>;
}

export function useBookTicket(event: EventResponse): UseBookTicketReturn {
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { mutateAsync: bookTicket, isPending: isBooking } = useMutation({
    mutationFn: (tierId: number) => 
      ticketsService.register({ eventId: event.eventID, tierId }),
    
    // No retries for POST requests to prevent double-booking and cancellation race conditions
    retry: 0,
    
    onSuccess: () => {
      toast.success(`Booked for ${event.title}! 🎉`);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/tickets");
    },
    onError: (err: Error) => {
      // Success Mapping: If the error message indicates the user already has a ticket, 
      // it means a previous attempt (or a concurrent one) succeeded despite the interruption.
      const msg = err.message || "Failed to book ticket.";
      if (msg.toLowerCase().includes("already has a ticket")) {
        toast.success(`Booked for ${event.title}! 🎉`);
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
        navigate("/tickets");
        return;
      }
      toast.error(msg);
    }
  });

  const handleBook = async (tierId: number) => {
    if (isBooking) return;
    
    if (!user) {
      toast("Please sign in to book tickets.", { icon: "🎟️" });
      navigate("/login");
      return;
    }
    if (isAdmin) {
      toast.error("Admins cannot book tickets.");
      return;
    }
    
    try {
      await bookTicket(tierId);
    } catch {
      // Errors are handled in mutation onError
    }
  };

  return { isBooking, isOpen, openModal, closeModal, handleBook };
}
