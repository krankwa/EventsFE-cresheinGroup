import type { JSX } from "react";
import styled from "styled-components";
import { Calendar } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

const ImageContainer = styled.div`
  position: relative;
  height: 12rem;
  overflow: hidden;

  &:hover img {
    transform: scale(1.1);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s duration;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: hsl(var(--primary) / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 3rem;
    height: 3rem;
    color: hsl(var(--primary) / 0.4);
  }
`;

const TopLeftBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;

  .badge {
    background-color: hsl(var(--background) / 0.8);
    backdrop-filter: blur(12px);
    color: hsl(var(--foreground));
    border: none;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: hsl(var(--background) / 0.9);
    }
  }
`;

const SoldOutOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: hsl(var(--background) / 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;

  .badge {
    padding: 0.25rem 1rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export interface EventCardImageProps {
  imageUrl?: string | null;
  title: string;
  isSoldOut: boolean;
}

export function EventCardImage({ imageUrl, title, isSoldOut }: EventCardImageProps): JSX.Element {
  return (
    <ImageContainer>
      {imageUrl ? (
        <EventImage src={imageUrl} alt={title} />
      ) : (
        <PlaceholderImage>
          <Calendar />
        </PlaceholderImage>
      )}
      <TopLeftBadge>
        <Badge className="badge">Upcoming</Badge>
      </TopLeftBadge>
      {isSoldOut && (
        <SoldOutOverlay>
          <Badge variant="destructive" className="badge">
            Sold Out
          </Badge>
        </SoldOutOverlay>
      )}
    </ImageContainer>
  );
}

EventCardImage.displayName = "EventCard.Image";
