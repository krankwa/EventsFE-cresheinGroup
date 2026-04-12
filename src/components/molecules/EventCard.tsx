import { useState } from "react";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { EventResponse } from "../../types/Event.types";
import { useUser } from "../../features/authentication/useUser";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { TicketBookingDialog } from "../organisms/TicketBookingDialog";

interface EventCardProps {
	event: EventResponse;
}

export function EventCard({ event }: EventCardProps) {
	const { user, isAdmin } = useUser();
	const navigate = useNavigate();
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

	const isSoldOut = event.ticketsSold >= event.capacity;

	const handleBookTicket = () => {
		if (!user) {
			toast.error("Please log in to book tickets.");
			navigate("/login");
			return;
		}

		if (isAdmin) {
			toast.error("Admins cannot book tickets.");
			return;
		}

		setIsBookingModalOpen(true);
	};

	const minPrice =
		event.tiers && event.tiers.length > 0
			? Math.min(...event.tiers.map((t) => t.price))
			: 0;

	return (
		<Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-muted/40 bg-card/50 backdrop-blur-sm">
			<div className="relative h-48 overflow-hidden">
				{event.coverImageUrl ? (
					<img
						src={event.coverImageUrl}
						alt={event.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full bg-primary/10 flex items-center justify-center">
						<Calendar className="w-12 h-12 text-primary/40" />
					</div>
				)}
				<div className="absolute top-4 left-4">
					<Badge className="bg-background/80 backdrop-blur-md text-foreground border-none hover:bg-background/90 shadow-lg">
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

			<CardHeader className="p-5 pb-2">
				<div className="flex justify-between items-start gap-2">
					<h3 className="text-xl font-bold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
						{event.title}
					</h3>
					<div className="text-primary font-bold line-clamp-1">
						{minPrice > 0 ? `₱${minPrice}+` : "Free"}
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-5 pt-0 space-y-4">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm text-muted-foreground italic">
						<Calendar className="w-4 h-4 text-primary" />
						{format(new Date(event.date), "PPP")}
					</div>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="w-4 h-4 text-primary" />
						<span className="truncate">{event.venue}</span>
					</div>
				</div>

				<div className="pt-4 border-t border-muted/50 flex items-center justify-between text-xs text-muted-foreground font-medium">
					<div className="flex items-center gap-1.5">
						<Users className="w-3.5 h-3.5" />
						<span>
							{event.ticketsSold} / {event.capacity} Attendees
						</span>
					</div>
					<div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-1000"
							style={{
								width: `${Math.min((event.ticketsSold / event.capacity) * 100, 100)}%`,
							}}
						/>
					</div>
				</div>
			</CardContent>

			<CardFooter className="p-5 pt-0">
				<Button
					className="w-full gap-2 group/btn font-semibold"
					variant={isSoldOut ? "outline" : "default"}
					disabled={isSoldOut}
					onClick={handleBookTicket}
				>
					{isSoldOut ? (
						"Notify Me"
					) : (
						<>
							Book Tickets
							<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
						</>
					)}
				</Button>
			</CardFooter>

			<TicketBookingDialog
				isOpen={isBookingModalOpen}
				onClose={() => setIsBookingModalOpen(false)}
				event={event}
				onSuccess={() => navigate("/tickets")}
			/>
		</Card>
	);
}
