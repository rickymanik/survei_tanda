import { apiRequest } from ".";

export function getRewards() {
  return apiRequest("/rewards");
}

export function createRedemption(payload: unknown) {
  return apiRequest("/redemptions", {
    method: "POST",
    body: JSON.stringify({ redemption: payload })
  });
}
