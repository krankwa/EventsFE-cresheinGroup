import type { JSX } from "react";
import styled from "styled-components";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { CardFooter } from "../../../components/ui/card";

const StyledButton = styled(Button)`
  width: 100%;
  gap: 0.5rem;
  font-weight: 600;

  svg.arrow {
    width: 1rem;
    height: 1rem;
    transition: transform 0.3s;
  }

  &:hover svg.arrow {
    transform: translateX(0.25rem);
  }

  svg.spin {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export interface EventCardActionProps {
  isSoldOut: boolean;
  isBooking: boolean;
  onBook: () => void;
}

export function EventCardAction({ isSoldOut, isBooking, onBook }: EventCardActionProps): JSX.Element {
  return (
    <CardFooter className="p-5 pt-0">
      <StyledButton
        type="button" className="bg-blue-900"
        variant={isSoldOut ? "outline" : "default"}
        disabled={isSoldOut || isBooking}
        onClick={(e) => { e.preventDefault(); onBook(); }}
      >
        {isBooking ? (
          <>
            <Loader2 className="spin" />
            Booking...
          </>
        ) : isSoldOut ? (
          "Notify Me"
        ) : (
          <>
            View & Book
            <ArrowRight className="arrow" />
          </>
        )}
      </StyledButton>
    </CardFooter>
  );
}

EventCardAction.displayName = "EventCard.Action";
