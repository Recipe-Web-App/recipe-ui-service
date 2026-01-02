import { notificationClient, handleNotificationApiError } from './client';
import type {
  PasswordResetRequest,
  WelcomeRequest,
  EmailChangedRequest,
  PasswordChangedRequest,
  MaintenanceRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * System Notifications API
 *
 * Methods for sending system-generated notifications (transactional, security, platform).
 * All endpoints return 202 Accepted with notifications queued for async processing.
 */
export const systemNotificationsApi = {
  /**
   * Send password reset email to a user
   *
   * Sends email with password reset link.
   * The service generates the reset token and URL.
   *
   * Method: POST /notifications/password-reset
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Password reset request with recipient ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyPasswordReset(
    data: PasswordResetRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/password-reset',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Send welcome notification to a new user
   *
   * Sends welcome email/notification after user registration.
   *
   * Method: POST /notifications/welcome
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Welcome request with recipient ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyWelcome(
    data: WelcomeRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/welcome',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify user when their email address is changed
   *
   * Sends security notification about email change.
   * Typically sent to both old and new email addresses.
   *
   * Method: POST /notifications/email-changed
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Email changed request with recipient and email info
   * @returns Batch notification response with queued notification IDs
   */
  async notifyEmailChanged(
    data: EmailChangedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/email-changed',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Notify user when their password is changed
   *
   * Sends security notification about password change.
   *
   * Method: POST /notifications/password-changed
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Password changed request with recipient ID
   * @returns Batch notification response with queued notification IDs
   */
  async notifyPasswordChanged(
    data: PasswordChangedRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/password-changed',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },

  /**
   * Send maintenance notification to users
   *
   * Sends platform maintenance announcement.
   * Typically sent to all users or specific segments.
   *
   * Method: POST /notifications/maintenance
   * Requires: OAuth2 with notification:admin scope
   *
   * @param data - Maintenance request with recipient IDs and maintenance info
   * @returns Batch notification response with queued notification IDs
   */
  async notifyMaintenance(
    data: MaintenanceRequest
  ): Promise<BatchNotificationResponse> {
    try {
      const response = await notificationClient.post(
        '/notifications/maintenance',
        data
      );
      return response.data as BatchNotificationResponse;
    } catch (error) {
      handleNotificationApiError(error);
      throw error;
    }
  },
};
