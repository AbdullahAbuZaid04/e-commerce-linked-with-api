const API_URL = process.env.REACT_APP_API_URL;
const TIMEOUT_MS = 25000;

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let retried = false;

  const doFetch = async (h) => {
    const config = {
      ...options,
      headers: h,
      signal: controller.signal,
    };
    return fetch(`${API_URL}${endpoint}`, config);
  };

  try {
    let response = await doFetch(headers);

    if (!response.ok) {
      if (response.status === 401 && !retried) {
        const refreshed = await refreshToken();
        if (refreshed) {
          retried = true;
          headers["Authorization"] =
            `Bearer ${localStorage.getItem("accessToken")}`;
          response = await doFetch(headers);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData?.error || errorData?.message || "Request failed");
          }
          const text = await response.text();
          return text ? JSON.parse(text) : null;
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired");
      }

      const errorData = await response.json().catch(() => ({}));
      let errMsg = errorData?.error || errorData?.message || `Request failed (${response.status})`;
      throw new Error(errMsg);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Request timed out. The server may be starting up, please try again.",
      );
    }
    if (error instanceof TypeError) {
      throw new Error("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const uploadImage = async (file) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("image", file);
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/uploads`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "فشل رفع الصورة");
  }
  return res.json();
};

export const uploadMultipleImages = async (files) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  files.forEach((f) => formData.append("images", f));
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/uploads/multiple`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "فشل رفع الصور");
  }
  return res.json();
};

const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem("refreshToken");
  if (!refreshTokenValue) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("accessToken", data.data.accessToken);
    if (data.data.refreshToken) localStorage.setItem("refreshToken", data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
};
