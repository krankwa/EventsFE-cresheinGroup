import { Outlet } from "react-router-dom";
import { UserNavbar } from "../organisms/UserNavbar";

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UserNavbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      
      {/* Simple Footer for User Dashboard */}
      <footer className="py-8 border-t bg-muted/20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 EventTix - The Premier Event Management Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
