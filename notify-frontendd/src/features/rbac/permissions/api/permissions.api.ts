import { toQueryParams } from '../../shared/query-params';
import type {
  PaginatedResult,
  Permission,
  PermissionFilters,
} from '../types/permission.types';
import { apiClient } from '@/lib/api/client';

const BASE_URL = '/permissions';

export const permissionsApi = {
  list: async ( filters: PermissionFilters): Promise<PaginatedResult<Permission>> => 
     apiClient.get<PaginatedResult<Permission>>(
      BASE_URL,
      toQueryParams(filters)
    ),
    

  getOne: async (id: string): Promise<Permission> => 
    apiClient.get<Permission>(
      `${BASE_URL}/${id}`
    ),
   
};