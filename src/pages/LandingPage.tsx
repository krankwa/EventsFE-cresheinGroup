import { PublicNavbar } from "../components/organisms/PublicNavbar";
import { LandingSection } from "../features/public/LandingSection";

export function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />
			<LandingSection />
		</div>
	);
}
