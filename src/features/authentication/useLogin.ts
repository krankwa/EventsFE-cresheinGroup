import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../services/apiAuth";
import type { LoginRequest } from "../../interface/auth.interface";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),

    onSuccess: () => {
      //returns token and message
      //Invalidate para mo getCurrentUser() and fetch from GET /api/users/me
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard", { replace: true });
    },

    onError: (err: Error) => {
      toast.error(err.message || "Invalid email or password");
    },
  });

  return { login, isPending };
}
