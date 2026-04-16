import { clearToken, getToken } from "./authStore";
import type { ApiError } from "../interface/api.interface";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_API as string;

interface ApiRequestOptions {
  method: string;
  body?: string;
  requiresAuth?: boolean;
  params?: Record<string, unknown>; // Add this
  headers?: Record<string, string>; // Add headers property
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tunnel-Skip-AntiPhishing": "true", // Bypass MS Dev Tunnel landing page
    ...(options.headers || {}),
  };

  // Attach Authorization header if required
  if (options.requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    credentials: "include", // Required to send/receive HttpOnly cookies
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
