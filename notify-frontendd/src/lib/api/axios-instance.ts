import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ---- Main instance ---------------------------------------------------------
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ---- Refresh client (no interceptors) --------------------------------------
const refreshClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;

type QueuedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: QueuedRequest[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(axiosInstance(config));
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url ?? "";

    // Ignore non-401 responses
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Never refresh these endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Wait if another refresh request is already running
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshClient.post("/auth/refresh-token");

      processQueue();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;