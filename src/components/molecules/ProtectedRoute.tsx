import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../features/authentication/useUser";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Smart Redirection: If authenticated but role not allowed, send to their "Home"
  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === user.role.toLowerCase())) {
    if (user.role === "Admin") return <Navigate to="/admin" replace />;
    if (user.role === "Staff") return <Navigate to="/redemption" replace />;
    return <Navigate to="/events" replace />;
  }

  return <Outlet />;
}
