import axios, { AxiosRequestConfig } from 'axios';
import axiosInstance from './axios-instance';
import { ApiClientError } from './errors';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  details?: unknown;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

interface RequestOptions {
  body?: unknown;
  params?: QueryParams;
  config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      ...options.config,
      url: path,
      method,
      data: options.body,
      params: options.params,
    });

    if (!response.data.success) {
      throw new ApiClientError(
        response.status,
        response.data.message || 'Request failed',
        response.data.details
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;

    if (axios.isAxiosError(error)) {
      const body = error.response?.data as ApiResponse<T> | undefined;
      throw new ApiClientError(
        error.response?.status ?? 0,
        body?.message ?? error.message ?? 'Request failed',
        body?.details
      );
    }

    throw error;
  }
}

export const apiClient = {
  get<T>(url: string, params?: QueryParams, config?: RequestOptions['config']): Promise<T> {
    return request<T>('GET', url, { params, config });
  },

  post<T>(url: string, body?: unknown, config?: RequestOptions['config']): Promise<T> {
    return request<T>('POST', url, { body, config });
  },

  patch<T>(url: string, body?: unknown, config?: RequestOptions['config']): Promise<T> {
    return request<T>('PATCH', url, { body, config });
  },

  put<T>(url: string, body?: unknown, config?: RequestOptions['config']): Promise<T> {
    return request<T>('PUT', url, { body, config });
  },

  delete<T>(url: string, config?: RequestOptions['config']): Promise<T> {
    return request<T>('DELETE', url, { config });
  },
};