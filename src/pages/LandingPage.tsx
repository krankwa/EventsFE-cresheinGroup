import { PublicNavbar } from "../components/organisms/PublicNavbar";
import Footer from "../components/organisms/Footer";
import { EventsHero } from "../features/events/EventsHero";
import { EventsSection } from "../features/events/EventsSection";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <EventsHero />

      <EventsSection id="events-section">
        <EventsSection.Header />
        <EventsSection.Grid />
      </EventsSection>

      <Footer />
    </div>
  );
}
