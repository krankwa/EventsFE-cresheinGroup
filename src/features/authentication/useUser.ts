import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import type { UserResponse, UserRole } from "../../types/Auth.types";

interface UseUserReturn {
  isLoading: boolean;
  user: UserResponse | null | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: UserRole | undefined;
}

export function useUser(): UseUserReturn {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false, //stop retrying 401s
    staleTime: 1000 * 60 * 3, // 3 min revalidation
  });

  return {
    isLoading,
    user: user ?? null,
    isAuthenticated: !!user,
    isAdmin: user?.role === "Admin",
    role: user?.role,
  };
}
