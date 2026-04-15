import { PublicNavbar } from "../components/organisms/PublicNavbar";
import { LandingSection } from "../features/public/LandingSection";

export function LandingPage() {
  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col bg-background">
      <PublicNavbar />
      <main className="flex-1 overflow-y-auto">
        <LandingSection />
      </main>
    </div>
  );
}
