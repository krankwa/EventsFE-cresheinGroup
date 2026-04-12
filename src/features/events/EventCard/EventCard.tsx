import type { ReactNode, JSX } from "react";
import styled from "styled-components";
import { Card } from "../../../components/ui/card";

// Composed Child Components
import { EventCardImage } from "./EventCardImage";
import { EventCardDetails } from "./EventCardDetails";
import { EventCardAction } from "./EventCardAction";

const StyledCard = styled(Card)`
  overflow: hidden;
  transition: all 0.3s ease;
  border-color: hsl(var(--muted) / 0.4);
  background-color: hsl(var(--card) / 0.5);
  backdrop-filter: blur(4px);

  &:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`;

interface EventCardProps {
  children?: ReactNode;
  className?: string;
}

export function EventCard({ children, className }: EventCardProps): JSX.Element {
  return <StyledCard className={className}>{children}</StyledCard>;
}

EventCard.displayName = "EventCard";
EventCard.Image = EventCardImage;
EventCard.Details = EventCardDetails;
EventCard.Action = EventCardAction;
