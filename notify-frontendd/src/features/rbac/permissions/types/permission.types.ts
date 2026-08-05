export interface Permission {
  id: string;
  name: string;
  module: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionFilters {
  search?: string;
  module?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}