import { apiClient } from "./apiClient";

export const createOrderApi = async (data) => {
  return apiClient("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getOrdersApi = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  const qs = query.toString();
  return apiClient(`/api/orders${qs ? `?${qs}` : ""}`);
};

export const getOrderByIdApi = async (id) => {
  return apiClient(`/api/orders/${id}`);
};

export const updateOrderStatusApi = async (id, status) => {
  return apiClient(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
