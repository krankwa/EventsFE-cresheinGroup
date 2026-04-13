import { useNavigate } from "react-router-dom";
import { Zap, Ticket, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { HeroSection as Hero } from "../../components/organisms/HeroSection";

export function EventsHero() {
  const navigate = useNavigate();

  return (
    <Hero>
      <Hero.Background />

      <Hero.Container>
        <Hero.Badge>
          <Zap className="w-3.5 h-3.5" />
          Discover Live Events Near You
        </Hero.Badge>

        <Hero.Title>
          Your Next{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unforgettable
          </span>{" "}
          Experience Awaits
        </Hero.Title>

        <Hero.Subtitle>
          Browse hundreds of events — concerts, conferences, sports, and more.
          Secure your tickets in seconds.
        </Hero.Subtitle>

        <Hero.Actions>
          <Button
            size="lg"
            className="text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            onClick={() => {
              document
                .getElementById("events-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Ticket className="w-5 h-5" />
            Browse Events
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base font-semibold gap-2 hover:scale-105 transition-transform"
            onClick={() => navigate("/login")}
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Hero.Actions>
      </Hero.Container>
    </Hero>
  );
}
