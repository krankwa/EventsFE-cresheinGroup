import { useEffect, useState } from "react";
import { eventsService } from "../api/eventsService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { EventDTO } from "@/interface/Event";

// Fallback placeholder image if event has no image
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/1a1a1a/ffffff?text=Event";

// Helper: format date into { month: "SEP", day: "20" }
function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    time: date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

// Helper: group events by "Month Year"
function groupByMonth(events: EventDTO[]) {
  return events.reduce<Record<string, EventDTO[]>>((acc, event) => {
    const label = new Date(event.date).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[label]) acc[label] = [];
    acc[label].push(event);
    return acc;
  }, {});
}

function EventCard({ event }: { event: EventDTO }) {
  const { month, day, time } = formatEventDate(event.date);

  return (
    <Card className="relative w-full pt-0 overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 h-44 bg-black/30" />

      {/* Event image */}
      <img
        src={PLACEHOLDER_IMAGE}
        alt={event.title}
        className="relative z-0 h-44 w-full object-cover brightness-75"
      />

      {/* Date badge overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col leading-none">
        <span className="text-xs font-semibold text-white uppercase">{month}</span>
        <span className="text-4xl font-bold text-[#D4A843] leading-none">{day}</span>
      </div>

      <CardHeader className="pb-2">
        <Badge
          variant="secondary"
          className="w-fit text-[10px] tracking-widest uppercase mb-1"
        >
          {event.venue}
        </Badge>
        <CardTitle className="text-base font-bold leading-snug">
          {event.title}
        </CardTitle>
        <CardDescription>
          <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {/* Clock icon */}
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {time}
          </span>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          className="w-full font-semibold tracking-widest uppercase text-sm"
          style={{ background: "#D4A843", color: "#000" }}
        >
          Get Tickets
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EventsList() {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => {
    eventsService
      .getAll()
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-40 text-gray-400 text-sm">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-40 text-gray-400 text-sm">
        No upcoming events found.
      </div>
    );
  }

  const grouped = groupByMonth(events);
  const months = Object.keys(grouped);
  const filtered = selectedMonth === "all" ? grouped : { [selectedMonth]: grouped[selectedMonth] };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h1>

      {/* Month filter */}
      <div className="mb-8">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="all">All Dates</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Grouped event cards */}
      {Object.entries(filtered).map(([month, monthEvents]) => (
        <div key={month} className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{month}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {monthEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}