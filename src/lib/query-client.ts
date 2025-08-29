import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error: unknown) => {
          if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            (error.status === 404 || error.status === 403)
          ) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

// For server-side usage or testing
export const queryClient = createQueryClient();
