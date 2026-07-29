import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,

                gcTime: 5 * 60 * 1000, // Oru query use cheyyunnilla enkil, athinte cached data 5 minutes vare memory-il keep cheyyum.than garbage collect

                retry: 1, //API request fail aayal 1 time retry cheyyum.

                refetchOnWindowFocus: false, // User browser tab-il ninnu vere tab-il poyi, pinne thirichu vannal automatically API call cheyyilla.

                refetchOnReconnect: true, //Internet connection poyi, pinne reconnect aayal stale queries refresh cheyyan TanStack Query try cheyyum.
            },

            mutations: {
                retry: 0, //POST/PATCH/DELETE automatic retry illa
            },
        },
    });
}