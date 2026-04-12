import { useEffect, useState } from "react";
import { Plus, TrendingUp, CalendarDays, Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "../../components/ui/card";
import { StatsGrid } from "../../components/organisms/StatsGrid";
import { dashboardService, type DashboardStats } from "../../services/dashboardService";
import { format } from "date-fns";

export function DashboardOverview() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadDashboardData() {
			try {
				const data = await dashboardService.getStats();
				setStats(data);
			} catch (error) {
				console.error("Failed to load dashboard data", error);
			} finally {
				setLoading(false);
			}
		}
		loadDashboardData();
	}, []);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Here's what's happening with your events today.
					</p>
				</div>

			</div>

			<StatsGrid />

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
						<CardDescription>
							{stats ? `You have sold ${stats.totalTicketsSold.toLocaleString()} tickets in total.` : "Loading sales data..."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
							<TrendingUp className="w-12 h-12 mb-4 opacity-20" />
							<p className="text-sm font-medium">Sales Charting coming soon</p>
							<p className="text-xs opacity-60">Visualizing your growth trends</p>
						</div>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Top Performing Events</CardTitle>
						<CardDescription>Based on ticket conversion rates.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{loading ? (
							<div className="flex items-center justify-center py-10">
								<Loader2 className="w-8 h-8 animate-spin text-primary/40" />
							</div>
						) : stats?.topEvents && stats.topEvents.length > 0 ? (
							stats.topEvents.map((event) => (
								<div key={event.eventID} className="flex items-center gap-4 group cursor-default">
									<div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
										{event.coverImageUrl ? (
											<img
												src={event.coverImageUrl}
												alt={event.title}
												className="w-full h-full object-cover transition-transform group-hover:scale-110"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<CalendarDays className="w-5 h-5 text-muted-foreground/40" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold truncate leading-none mb-1">
											{event.title}
										</p>
										<p className="text-xs text-muted-foreground">
											{format(new Date(event.date), "MMM dd, yyyy")}
										</p>
									</div>
									<div className="text-right">
										<div className="text-sm font-bold text-emerald-600">
											₱{(event.tiers?.reduce((acc, t) => acc + (t.ticketsSold * t.price), 0) ?? 0).toLocaleString()}
										</div>
										<p className="text-[10px] text-muted-foreground font-medium">
											{event.ticketsSold} sold
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
								<p className="text-sm">No event data available yet.</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
