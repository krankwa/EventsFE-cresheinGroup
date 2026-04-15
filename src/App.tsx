import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "./components/templates/AdminLayout";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { LoginPage } from "./pages/LoginPage";
import { LandingPage } from "./pages/LandingPage";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { ProtectedRoute } from "./components/molecules/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { EventsPage } from "./pages/EventsPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import MyAccount from "./pages/MyAccount";
import { EventDetail } from "./pages/EventDetail";
import { TicketRedemptionPage } from "./pages/TicketRedemptionPage";
import { UserLayout } from "./components/templates/UserLayout";
import { useUser } from "./features/authentication/useUser";
import { TicketManagement } from "./pages/admin/TicketManagement";
import { ConfirmProvider } from "./components/ui/confirm-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function RoleRedirect() {
  const { user, isLoading } = useUser();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role.toLowerCase();

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (role === "staff") {
    return <Navigate to="/redemption" replace />;
  }
  return <Navigate to="/events" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Post-login role redirect */}
            <Route path="/redirect" element={<RoleRedirect />} />

            {/* Protected Admin/Staff Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={["Admin", "Staff"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/redemption" element={<TicketRedemptionPage />} />

                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/admin">
                    <Route index element={<DashboardOverview />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="settings" element={<MyAccount />} />
                    <Route path="tickets" element={<TicketManagement />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            {/* Protected User Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["Admin", "User"]} />
              }
            >
              <Route element={<UserLayout />}>
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/myaccount" element={<MyAccount />} />
                <Route path="/tickets" element={<MyTicketsPage />} />
              </Route>
            </Route>





            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ConfirmProvider>
    </QueryClientProvider>
  );
}

export default App;
