import { apiClient } from "./apiClient";

export const loginApi = async (email, password) => {
  return apiClient("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const registerApi = async (name, email, password) => {
  return apiClient("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

export const getMeApi = async () => {
  return apiClient("/api/auth/me");
};

export const refreshTokenApi = async (refreshToken) => {
  return apiClient("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
};
