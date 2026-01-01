import {
  userManagementClient,
  handleUserManagementApiError,
  buildQueryParams,
} from './client';
import type {
  FollowResponse,
  GetFollowedUsersResponse,
  UserActivityResponse,
  UserActivityParams,
  PaginationParams,
} from '@/types/user-management';

export const socialApi = {
  /**
   * Get list of users that the specified user is following
   * Requires: user:read scope
   */
  async getFollowing(
    userId: string,
    params?: PaginationParams
  ): Promise<GetFollowedUsersResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/users/${userId}/following?${queryString}`
        : `/users/${userId}/following`;

      const response = await userManagementClient.get(url);
      return response.data as GetFollowedUsersResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get list of users following the specified user
   * Requires: user:read scope
   */
  async getFollowers(
    userId: string,
    params?: PaginationParams
  ): Promise<GetFollowedUsersResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/users/${userId}/followers?${queryString}`
        : `/users/${userId}/followers`;

      const response = await userManagementClient.get(url);
      return response.data as GetFollowedUsersResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Follow a user
   * Requires: user:write scope
   * Updated to use POST per OpenAPI spec (was PUT toggle)
   */
  async followUser(
    userId: string,
    targetUserId: string
  ): Promise<FollowResponse> {
    try {
      const response = await userManagementClient.post(
        `/users/${userId}/follow/${targetUserId}`
      );
      return response.data as FollowResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Unfollow a user
   * Requires: user:write scope
   * Updated to use DELETE per OpenAPI spec (was PUT toggle)
   */
  async unfollowUser(
    userId: string,
    targetUserId: string
  ): Promise<FollowResponse> {
    try {
      const response = await userManagementClient.delete(
        `/users/${userId}/follow/${targetUserId}`
      );
      return response.data as FollowResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get user activity summary (recent recipes, follows, reviews, favorites)
   * Requires: user:read scope
   */
  async getUserActivity(
    userId: string,
    params?: UserActivityParams
  ): Promise<UserActivityResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/users/${userId}/activity?${queryString}`
        : `/users/${userId}/activity`;

      const response = await userManagementClient.get(url);
      return response.data as UserActivityResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Check if a user is following another user
   * Helper method to determine follow status
   * Requires: user:read scope
   */
  async isFollowingUser(
    userId: string,
    targetUserId: string
  ): Promise<boolean> {
    try {
      // Get user's following list and check if target user is in it
      // For large following lists, this might need pagination
      const following = await this.getFollowing(userId, { limit: 100 });

      return (
        following.followedUsers?.some(user => user.userId === targetUserId) ??
        false
      );
    } catch {
      // If we can't determine follow status, return false to be safe
      return false;
    }
  },

  /**
   * Get mutual follows between two users
   * Helper method to find users that both users follow
   * Requires: user:read scope
   */
  async getMutualFollows(
    userId: string,
    targetUserId: string
  ): Promise<string[]> {
    try {
      const [userFollowing, targetUserFollowing] = await Promise.all([
        this.getFollowing(userId, { limit: 1000 }),
        this.getFollowing(targetUserId, { limit: 1000 }),
      ]);

      const userFollowingIds =
        userFollowing.followedUsers?.map(u => u.userId) ?? [];
      const targetFollowingIds =
        targetUserFollowing.followedUsers?.map(u => u.userId) ?? [];

      // Find intersection of the two arrays
      return userFollowingIds.filter(id => targetFollowingIds.includes(id));
    } catch {
      return [];
    }
  },

  /**
   * Get follow statistics for a user
   * Helper method to get follower and following counts
   * Requires: user:read scope
   */
  async getFollowStats(userId: string): Promise<{
    followingCount: number;
    followersCount: number;
  }> {
    try {
      const [following, followers] = await Promise.all([
        this.getFollowing(userId, { countOnly: true }),
        this.getFollowers(userId, { countOnly: true }),
      ]);

      return {
        followingCount: following.totalCount,
        followersCount: followers.totalCount,
      };
    } catch {
      return {
        followingCount: 0,
        followersCount: 0,
      };
    }
  },
};
