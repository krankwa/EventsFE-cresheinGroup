import { NavLink } from "react-router-dom";
import { CalendarDays, LogOut, ShieldCheck, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../ui/badge";

import { NAV_ITEMS } from "../../features/admin/constants";

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: SidebarProps) {
	const { user, isAdmin, logout } = useAuth();

	return (
		<aside
			className={cn(
				"w-64 border-r bg-background flex flex-col h-screen",
				className,
			)}
		>
			<div className="p-6 border-b flex items-center gap-2">
				<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
					<CalendarDays className="text-primary-foreground w-5 h-5" />
				</div>
				<span className="font-bold text-xl tracking-tight">EventTix</span>
			</div>

			<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
				{NAV_ITEMS.map((item) => (
					<NavLink
						key={item.href}
						to={item.href}
						end={item.href === "/admin"}
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
								isActive
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground",
							)
						}
					>
						<item.icon className="w-4 h-4" />
						{item.label}
					</NavLink>
				))}
			</nav>

			<div className="p-4 border-t space-y-4 bg-muted/5">
				{user && (
					<div className="px-3 pb-2 space-y-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-background shadow-sm">
								<User className="w-5 h-5" />
							</div>
							<div className="flex-1 overflow-hidden">
								<p className="text-sm font-semibold truncate leading-none mb-1">
									{user.name}
								</p>
								<p className="text-[10px] text-muted-foreground truncate leading-none">
									{user.email}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={isAdmin ? "default" : "secondary"}
								className="h-5 text-[10px] uppercase font-bold tracking-widest gap-1 py-0 px-2 leading-none"
							>
								{isAdmin ? (
									<ShieldCheck className="w-2.5 h-2.5" />
								) : (
									<User className="w-2.5 h-2.5" />
								)}
								{user.role}
							</Badge>
						</div>
					</div>
				)}

				<div className="space-y-1">
					<div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
						Session
					</div>
					<button
						onClick={logout}
						className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive transition-all hover:bg-destructive/10 hover:pl-4 group"
					>
						<LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
						Sign Out
					</button>
				</div>
			</div>
		</aside>
	);
}
