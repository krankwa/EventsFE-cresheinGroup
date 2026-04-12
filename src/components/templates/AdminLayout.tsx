import { Outlet } from "react-router-dom";
import { Sidebar } from "../organisms/AdminSidebar";
import { Header } from "../organisms/Header";

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <Sidebar className="hidden lg:flex" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - consistently shown */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
