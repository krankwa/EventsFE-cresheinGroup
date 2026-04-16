import { apiRequest } from "./client";
import { setToken, clearToken, isAuthenticated } from "./authStore";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from "../interface/Auth.interface";

// POST /api/auth/login
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    setToken(data.token);
  }
  return data;
}

// POST /api/auth/register
export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
  
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

// GET /api/users/me
export async function getCurrentUser(): Promise<UserResponse | null> {
  // If we don't think we are logged in, don't even try the request.
  if (!isAuthenticated()) return null;

  try {
    return await apiRequest<UserResponse>("/users/me", { method: "GET" });
  } catch {
    clearToken();
    return null;
  }
}

// POST /api/auth/logout
export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/auth/logout", { method: "POST" });
  } finally {
    clearToken();
  }
}

// POST /api/auth/forgot-password
export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// POST /api/auth/reset-password
export async function resetPassword(request: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// GET /api/auth/verify-email
export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/auth/verify-email?token=${token}`, {
    method: "GET",
  });
}
