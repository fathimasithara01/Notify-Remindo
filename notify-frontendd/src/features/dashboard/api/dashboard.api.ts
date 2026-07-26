import { apiClient } from '@/lib/api/client';
import { BusinessReport } from '../types/dashboard.types';

export const dashboardApi = {
  getReport: () => apiClient.get<BusinessReport>('/dashboard/report'),
};