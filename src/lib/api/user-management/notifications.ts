import {
  userManagementClient,
  handleUserManagementApiError,
  buildQueryParams,
} from './client';
import type {
  NotificationListResponse,
  NotificationCountResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
  UserPreferences,
  PaginationParams,
} from '@/types/user-management';

export const notificationsApi = {
  /**
   * Get paginated list of notifications for current user
   * Supports filtering by read status, notification type, etc.
   * Requires: user:read scope
   */
  async getNotifications(
    params?: {
      is_read?: boolean;
      notification_type?: string;
      limit?: number;
      offset?: number;
      count_only?: boolean;
    } & PaginationParams
  ): Promise<NotificationListResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/notifications?${queryString}`
        : '/notifications';

      const response = await userManagementClient.get(url);
      return response.data as NotificationListResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get count of unread notifications
   * Quick method to get notification badge count
   * Requires: user:read scope
   */
  async getUnreadNotificationCount(): Promise<NotificationCountResponse> {
    try {
      const response = await userManagementClient.get(
        '/notifications?is_read=false&count_only=true'
      );
      return response.data as NotificationCountResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Mark a specific notification as read
   * Requires: user:write scope
   */
  async markNotificationAsRead(
    notificationId: string
  ): Promise<NotificationReadResponse> {
    try {
      const response = await userManagementClient.put(
        `/notifications/${notificationId}/read`
      );
      return response.data as NotificationReadResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Mark all notifications as read
   * Bulk operation to clear notification badge
   * Requires: user:write scope
   */
  async markAllNotificationsAsRead(): Promise<NotificationReadAllResponse> {
    try {
      const response = await userManagementClient.put(
        '/notifications/read-all'
      );
      return response.data as NotificationReadAllResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Delete specific notifications
   * Bulk delete operation
   * Requires: user:write scope
   */
  async deleteNotifications(
    notificationIds: string[]
  ): Promise<NotificationDeleteResponse> {
    try {
      const deleteRequest: NotificationDeleteRequest = {
        notificationIds,
      };

      const response = await userManagementClient.delete('/notifications', {
        data: deleteRequest,
      });
      return response.data as NotificationDeleteResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Delete a single notification
   * Convenience method for single notification deletion
   * Requires: user:write scope
   */
  async deleteNotification(
    notificationId: string
  ): Promise<NotificationDeleteResponse> {
    return this.deleteNotifications([notificationId]);
  },

  /**
   * Get current user's notification preferences
   * Requires: user:read scope
   */
  async getNotificationPreferences(): Promise<UserPreferences> {
    try {
      const response = await userManagementClient.get(
        '/notifications/preferences'
      );
      return response.data as UserPreferences;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Update current user's notification preferences
   * Requires: user:write scope
   */
  async updateNotificationPreferences(
    preferences: UserPreferences
  ): Promise<UserPreferences> {
    try {
      const response = await userManagementClient.put(
        '/notifications/preferences',
        preferences
      );
      return response.data as UserPreferences;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get all notifications (read and unread)
   * Convenience method to get all notifications without filtering
   * Requires: user:read scope
   */
  async getAllNotifications(
    params?: PaginationParams
  ): Promise<NotificationListResponse> {
    return this.getNotifications(params);
  },

  /**
   * Get only unread notifications
   * Convenience method to filter for unread notifications
   * Requires: user:read scope
   */
  async getUnreadNotifications(
    params?: PaginationParams
  ): Promise<NotificationListResponse> {
    return this.getNotifications({ ...params, is_read: false });
  },

  /**
   * Get only read notifications
   * Convenience method to filter for read notifications
   * Requires: user:read scope
   */
  async getReadNotifications(
    params?: PaginationParams
  ): Promise<NotificationListResponse> {
    return this.getNotifications({ ...params, is_read: true });
  },

  /**
   * Get notifications by type
   * Filter notifications by specific type (follow, like, comment, etc.)
   * Requires: user:read scope
   */
  async getNotificationsByType(
    notificationType: string,
    params?: PaginationParams
  ): Promise<NotificationListResponse> {
    return this.getNotifications({
      ...params,
      notification_type: notificationType,
    });
  },

  /**
   * Clear all read notifications
   * Helper method to delete all notifications that have been read
   * Requires: user:write scope
   */
  async clearReadNotifications(): Promise<NotificationDeleteResponse> {
    try {
      // First get all read notifications
      const readNotifications = await this.getReadNotifications({
        limit: 1000,
      });

      if (!readNotifications.notifications?.length) {
        return { message: 'No read notifications to clear' };
      }

      // Extract notification IDs
      const notificationIds = readNotifications.notifications.map(
        n => n.notificationId
      );

      // Delete them
      return await this.deleteNotifications(notificationIds);
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Enable/disable specific notification types
   * Helper method to update specific notification preferences
   * Requires: user:write scope
   */
  async updateNotificationTypeSettings(updates: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    follow_notifications?: boolean;
    like_notifications?: boolean;
    comment_notifications?: boolean;
    recipe_notifications?: boolean;
    system_notifications?: boolean;
  }): Promise<UserPreferences> {
    try {
      // Get current preferences
      const currentPrefs = await this.getNotificationPreferences();

      // Merge updates with current preferences
      const updatedPrefs: UserPreferences = {
        ...currentPrefs,
        notification_preferences: {
          ...currentPrefs.notification_preferences,
          ...updates,
        },
      };

      // Update preferences
      return await this.updateNotificationPreferences(updatedPrefs);
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Check if there are new notifications since last check
   * Helper method for real-time notification checking
   * Requires: user:read scope
   */
  async hasNewNotifications(lastCheckTime?: string): Promise<{
    hasNew: boolean;
    count: number;
  }> {
    try {
      const unreadCount = await this.getUnreadNotificationCount();

      // If no last check time provided, just return unread count
      if (!lastCheckTime) {
        return {
          hasNew: unreadCount.totalCount > 0,
          count: unreadCount.totalCount,
        };
      }

      // Get recent notifications and check if any are newer than last check
      const recentNotifications = await this.getUnreadNotifications({
        limit: 10,
      });

      const newNotifications =
        recentNotifications.notifications?.filter(
          notification => notification.createdAt > lastCheckTime
        ) ?? [];

      return {
        hasNew: newNotifications.length > 0,
        count: newNotifications.length,
      };
    } catch {
      return { hasNew: false, count: 0 };
    }
  },
};
