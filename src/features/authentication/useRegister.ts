import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../../services/apiAuth";
import type { RegisterRequest } from "../../interface/auth.interface";
import toast from "react-hot-toast";

export function useRegister() {
  const { mutate: register, isPending } = useMutation({
    mutationFn: (request: RegisterRequest) => registerApi(request),

    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
    },

    onError: (err: Error) => {
      toast.error(err.message || "Registration failed");
    },
  });

  return { register, isPending };
}
