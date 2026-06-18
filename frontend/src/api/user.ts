import { apiRequest } from ".";

export function login(payload: { email: string; password: string }) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: unknown) {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify({ user: payload })
  });
}
