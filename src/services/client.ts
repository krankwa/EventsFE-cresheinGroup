import { clearToken, getToken } from "./authStore";
import type { ApiError } from "../interface/api.interface";

export const API_BASE_URL = import.meta.env.VITE_BACKEND_API as string;

interface ApiRequestOptions {
  method: string;
  body?: string;
  requiresAuth?: boolean;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

/**
 * Parses ASP.NET validation error objects into a human-readable string.
 */
function parseValidationErrors(error: ApiError): string | null {
  if (error.errors && typeof error.errors === "object") {
    const messages: string[] = [];
    Object.entries(error.errors).forEach(([field, errors]) => {
      if (Array.isArray(errors)) {
        messages.push(`${field}: ${errors.join(", ")}`);
      }
    });
    return messages.length > 0 ? messages.join(" | ") : null;
  }
  return null;
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

  if (options.requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      headers,
      credentials: "include",
      ...(options.body ? { body: options.body } : {}),
    });
  } catch (err) {
    // Detect network errors (connection refused, no internet, timeout)
    if (err instanceof TypeError || (err as Error).name === 'AbortError') {
      throw new Error("Connection failed. Please check your internet or the backend status.");
    }
    throw err;
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // Only treat as "Session Expired" if NOT on the login page.
    // On the login page, 401 usually means "Invalid Credentials".
    if (endpoint !== "/auth/login") {
      clearToken();
      throw new Error("Session expired. Please log in again.");
    }
    // For /auth/login, we fall through to let the normal error parsing handle it.
  }

  if (response.status === 204) return null as T;

  if (!response.ok) {
    let error: ApiError;
    try {
      error = await response.json();
    } catch {
      error = {};
    }

    const validationMsg = parseValidationErrors(error);
    const mainMsg = error.message ?? error.title;
    
    // Construct the most helpful message possible
    const finalMsg = 
      validationMsg ?? 
      mainMsg ?? 
      (response.status === 403 ? "You do not have permission to perform this action." : `Request failed (Code: ${response.status})`);

    throw new Error(finalMsg);
  }

  return response.json();
}
