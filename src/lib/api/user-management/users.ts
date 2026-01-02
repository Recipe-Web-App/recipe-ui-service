import {
  userManagementClient,
  handleUserManagementApiError,
  buildQueryParams,
} from './client';
import type {
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserSearchResponse,
  UserSearchResult,
  UserAccountDeleteRequest,
  UserAccountDeleteRequestResponse,
  UserConfirmAccountDeleteResponse,
  PaginationParams,
} from '@/types/user-management';

export const usersApi = {
  /**
   * Get user profile by user ID
   * Requires: user:read scope
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      const response = await userManagementClient.get(
        `/users/${userId}/profile`
      );
      return response.data as UserProfileResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Update current user's profile
   * Requires: user:write scope
   */
  async updateProfile(
    data: UserProfileUpdateRequest
  ): Promise<UserProfileResponse> {
    try {
      const response = await userManagementClient.put('/users/profile', data);
      return response.data as UserProfileResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Request account deletion (first step of 2-step process)
   * Returns a confirmation token that expires
   * Requires: user:write scope
   */
  async requestAccountDeletion(): Promise<UserAccountDeleteRequestResponse> {
    try {
      const response = await userManagementClient.post(
        '/users/account/delete-request'
      );
      return response.data as UserAccountDeleteRequestResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Confirm account deletion (second step of 2-step process)
   * Requires the confirmation token from requestAccountDeletion
   * Requires: user:write scope
   */
  async confirmAccountDeletion(
    data: UserAccountDeleteRequest
  ): Promise<UserConfirmAccountDeleteResponse> {
    try {
      const response = await userManagementClient.delete('/users/account', {
        data,
      });
      return response.data as UserConfirmAccountDeleteResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Search for users with optional pagination
   * Requires: user:read scope
   */
  async searchUsers(
    params: {
      query?: string; // Search query (updated from 'q' per OpenAPI spec)
      limit?: number;
      offset?: number;
      countOnly?: boolean; // Updated from 'count_only' per OpenAPI spec
    } & PaginationParams
  ): Promise<UserSearchResponse> {
    try {
      const queryString = buildQueryParams(params);
      const url = queryString
        ? `/users/search?${queryString}`
        : '/users/search';

      const response = await userManagementClient.get(url);
      return response.data as UserSearchResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get basic user information by user ID
   * Returns less detailed info than getUserProfile
   * Requires: user:read scope
   */
  async getUser(userId: string): Promise<UserSearchResult> {
    try {
      const response = await userManagementClient.get(`/users/${userId}`);
      return response.data as UserSearchResult;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Batch get users by IDs
   * Helper method for getting multiple users efficiently
   * Requires: user:read scope
   */
  async getUsersBatch(userIds: string[]): Promise<UserSearchResult[]> {
    try {
      // Since the API doesn't have a native batch endpoint, we'll make parallel requests
      // In a production scenario, you might want to implement request batching/debouncing
      const promises = userIds.map(id => this.getUser(id));
      const results = await Promise.allSettled(promises);

      return results
        .filter(
          (result): result is PromiseFulfilledResult<UserSearchResult> =>
            result.status === 'fulfilled'
        )
        .map(result => result.value);
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Check if a username is available
   * Helper method for registration/profile update validation
   * Requires: user:read scope
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const result = await this.searchUsers({
        query: username,
        limit: 1,
        countOnly: true,
      });

      // If totalCount is 0, username is available
      return result.totalCount === 0;
    } catch {
      // If search fails, assume username is not available to be safe
      return false;
    }
  },

  /**
   * Get user profile with fallback to basic info
   * Attempts to get full profile, falls back to basic info if access denied
   * Requires: user:read scope
   */
  async getUserWithFallback(
    userId: string
  ): Promise<UserProfileResponse | UserSearchResult> {
    try {
      return await this.getUserProfile(userId);
    } catch (error) {
      // If profile access is denied (privacy settings), try basic user info
      if (error instanceof Error && 'status' in error && error.status === 403) {
        return await this.getUser(userId);
      }
      throw error;
    }
  },
};
