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

import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./components/molecules/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useUser } from "./features/authentication/useUser";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import MyAccount from "./pages/MyAccount";
import { EventDetail } from "./pages/EventDetail";
import { EventsPage } from "./pages/EventsPage";

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

  if (user.role === "Admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/events" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Post-login role redirect */}
          <Route path="/redirect" element={<RoleRedirect />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Post-login role redirect */}
          <Route path="/redirect" element={<RoleRedirect />} />

          <Route path="/myaccount" element={<MyAccount />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="users" element={<UsersManagement />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />


        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;