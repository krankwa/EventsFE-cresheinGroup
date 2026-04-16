import { lazy, Suspense, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useNavigate 
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AdminLayout } from "./components/templates/AdminLayout";
import { UserLayout } from "./components/templates/UserLayout";
import { ProtectedRoute } from "./components/molecules/ProtectedRoute";
import { ConfirmProvider } from "./components/ui/confirm-context";
import { useUser } from "./features/authentication/useUser";

// Lazy-loaded pages
const DashboardOverview = lazy(() =>
  import("./pages/admin/DashboardOverview").then((m) => ({
    default: m.DashboardOverview,
  })),
);
const EventsManagement = lazy(() =>
  import("./pages/admin/EventsManagement").then((m) => ({
    default: m.EventsManagement,
  })),
);
const UsersManagement = lazy(() =>
  import("./pages/admin/UsersManagement").then((m) => ({
    default: m.UsersManagement,
  })),
);
const TicketManagement = lazy(() =>
  import("./pages/admin/TicketManagement").then((m) => ({
    default: m.TicketManagement,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const ForgotPassword = lazy(() =>
  import("./pages/ForgotPassword").then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import("./pages/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const EventsPage = lazy(() =>
  import("./pages/EventsPage").then((m) => ({ default: m.EventsPage })),
);
const MyTicketsPage = lazy(() =>
  import("./pages/MyTicketsPage").then((m) => ({ default: m.MyTicketsPage })),
);
const MyAccount = lazy(() => import("./pages/MyAccount"));
const EventDetail = lazy(() =>
  import("./pages/EventDetail").then((m) => ({ default: m.EventDetail })),
);
const TicketRedemptionPage = lazy(() =>
  import("./pages/TicketRedemptionPage").then((m) => ({
    default: m.TicketRedemptionPage,
  })),
);
const UserDashboard = lazy(() =>
  import("./pages/UserDashboard").then((m) => ({
    default: m.UserDashboard,
  })),
);
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

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
  return <Navigate to="/dashboard" replace />;
}

/**
 * Automatically redirects the browser to the lowercase version of the URL
 * if any uppercase characters are detected in the path.
 */
function UrlLowercaseRedirect() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname !== pathname.toLowerCase()) {
      navigate(pathname.toLowerCase() + search, { replace: true });
    }
  }, [pathname, search, navigate]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <Router>
          <UrlLowercaseRedirect />
          <Toaster position="top-right" />
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              {/* Post-login role redirect */}
              <Route path="/redirect" element={<RoleRedirect />} />

              {/* Protected Admin/Staff Dashboard Routes */}
              <Route
                element={<ProtectedRoute allowedRoles={["Admin", "Staff"]} />}
              >
                <Route element={<AdminLayout />}>
                  <Route
                    path="/redemption"
                    element={<TicketRedemptionPage />}
                  />

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
                element={<ProtectedRoute allowedRoles={["Admin", "User"]} />}
              >
                <Route element={<UserLayout />}>
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/myaccount" element={<MyAccount />} />
                  <Route path="/tickets" element={<MyTicketsPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ConfirmProvider>
    </QueryClientProvider>
  );
}

export default App;
