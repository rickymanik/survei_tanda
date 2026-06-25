import { createResponse, createSurvey as createSurveyWithOwner, deleteSurvey, loadDataAplikasi } from "./client";

export function getSurveys() {
  return loadDataAplikasi().then((data) => data.surveys);
}

export function createSurvey(ownerId: string, payload: Parameters<typeof createSurveyWithOwner>[1]) {
  return createSurveyWithOwner(ownerId, payload);
}

export const removeSurvey = deleteSurvey;
export const submitResponse = createResponse;
