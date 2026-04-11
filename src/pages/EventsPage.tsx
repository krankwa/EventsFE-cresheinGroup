import { EventsList } from "../Events/EventsList";

export function EventsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <EventsList />
    </div>
  );
}
