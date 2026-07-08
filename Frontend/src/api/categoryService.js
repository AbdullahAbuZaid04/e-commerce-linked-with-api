import { apiClient } from "./apiClient";

export const getCategoriesApi = async () => {
  return apiClient("/api/categories");
};

export const getCategoryBySlugApi = async (slug) => {
  return apiClient(`/api/categories/${slug}`);
};

export const createCategoryApi = async (data) => {
  return apiClient("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCategoryApi = async (id, data) => {
  return apiClient(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteCategoryApi = async (id) => {
  return apiClient(`/api/categories/${id}`, {
    method: "DELETE",
  });
};
