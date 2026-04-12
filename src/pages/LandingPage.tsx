import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	MapPin,
	Users,
	ArrowRight,
	Loader2,
	Ticket,
	CalendarDays,
	Zap,
} from "lucide-react";
import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { eventsService } from "../services/eventsService";
import { ticketsService } from "../services/ticketsService";
import { useAuth } from "../hooks/useAuth";
import type { EventResponse } from "../types/Event.types";
import { toast } from "react-hot-toast";
import { PublicNavbar } from "../components/organisms/PublicNavbar";

// ─── Compact Event Card for Landing Page ────────────────────────────────────
function LandingEventCard({ event }: { event: EventResponse }) {
	const { user, isAdmin } = useAuth();
	const navigate = useNavigate();
	const [isBooking, setIsBooking] = useState(false);
	const isSoldOut = event.ticketsSold >= event.capacity;
	const fillPct = Math.min((event.ticketsSold / event.capacity) * 100, 100);

	const handleBook = async () => {
		if (!user) {
			toast("Please sign in to book tickets.", { icon: "🎟️" });
			navigate("/login");
			return;
		}
		if (isAdmin) {
			toast.error("Admins cannot book tickets.");
			return;
		}
		setIsBooking(true);
		try {
			await ticketsService.register({ eventId: event.eventID! });
			toast.success(`Booked for ${event.title}! 🎉`);
			navigate("/tickets");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to book ticket.";
			toast.error(msg);
		} finally {
			setIsBooking(false);
		}
	};

	return (
		<Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-muted/40 bg-card/60 backdrop-blur-sm">
			{/* Cover Image */}
			<div className="relative h-44 overflow-hidden">
				{event.coverImageUrl ? (
					<img
						src={event.coverImageUrl}
						alt={event.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
						<CalendarDays className="w-12 h-12 text-primary/30" />
					</div>
				)}
				<div className="absolute top-3 left-3">
					<Badge className="bg-background/80 backdrop-blur-md text-foreground border-none shadow-lg text-xs">
						Upcoming
					</Badge>
				</div>
				{isSoldOut && (
					<div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
						<Badge
							variant="destructive"
							className="px-4 py-1 text-sm font-bold uppercase tracking-wider"
						>
							Sold Out
						</Badge>
					</div>
				)}
			</div>

			<CardHeader className="px-5 pt-5 pb-2">
				<div className="flex justify-between items-start gap-2">
					<h3 className="text-lg font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
						{event.title}
					</h3>
					<span className="text-primary font-bold text-sm whitespace-nowrap">
						₱999+
					</span>
				</div>
			</CardHeader>

			<CardContent className="px-5 pb-0 space-y-2">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
					<span className="italic truncate">
						{format(new Date(event.date), "PPP")}
					</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
					<span className="truncate">{event.venue}</span>
				</div>

				{/* Capacity bar */}
				<div className="pt-3 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-1.5">
						<Users className="w-3 h-3" />
						<span>
							{event.ticketsSold} / {event.capacity}
						</span>
					</div>
					<div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-1000 rounded-full"
							style={{ width: `${fillPct}%` }}
						/>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-5 pt-4">
				<Button
					className="w-full gap-2 font-semibold group/btn"
					variant={isSoldOut ? "outline" : "default"}
					disabled={isSoldOut || isBooking}
					onClick={handleBook}
				>
					{isBooking ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Booking...
						</>
					) : isSoldOut ? (
						"Sold Out"
					) : !user ? (
						<>
							Sign In to Book
							<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
						</>
					) : (
						<>
							Book Now
							<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
						</>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}

// ─── Landing Page ─────────
export function LandingPage() {
	const [events, setEvents] = useState<EventResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		eventsService
			.getAll()
			.then((data) => setEvents(data))
			.catch((err) => console.error("Failed to load events:", err))
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<PublicNavbar />

			{/* ── Hero Section ── */}
			<section className="relative overflow-hidden py-20 md:py-32 px-4">
				{/* Decorative blobs */}
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-48 pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-32 pointer-events-none" />

				<div className="container mx-auto text-center relative z-10 max-w-3xl">
					{/* Pill badge */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-pulse">
						<Zap className="w-3.5 h-3.5" />
						Discover Live Events Near You
					</div>

					<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
						Your Next{" "}
						<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Unforgettable
						</span>{" "}
						Experience Awaits
					</h1>

					<p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
						Browse hundreds of events — concerts, conferences, sports, and more.
						Secure your tickets in seconds.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
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
					</div>
				</div>
			</section>

			{/* ── Events Grid ── */}
			<section id="events-section" className="container mx-auto px-4 pb-24">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							Upcoming Events
						</h2>
						<p className="text-muted-foreground mt-1">
							Book your spot before they sell out
						</p>
					</div>
					{events.length > 0 && (
						<Badge variant="secondary" className="text-sm px-3 py-1">
							{events.length} Events
						</Badge>
					)}
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="space-y-3">
								<Skeleton className="h-44 w-full rounded-xl" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
					</div>
				) : events.length === 0 ? (
					<div className="py-24 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
						<CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
						<p className="text-xl font-medium">No events yet</p>
						<p className="text-sm mt-1">
							Check back soon for exciting upcoming events!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{events.map((event) => (
							<LandingEventCard key={event.eventID} event={event} />
						))}
					</div>
				)}
			</section>

			{/* Footer */}
			<footer className="py-8 border-t bg-muted/20 mt-auto">
				<div className="container mx-auto px-4 text-center">
					<p className="text-sm text-muted-foreground font-medium">
						© 2026 EventTix — The Premier Event Management Platform
					</p>
				</div>
			</footer>
		</div>
	);
}
