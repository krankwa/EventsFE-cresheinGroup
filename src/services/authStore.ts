// Authentication state management.
// Reverted to localStorage for standard JWT authentication headers.

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");
}

export function clearToken(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token") || localStorage.getItem("isLoggedIn") === "true";
}