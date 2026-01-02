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
 * Hook to follow a user
 * Updated: Now requires both userId and targetUserId per OpenAPI spec (no /me endpoint)
 * Uses POST instead of PUT toggle
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      targetUserId,
    }: {
      userId: string;
      targetUserId: string;
    }) => socialApi.followUser(userId, targetUserId),
    onSuccess: (_, { userId, targetUserId }) => {
      // Invalidate following lists for the user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING, userId],
      });

      // Invalidate followers list for the target user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS, targetUserId],
      });

      // Invalidate mutual follows
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS],
      });

      // Invalidate follow stats for both users
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS, targetUserId],
      });

      // Invalidate isFollowing check
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING,
          'check',
          userId,
          targetUserId,
        ],
      });
    },
  });
};

/**
 * Hook to unfollow a user
 * Updated: Now requires both userId and targetUserId per OpenAPI spec (no /me endpoint)
 * Uses DELETE instead of PUT toggle
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      targetUserId,
    }: {
      userId: string;
      targetUserId: string;
    }) => socialApi.unfollowUser(userId, targetUserId),
    onSuccess: (_, { userId, targetUserId }) => {
      // Invalidate following lists for the user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING, userId],
      });

      // Invalidate followers list for the target user
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOWERS, targetUserId],
      });

      // Invalidate mutual follows
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS],
      });

      // Invalidate follow stats for both users
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS, userId],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USER_MANAGEMENT.FOLLOW_STATS, targetUserId],
      });

      // Invalidate isFollowing check
      queryClient.invalidateQueries({
        queryKey: [
          ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING,
          'check',
          userId,
          targetUserId,
        ],
      });
    },
  });
};

/**
 * Hook to check if a user is following another user
 * Updated: Now requires userId parameter (no /me endpoint)
 */
export const useIsFollowing = (userId: string, targetUserId: string) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.FOLLOWING,
      'check',
      userId,
      targetUserId,
    ],
    queryFn: () => socialApi.isFollowingUser(userId, targetUserId),
    enabled: !!userId && !!targetUserId,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get mutual follows between two users
 * Updated: Now requires userId parameter (no /me endpoint)
 */
export const useMutualFollows = (userId: string, targetUserId: string) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.USER_MANAGEMENT.MUTUAL_FOLLOWS,
      userId,
      targetUserId,
    ],
    queryFn: () => socialApi.getMutualFollows(userId, targetUserId),
    enabled: !!userId && !!targetUserId,
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
