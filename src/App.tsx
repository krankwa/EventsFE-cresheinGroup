import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import { EventsPage } from "./pages/EventsPage";
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
					<Route path="/login" element={<LoginPage />} />
					<Route path="/" element={<RoleRedirect />} />

					{/* Protected Admin Routes */}
					<Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]} />}>
						<Route element={<AdminLayout />}>
							<Route index element={<DashboardOverview />} />
							<Route path="events" element={<EventsManagement />} />
							<Route path="users" element={<UsersManagement />} />
						</Route>
					</Route>

					{/* Protected User Routes */}
					<Route path="/events" element={<ProtectedRoute allowedRoles={["Admin", "User"]} />}>
						<Route index element={<EventsPage />} />
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
