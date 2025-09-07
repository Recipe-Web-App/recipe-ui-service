import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialApi } from '@/lib/api/user-management';
import { QUERY_KEYS } from '@/constants';
import type { UserActivityParams } from '@/types/user-management';

/**
 * Hook to get a user's following list
 */
export const useFollowing = (
  userId: string,
  limit?: number,
  offset?: number
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING,
      userId,
      { limit, offset },
    ],
    queryFn: () => socialApi.getFollowing(userId, { limit, offset }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a user's followers list
 */
export const useFollowers = (
  userId: string,
  limit?: number,
  offset?: number
) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS,
      userId,
      { limit, offset },
    ],
    queryFn: () => socialApi.getFollowers(userId, { limit, offset }),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get current user's following list
 */
export const useCurrentUserFollowing = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING,
      'current',
      { limit, offset },
    ],
    queryFn: () => socialApi.getCurrentUserFollowing({ limit, offset }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get current user's followers list
 */
export const useCurrentUserFollowers = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS,
      'current',
      { limit, offset },
    ],
    queryFn: () => socialApi.getCurrentUserFollowers({ limit, offset }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to follow a user
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => socialApi.followUser(targetUserId),
    onSuccess: (_, targetUserId) => {
      // Invalidate following lists
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING],
      });

      // Invalidate followers list for the target user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS, targetUserId],
      });

      // Invalidate mutual follows
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS, targetUserId],
      });

      // Invalidate follow stats
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS,
      });
    },
  });
};

/**
 * Hook to unfollow a user
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => socialApi.unfollowUser(targetUserId),
    onSuccess: (_, targetUserId) => {
      // Invalidate following lists
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING],
      });

      // Invalidate followers list for the target user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS, targetUserId],
      });

      // Invalidate mutual follows
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS, targetUserId],
      });

      // Invalidate follow stats
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS,
      });
    },
  });
};

/**
 * Hook to toggle follow status for a user
 */
export const useToggleFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      targetUserId,
    }: {
      userId: string;
      targetUserId: string;
    }) => socialApi.toggleFollowUser(userId, targetUserId),
    onMutate: async ({ targetUserId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING],
      });

      // Optimistically update the cache (if needed)
      // This would require knowing the current follow state

      return { targetUserId };
    },
    onSuccess: (_, { targetUserId }) => {
      // Invalidate following lists
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING],
      });

      // Invalidate followers list for the target user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS, targetUserId],
      });

      // Invalidate mutual follows
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS, targetUserId],
      });

      // Invalidate follow stats
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS,
      });
    },
  });
};

/**
 * Hook to check if the current user is following a target user
 */
export const useIsFollowing = (targetUserId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING, 'check', targetUserId],
    queryFn: () => socialApi.isFollowingUser(targetUserId),
    enabled: !!targetUserId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get mutual follows between current user and target user
 */
export const useMutualFollows = (targetUserId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS, targetUserId],
    queryFn: () => socialApi.getMutualFollows(targetUserId),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get follow statistics for a user
 */
export const useFollowStats = (userId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS, userId],
    queryFn: () => socialApi.getFollowStats(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get user activity
 */
export const useUserActivity = (
  userId: string,
  params?: UserActivityParams
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.ACTIVITY, userId, params],
    queryFn: () => socialApi.getUserActivity(userId, params),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get current user's activity
 */
export const useCurrentUserActivity = (params?: UserActivityParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_MANAGEMENT.ACTIVITY, 'current', params],
    queryFn: () => socialApi.getCurrentUserActivity(params),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
