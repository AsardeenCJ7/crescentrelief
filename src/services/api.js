import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.crescentrelief.org/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const campaignService = {
  getAll: (params) => api.get("/campaigns", { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  donate: (id, payload) => api.post(`/campaigns/${id}/donate`, payload),
};

export const authService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  logout: () => api.post("/auth/logout"),
};

export const newsletterService = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }),
};

export default api;
