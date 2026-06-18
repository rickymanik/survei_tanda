import { apiRequest } from ".";

export function getSurveys() {
  return apiRequest("/surveys");
}

export function createSurvey(payload: unknown) {
  return apiRequest("/surveys", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
