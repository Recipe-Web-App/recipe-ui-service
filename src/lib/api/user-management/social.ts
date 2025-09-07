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
   * Follow or unfollow a user
   * The same endpoint handles both actions based on current follow state
   * Requires: user:write scope
   */
  async toggleFollowUser(
    userId: string,
    targetUserId: string
  ): Promise<FollowResponse> {
    try {
      const response = await userManagementClient.put(
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
   * Get current user's following list
   * Convenience method using 'me' identifier
   * Requires: user:read scope
   */
  async getCurrentUserFollowing(
    params?: PaginationParams
  ): Promise<GetFollowedUsersResponse> {
    return this.getFollowing('me', params);
  },

  /**
   * Get current user's followers list
   * Convenience method using 'me' identifier
   * Requires: user:read scope
   */
  async getCurrentUserFollowers(
    params?: PaginationParams
  ): Promise<GetFollowedUsersResponse> {
    return this.getFollowers('me', params);
  },

  /**
   * Follow a user (current user follows target user)
   * Convenience method for the current user
   * Requires: user:write scope
   */
  async followUser(targetUserId: string): Promise<FollowResponse> {
    return this.toggleFollowUser('me', targetUserId);
  },

  /**
   * Unfollow a user (current user unfollows target user)
   * Note: This uses the same endpoint as followUser - the API handles the toggle
   * Requires: user:write scope
   */
  async unfollowUser(targetUserId: string): Promise<FollowResponse> {
    return this.toggleFollowUser('me', targetUserId);
  },

  /**
   * Get current user's activity summary
   * Convenience method using 'me' identifier
   * Requires: user:read scope
   */
  async getCurrentUserActivity(
    params?: UserActivityParams
  ): Promise<UserActivityResponse> {
    return this.getUserActivity('me', params);
  },

  /**
   * Check if current user is following a specific user
   * Helper method to determine follow status
   * Requires: user:read scope
   */
  async isFollowingUser(targetUserId: string): Promise<boolean> {
    try {
      // Get current user's following list and check if target user is in it
      // For large following lists, this might need pagination
      const following = await this.getCurrentUserFollowing({ limit: 100 });

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
   * Get mutual follows between current user and target user
   * Helper method to find users that both the current user and target user follow
   * Requires: user:read scope
   */
  async getMutualFollows(targetUserId: string): Promise<string[]> {
    try {
      const [currentUserFollowing, targetUserFollowing] = await Promise.all([
        this.getCurrentUserFollowing({ limit: 1000 }), // Adjust limit as needed
        this.getFollowing(targetUserId, { limit: 1000 }),
      ]);

      const currentFollowing =
        currentUserFollowing.followedUsers?.map(u => u.userId) ?? [];
      const targetFollowing =
        targetUserFollowing.followedUsers?.map(u => u.userId) ?? [];

      // Find intersection of the two arrays
      return currentFollowing.filter(userId =>
        targetFollowing.includes(userId)
      );
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
        this.getFollowing(userId, { count_only: true }),
        this.getFollowers(userId, { count_only: true }),
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
