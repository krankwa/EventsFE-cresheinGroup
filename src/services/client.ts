import { getToken, clearToken } from "./authStore";
import type { ApiError } from "../interface/api.interface";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API as string;

export async function apiRequest<T>(
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
