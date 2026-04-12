// Session-surviving token store using sessionStorage.
// Persists across page refreshes within the same tab, clears when tab closes.

export function getToken(): string | null {
  return sessionStorage.getItem("token");
}

export function setToken(token: string): void {
  sessionStorage.setItem("token", token);
}

export function clearToken(): void {
  sessionStorage.removeItem("token");
}
