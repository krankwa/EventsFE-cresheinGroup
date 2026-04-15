import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import type { UserResponse, UserRole } from "../../interface/Auth.interface";

interface UseUserReturn {
  isLoading: boolean;
  user: UserResponse | null | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  role: UserRole | undefined;
}

export function useUser(): UseUserReturn {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false, // stop retrying 401s
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Check every 2 minutes
    refetchOnWindowFocus: true,
  });

  return {
    isLoading: isLoading,
    user: user ?? null,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin",
    isStaff: user?.role === "Staff",
    role: user?.role,
  };
}
