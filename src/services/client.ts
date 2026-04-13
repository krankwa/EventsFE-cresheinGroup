import { getToken } from "./authStore";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API as string;
console.log("API_BASE_URL in client.ts:", API_BASE_URL);

export async function apiRequest<T>(
  endpoint: string,
  options: { method: string; body?: string; requiresAuth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.requiresAuth !== false) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method,
    headers,
    body: options.body,
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const problem = await response.json();
        errorMessage = problem.message || problem.title || errorMessage;
      }
    } catch {
      // Fallback to status text if JSON parse fails
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }
  return {} as T;
}
