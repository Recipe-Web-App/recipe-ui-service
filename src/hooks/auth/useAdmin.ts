import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAdminApi } from '@/lib/api/auth';
import { QUERY_KEYS } from '@/constants';
import type { SessionStatsParams } from '@/types/auth';

export const useSessionStats = (params?: SessionStatsParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.AUTH.SESSION_STATS, params],
    queryFn: () => authAdminApi.getSessionStats(params),
    staleTime: 30 * 1000, // 30 seconds - session stats change frequently
    gcTime: 60 * 1000, // 1 minute
  });
};

export const useClearSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAdminApi.clearSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.AUTH.SESSION_STATS,
      });
    },
  });
};

export const useClearAllCaches = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAdminApi.clearAllCaches(),
    onSuccess: () => {
      // Clear all auth-related queries since all caches were cleared
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export const useForceLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => authAdminApi.forceLogout(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.AUTH.SESSION_STATS,
      });
    },
  });
};
