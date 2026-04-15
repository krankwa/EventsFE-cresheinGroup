import type { JSX } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { Calendar, MapPin, Users } from "lucide-react";
import { CardContent, CardHeader } from "../../../components/ui/card";
import type { EventResponse } from "../../../interface/Event.interface";

const HeaderGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.3s;

    .group:hover & {
      color: hsl(var(--primary));
    }
  }

  .price {
    color: hsl(var(--primary));
    font-weight: 700;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  text-decoration: none;
  transition: all 0.2s;

  &.map-link:hover {
    color: hsl(var(--primary));
    cursor: pointer;

    svg {
      transform: translateY(-2px);
    }
  }

  &.italic {
    font-style: italic;
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: hsl(var(--primary));
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ProgressContainer = styled.div`
  padding-top: 1rem;
  border-top: 1px solid hsl(var(--muted) / 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
  font-weight: 500;
`;

const ProgressTrack = styled.div`
  width: 6rem;
  height: 0.375rem;
  background-color: hsl(var(--secondary));
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  background-color: hsl(var(--primary));
  transition: all 1s duration;
  width: ${(props) => props.$progress}%;
`;

export interface EventCardDetailsProps {
  event: EventResponse;
}

export function EventCardDetails({
  event,
}: EventCardDetailsProps): JSX.Element {
  return (
    <>
      <CardHeader className="p-5 pb-2">
        <HeaderGroup>
          <h3>{event.title}</h3>
          <div className="price">&#8369;999+</div>
        </HeaderGroup>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        <div className="space-y-2">
          <InfoRow className="italic">
            <Calendar />
            {format(new Date(event.date), "PPP")}
          </InfoRow>
          <InfoRow
            as="a"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.venueAddress || ""}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            <MapPin />
            <span>{event.venue || "TBA"}</span>
          </InfoRow>
        </div>

        <ProgressContainer>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>
              {event.ticketsSold} / {event.capacity} Attendees
            </span>
          </div>
          <ProgressTrack>
            <ProgressBar
              $progress={Math.min(
                (event.ticketsSold / event.capacity) * 100,
                100,
              )}
            />
          </ProgressTrack>
        </ProgressContainer>
      </CardContent>
    </>
  );
}

EventCardDetails.displayName = "EventCard.Details";
