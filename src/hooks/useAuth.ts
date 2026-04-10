import { createContext, useContext } from "react";
import type { UserResponse } from "../types/Auth.types";

export interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
