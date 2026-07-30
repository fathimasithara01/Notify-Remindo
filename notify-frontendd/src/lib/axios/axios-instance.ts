// src/lib/axios/axios-instance.ts

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json", },
    withCredentials: true,
});

let isRefreshing = false;

let failedRequests: {
    resolve: () => void;
    reject: (error: any) => void;
}[] = [];


const processQueue = (error: any = null) => {
    failedRequests.forEach(
        (request) => {
            if (error) {
                request.reject(error);
            }
            else {
                request.resolve();
            }
        }
    );
    failedRequests = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise(
                (resolve, reject) => {
                    failedRequests.push({
                        resolve: () => resolve(axiosInstance(originalRequest)),
                        reject,
                    });
                }
            );
        }
        isRefreshing = true;

        try {
            await axiosInstance.post("/auth/refresh", {},
                {
                    _retry: true,
                }
            );

            processQueue();

            return axiosInstance(originalRequest);
        }

        catch (refreshError) {
            processQueue(refreshError);

            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }

            return Promise.reject(refreshError);

        }
        finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;