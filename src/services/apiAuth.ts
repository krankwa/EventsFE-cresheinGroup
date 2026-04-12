import { apiFetch } from "./api";
import { setToken, clearToken, getToken } from "./authStore";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from "../types/Auth.types";

// POST /api/auth/login
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  setToken(data.token);
  return data;
}

// POST /api/auth/register
export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// GET /api/users/me
export async function getCurrentUser(): Promise<UserResponse | null> {
  if (!getToken()) return null;

  try {
    return await apiFetch<UserResponse>("/users/me");
  } catch {
    clearToken();
    return null;
  }
}

// POST /api/auth/logout
export async function logout(): Promise<void> {
  try {
    await apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}
