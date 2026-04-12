import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ticketsService } from "../../services/ticketsService";
import type { TicketResponse } from "../../interface/Ticket.interface";

interface UseMyTicketsReturn {
  tickets: TicketResponse[];
  isLoading: boolean;
  isCancelling: number | null;
  handleCancel: (id: number) => Promise<void>;
}

export function useMyTickets(): UseMyTicketsReturn {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  useEffect(() => {
    ticketsService
      .getMine()
      .then((data) => setTickets(data))
      .catch((err) => {
        console.error("Failed to load tickets", err);
        toast.error("Could not retrieve your tickets.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this ticket? This action cannot be undone.",
      )
    )
      return;

    setIsCancelling(id);
    try {
      await ticketsService.cancel(id);
      toast.success("Ticket cancelled successfully.");
      setTickets((prev) => prev.filter((t) => t.ticketId !== id));
    } catch (err) {
      console.error("Cancellation failed", err);
      toast.error("Failed to cancel the ticket.");
    } finally {
      setIsCancelling(null);
    }
  };

  return { tickets, isLoading, isCancelling, handleCancel };
}
