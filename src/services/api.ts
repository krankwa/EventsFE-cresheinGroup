import { getToken, clearToken } from "./authStore";
import type { ApiError } from "../types/api.types";

const API_URL = import.meta.env.VITE_BACKEND_API as string;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    },
  });

  //if token expired or invalid
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  //if no content
  if (res.status === 204) return null as T;

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({}));
    throw new Error(
      error.message ?? error.title ?? `Request failed (${res.status})`,
    );
  }

  return res.json() as Promise<T>;
}
