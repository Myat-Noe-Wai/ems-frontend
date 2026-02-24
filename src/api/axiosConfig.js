import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    console.log("access token in axiosConfig");
    console.log(token);
    if (token && !config.url.includes("/v1/user/login") && !config.url.includes("/v1/user/refresh-token")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: refresh access token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only retry once
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // no refresh token → logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/user/refresh-token`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = res.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed → logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
