import { apiClient } from "./apiClient";

export const getProductsApi = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  const qs = query.toString();
  return apiClient(`/api/products${qs ? `?${qs}` : ""}`);
};

export const getProductBySlugApi = async (slug) => {
  return apiClient(`/api/products/${slug}`);
};

export const createProductApi = async (data) => {
  return apiClient("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateProductApi = async (id, data) => {
  return apiClient(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteProductApi = async (id) => {
  return apiClient(`/api/products/${id}`, {
    method: "DELETE",
  });
};
