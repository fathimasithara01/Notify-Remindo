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

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

let hasRedirected = false;

const clearSessionAndRedirect = async () => {
  if (hasRedirected) return;
  hasRedirected = true;

  // Best-effort: ask the backend to expire the httpOnly cookies so the
  // middleware doesn't see a (corrupt/invalid) refreshToken and bounce
  // us straight back to the dashboard, causing a redirect loop.
  try {
    await refreshClient.post("/auth/logout");
  } catch {
    // ignore — we're redirecting to login regardless
  }

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh-token")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  (response) => {
    // a successful call means the session is good again
    hasRedirected = false;
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = originalRequest.url ?? "";

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh-token") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      await clearSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      await clearSessionAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;