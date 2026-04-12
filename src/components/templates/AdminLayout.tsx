import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../organisms/Sidebar";
import { Header } from "../organisms/Header";
import { cn } from "../../lib/utils";

export function AdminLayout() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="flex h-screen overflow-hidden bg-muted/30 relative">
			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div 
					className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Mobile Sidebar Drawer */}
			<Sidebar 
				className={cn(
					"fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out",
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				)} 
				onClose={() => setIsMobileMenuOpen(false)}
			/>

			{/* Sidebar - hidden on mobile, shown on desktop */}
			<Sidebar className="hidden lg:flex" />

			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Header - consistently shown */}
				<Header onMenuClick={() => setIsMobileMenuOpen(true)} />

				{/* Dynamic Content Area */}
				<main className="flex-1 p-4 md:p-8 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
