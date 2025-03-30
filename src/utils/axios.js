import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });

    const message =
      error.response?.data?.message || "An error occurred. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export default api;
