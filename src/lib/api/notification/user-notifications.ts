import {
  notificationClient,
  handleNotificationApiError,
  buildQueryParams,
} from './client';
import type {
  UserNotification,
  UserNotificationListResponse,
  UserNotificationCountResponse,
  NotificationDeleteRequest,
  NotificationDeleteResponse,
  NotificationReadResponse,
  NotificationReadAllResponse,
  UserNotificationParams,
  HasNewNotificationsResponse,
} from '@/types/notification';

/**
 * User Notifications API
 *
 * Methods for managing user notifications (inbox, read/unread, delete).
 * These endpoints are at /users/me/notifications and /users/{userId}/notifications.
 */
export const userNotificationsApi = {
  /**
   * Get current user's notifications
   *
   * Retrieve paginated list of in-app notifications for the authenticated user.
   * Returns notifications ordered by creation date (newest first), excluding soft-deleted.
   *
   * Method: GET /users/me/notifications
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param params - Pagination and filter parameters
   * @returns Paginated notification list or count only
   */
  async getMyNotifications(
    params?: UserNotificationParams
  ): Promise<UserNotificationListResponse | UserNotificationCountResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/users/me/notifications?${queryString}`
        : '/users/me/notifications';

      const response = await notificationClient.get(url);

      // Return count-only response if countOnly was specified
      if (params?.countOnly) {
        return response.data as UserNotificationCountResponse;
      }

      return response.data as UserNotificationListResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   *
   * Quick method to get notification badge count.
   *
   * Method: GET /users/me/notifications?countOnly=true
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @returns Count of unread notifications
   */
  async getUnreadNotificationCount(): Promise<UserNotificationCountResponse> {
    try {
      const response = await notificationClient.get(
        '/users/me/notifications?countOnly=true'
      );
      return response.data as UserNotificationCountResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   *
   * Sets is_read=true on the notification.
   *
   * Method: PUT /users/me/notifications/{notificationId}/read
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param notificationId - Notification UUID
   * @returns Success message
   */
  async markNotificationAsRead(
    notificationId: string
  ): Promise<NotificationReadResponse> {
    try {
      const response = await notificationClient.put(
        `/users/me/notifications/${notificationId}/read`
      );
      return response.data as NotificationReadResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   *
   * Sets is_read=true on all unread notifications.
   *
   * Method: PUT /users/me/notifications/read-all
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @returns Success message with list of marked notification IDs
   */
  async markAllNotificationsAsRead(): Promise<NotificationReadAllResponse> {
    try {
      const response = await notificationClient.put(
        '/users/me/notifications/read-all'
      );
      return response.data as NotificationReadAllResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Bulk delete notifications
   *
   * Soft delete multiple notifications for the authenticated user.
   * Returns 206 if some notifications could not be deleted (partial success).
   *
   * Method: DELETE /users/me/notifications
   * Requires: OAuth2 with notification:user or notification:admin scope
   *
   * @param notificationIds - Array of notification IDs to delete (max 100)
   * @returns Success message with list of deleted notification IDs
   */
  async deleteNotifications(
    notificationIds: string[]
  ): Promise<NotificationDeleteResponse> {
    try {
      const deleteRequest: NotificationDeleteRequest = {
        notificationIds,
      };

      const response = await notificationClient.delete(
        '/users/me/notifications',
        {
          data: deleteRequest,
        }
      );
      return response.data as NotificationDeleteResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Delete a single notification
   *
   * Convenience method for single notification deletion.
   *
   * @param notificationId - Notification UUID to delete
   * @returns Success message
   */
  async deleteNotification(
    notificationId: string
  ): Promise<NotificationDeleteResponse> {
    return this.deleteNotifications([notificationId]);
  },

  /**
   * Get notifications for a specific user (admin)
   *
   * Retrieve paginated list of notifications for a specific user.
   * Only available to admin users.
   *
   * Method: GET /users/{userId}/notifications
   * Requires: OAuth2 with notification:admin scope
   *
   * @param userId - User UUID
   * @param params - Pagination parameters
   * @returns Paginated notification list or count only
   */
  async getUserNotifications(
    userId: string,
    params?: UserNotificationParams
  ): Promise<UserNotificationListResponse | UserNotificationCountResponse> {
    try {
      const queryString = params ? buildQueryParams(params) : '';
      const url = queryString
        ? `/users/${userId}/notifications?${queryString}`
        : `/users/${userId}/notifications`;

      const response = await notificationClient.get(url);

      if (params?.countOnly) {
        return response.data as UserNotificationCountResponse;
      }

      return response.data as UserNotificationListResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  // =========================================================================
  // Convenience Methods
  // =========================================================================

  /**
   * Get all notifications (read and unread)
   *
   * Convenience method to get all notifications without filtering.
   */
  async getAllNotifications(
    params?: Omit<UserNotificationParams, 'countOnly'>
  ): Promise<UserNotificationListResponse> {
    const result = await this.getMyNotifications(params);
    return result as UserNotificationListResponse;
  },

  /**
   * Get only unread notifications
   *
   * This is the same as getMyNotifications since the API returns unread by default.
   * The isRead filter would need to be added to the API if filtering is needed.
   */
  async getUnreadNotifications(
    params?: Omit<UserNotificationParams, 'countOnly'>
  ): Promise<UserNotificationListResponse> {
    const result = await this.getMyNotifications(params);
    return result as UserNotificationListResponse;
  },

  /**
   * Clear all read notifications
   *
   * Helper method to delete all notifications that have been read.
   * Note: This requires first fetching all read notifications, then deleting them.
   */
  async clearReadNotifications(): Promise<NotificationDeleteResponse> {
    try {
      // First get all notifications to find read ones
      const allNotifications = await this.getAllNotifications({ limit: 1000 });

      if (!allNotifications.notifications?.length) {
        return {
          message: 'No notifications to clear',
          deletedNotificationIds: [],
        };
      }

      // Filter for read notifications
      const readNotificationIds = allNotifications.notifications
        .filter((n: UserNotification) => n.isRead)
        .map((n: UserNotification) => n.notificationId);

      if (readNotificationIds.length === 0) {
        return {
          message: 'No read notifications to clear',
          deletedNotificationIds: [],
        };
      }

      // Delete them
      return await this.deleteNotifications(readNotificationIds);
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Check if there are new notifications since last check
   *
   * Helper method for real-time notification checking.
   *
   * @param lastCheckTime - ISO timestamp of last check (optional)
   * @returns Whether there are new notifications and the count
   */
  async hasNewNotifications(
    lastCheckTime?: string
  ): Promise<HasNewNotificationsResponse> {
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
          (notification: UserNotification) =>
            notification.createdAt > lastCheckTime
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
