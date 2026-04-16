import { Outlet } from "react-router-dom";
import { UserNavbar } from "../organisms/UserNavbar";
import Footer from "../organisms/Footer";
export function UserLayout() {
  return (
    <div className="h-[100dvh] overflow-hidden bg-blue flex flex-col bg-background">
      <UserNavbar />
      <main className="flex-1 overflow-y-auto ">
        <Outlet />
        {/* Simple Footer for User Dashboard - Now inside scrollable main */}
        <Footer />
      </main>
    </div>
  );
}
