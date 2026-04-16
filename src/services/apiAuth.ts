import { apiRequest } from "./client";
import { setToken, clearToken, getToken } from "./authStore";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
} from "../interface/Auth.interface";
import type { ApiError } from "../interface/api.interface";

// POST /api/auth/login
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/auth/login", {
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
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// GET /api/users/me
export async function getCurrentUser(): Promise<UserResponse | null> {
  if (!getToken()) return null;

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

const API_BASE_URL = import.meta.env.VITE_BACKEND_API as string;

export async function makeApiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: string;
    requiresAuth?: boolean;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.requiresAuth !== false) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    ...(options.body ? { body: options.body } : {}),
  });

  if (response.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  if (response.status === 204) return null as T;

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({}));
    throw new Error(
      error.message ?? error.title ?? `Request failed (${response.status})`,
    );
  }

  return response.json();
}
