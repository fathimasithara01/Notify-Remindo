import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ---- Main instance ---------------------------------------------------------
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// A separate, interceptor-free client for the refresh call itself.
// This is the key fix for "recursive 401" risk: if /auth/refresh ever
// returns 401, it must NOT re-enter this same response interceptor.
const refreshClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshHasFailed = false;

type QueuedRequest = {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
};

let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      console.log("nbnbnbnbnbnbnblock")
      resolve(axiosInstance(config));
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;
    const status = error.response?.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (refreshHasFailed) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      await refreshClient.post('/auth/refresh-token', {});

      refreshHasFailed = false;
      processQueue();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      refreshHasFailed = true;
      processQueue(refreshError);

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Call after a successful login so the next 401 (e.g. natural token
 * expiry later) is allowed to attempt a refresh again, instead of being
 * permanently short-circuited by a stale failure from a previous session.
 */
export function resetAuthRefreshState(): void {
  refreshHasFailed = false;
}

export default axiosInstance;