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
import { ProtectedRoute } from "./components/molecules/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { EventsPage } from "./pages/EventsPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import MyAccount from "./pages/MyAccount";
import { EventDetail } from "./pages/EventDetail";
import { TicketRedemptionPage } from "./pages/TicketRedemptionPage";
import { UserLayout } from "./components/templates/UserLayout";
import { useUser } from "./features/authentication/useUser";

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
	if (user.role === "Staff") {
		return <Navigate to="/redemption" replace />;
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

					{/* Protected Admin/Staff Dashboard Routes */}
					<Route element={<ProtectedRoute allowedRoles={["Admin", "Staff"]} />}>
						<Route element={<AdminLayout />}>
							<Route path="/admin">
								<Route index element={<DashboardOverview />} />
								<Route path="events" element={<EventsManagement />} />
								<Route path="users" element={<UsersManagement />} />
							</Route>
							<Route path="/redemption" element={<TicketRedemptionPage />} />
						</Route>
					</Route>

					{/* Protected User Routes */}
					<Route element={<ProtectedRoute allowedRoles={["Admin", "User", "Staff"]} />}>
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
		</QueryClientProvider>
	);
}

export default App;
