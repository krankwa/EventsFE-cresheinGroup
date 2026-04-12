import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AdminLayout } from "./components/templates/AdminLayout";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { LoginPage } from "./pages/LoginPage";
import { LandingPage } from "./pages/LandingPage";
import { ProtectedRoute } from "./components/molecules/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { EventsPage } from "./pages/EventsPage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { UserLayout } from "./components/templates/UserLayout";
import { UnauthorizePage } from "./pages/UnauthorizePage";

function RoleRedirect() {
	const { user, loading } = useAuth();

	if (loading) return null;
	if (!user) return <Navigate to="/login" replace />;

	if (user.role === "Admin") {
		return <Navigate to="/admin" replace />;
	}
	return <Navigate to="/events" replace />;
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<Toaster position="top-right" />
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<LoginPage />} />
					{/* Post-login role redirect */}
					<Route path="/redirect" element={<RoleRedirect />} />

					{/* Protected Admin Routes */}
					<Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
						<Route element={<AdminLayout />}>
							<Route index element={<DashboardOverview />} />
							<Route path="events" element={<EventsManagement />} />
							<Route path="users" element={<UsersManagement />} />
						</Route>
					</Route>

					{/* Protected User Routes */}
					<Route element={<ProtectedRoute allowedRoles={["Admin", "User"]} />}>
						<Route element={<UserLayout />}>
							<Route path="/events" element={<EventsPage />} />
							<Route path="/tickets" element={<MyTicketsPage />} />
						</Route>
					</Route>

					<Route path="/unauthorize" element={<UnauthorizePage />} />

					{/* Fallback */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}

export default App;
