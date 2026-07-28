import { apiClient } from '@/lib/api/client';
import { BusinessReport } from '../types/dashboard.types';
import { ROUTES } from '@/config/routes';

export const dashboardApi = {
  getReport: () => apiClient.get<BusinessReport>("/dashboard"),
};