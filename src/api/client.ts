import { ApiError } from "../types/api.types";

// Update this to match your specific backend URL port
const API_BASE_URL = "https://localhost:7080/api";

export async function apiRequest<T>(
  endpoint: string,
  options: { method: string; requiresAuth?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // (Optional: add your token fetching logic here as shown in Step 3 of the guide)

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method,
    headers,
  });

  if (!response.ok) {
    const problem = await response.json();
    throw new ApiError(problem);
  }

  return response.json() as Promise<T>;
}
