'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export function useBusinessReport() {
    return useQuery({
        queryKey: ['dashboard', 'report'],
        queryFn: dashboardApi.getReport,
    });
}