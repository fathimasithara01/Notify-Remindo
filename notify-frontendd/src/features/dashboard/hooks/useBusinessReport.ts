'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';
import {queryKeys} from '@/lib/query/query-keys'

export function useBusinessReport() {
    return useQuery({
        queryKey: queryKeys.dashboard.report(),
        queryFn: dashboardApi.getReport,
    });
}