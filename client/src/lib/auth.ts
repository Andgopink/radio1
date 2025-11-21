export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

export function clearAuthToken(): void {
  localStorage.removeItem("authToken");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function logout(): void {
  clearAuthToken();
  window.location.href = "/login";
}
