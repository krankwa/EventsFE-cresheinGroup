// Authentication state management.
// Tokens are now stored in HttpOnly cookies and managed by the browser.

export function getToken(): string | null {
  // We no longer retrieve the token from JS for security reasons.
  // The browser automatically attaches the 'AuthToken' cookie to requests.
  return null;
}

export function setToken(_token: string): void {
  // No-op: Token is set via Set-Cookie header from the server.
  // We can store a flag to indicate we are logged in for UI purposes.
  localStorage.setItem("isLoggedIn", "true");
}

export function clearToken(): void {
  // No-op: Token is removed via Delete-Cookie header during logout.
  localStorage.removeItem("isLoggedIn");
}

export function isAuthenticated(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}