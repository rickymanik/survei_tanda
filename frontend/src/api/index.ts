import { baseUrl } from "./baseUrl";

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message || payload?.errors?.join?.(", ") || "Gagal mengambil data dari API.";
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}
