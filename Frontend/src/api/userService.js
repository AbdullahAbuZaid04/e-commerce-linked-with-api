import { apiClient } from "./apiClient";

export const getUsersApi = async () => {
  return apiClient("/api/users");
};

export const deleteUserApi = async (id) => {
  return apiClient(`/api/users/${id}`, {
    method: "DELETE",
  });
};

export const updateUserRoleApi = async (id, role) => {
  return apiClient(`/api/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
};
