import { changeUserPassword, loginUser, registerUser, updateUserProfile } from "./client";

export function login(payload: { email: string; password: string }) {
  return loginUser(payload);
}

export function register(payload: unknown) {
  return registerUser(payload as Parameters<typeof registerUser>[0]);
}

export const updateProfile = updateUserProfile;
export const changePassword = changeUserPassword;
