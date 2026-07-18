import { apiClient } from './client';
import { BusinessReport } from '../types/dashboard';

export const dashboardApi = {
    getReport: () => apiClient.get<BusinessReport>('/dashboard/report'),
};