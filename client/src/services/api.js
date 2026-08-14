import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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
  getStats: () => api.get("/campaigns/stats"),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (payload) => api.post("/campaigns", payload),
  update: (id, payload) => api.put(`/campaigns/${id}`, payload),
  delete: (id, force = false) => api.delete(`/campaigns/${id}${force ? '?force=true' : ''}`),
  donate: (id, payload) => api.post(`/campaigns/${id}/donate`, payload),
};

export const authService = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resendOtp: (payload) => api.post("/auth/resend-otp", payload),
  logout: () => api.post("/auth/logout"),
  google: (payload) => api.post("/auth/google", payload),
  getMe: () => api.get("/auth/me"),
};

export const userService = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  delete: (id) => api.delete(`/users/${id}`),
  inviteAdmin: (payload) => api.post("/users/invite-admin", payload),
  updateProfile: (payload) => api.put("/users/profile", payload),
  changePassword: (payload) => api.put("/users/change-password", payload),
  getFavourites: () => api.get("/users/favourites"),
  addFavourite: (campaignId) => api.post(`/users/favourites/${campaignId}`),
  removeFavourite: (campaignId) => api.delete(`/users/favourites/${campaignId}`),
};

export const donationService = {
  getAll: (params) => api.get("/donations", { params }),
  getStats: (params) => api.get("/donations/stats", { params }),
  getActivity: (params) => api.get("/donations/activity", { params }),
  getMyDonations: () => api.get("/donations/my"),
  createPaymentIntent: (payload) => api.post("/donations/create-payment-intent", payload),
};

export const taskService = {
  getAll: (params) => api.get("/tasks", { params }),
  create: (payload) => api.post("/tasks", payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const newsletterService = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }),
};

export const miscService = {
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/misc/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
