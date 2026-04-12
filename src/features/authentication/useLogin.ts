import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getCurrentUser } from "../../services/apiAuth";
import type { LoginRequest } from "../../interface/Auth.interface";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),

    onSuccess: async () => {
      // Fetch the user explicitly to guarantee the cache is populated BEFORE navigating.
      // This prevents RoleRedirect from accessing a stale `null` cache and bouncing the user back back to login.
      await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
      });
      navigate("/redirect", { replace: true });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Invalid email or password");
    },
  });

  return { login, isPending };
}
