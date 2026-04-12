import { Bell, Search, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface HeaderProps {
	onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	return (
		<header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
			<div className="flex items-center gap-4">
				<Button 
					variant="ghost" 
					size="icon" 
					className="lg:hidden hover:bg-primary/10 hover:text-primary transition-colors"
					onClick={onMenuClick}
				>
					<Menu className="w-5 h-5" />
				</Button>
				<div className="hidden md:flex items-center relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<input
						type="search"
						placeholder="Search events, users..."
						className="pl-9 h-10 w-64 lg:w-96 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
			</div>

			<div className="flex items-center gap-2 md:gap-4">
				<div className="relative">
					<Button variant="ghost" size="icon">
						<Bell className="w-5 h-5" />
					</Button>
					<Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-[10px]">
						12
					</Badge>
				</div>
			</div>
		</header>
	);
}
