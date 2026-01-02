import { useMutation } from '@tanstack/react-query';
import { systemNotificationsApi } from '@/lib/api/notification';
import type {
  PasswordResetRequest,
  WelcomeRequest,
  EmailChangedRequest,
  PasswordChangedRequest,
  MaintenanceRequest,
  BatchNotificationResponse,
} from '@/types/notification';

/**
 * System Notifications Hooks
 *
 * React hooks for sending system-generated notifications.
 * Used for transactional, security, and platform notifications.
 */

/**
 * Hook to send password reset email
 */
export const useNotifyPasswordReset = () => {
  return useMutation<BatchNotificationResponse, Error, PasswordResetRequest>({
    mutationFn: data => systemNotificationsApi.notifyPasswordReset(data),
  });
};

/**
 * Hook to send welcome notification to new users
 */
export const useNotifyWelcome = () => {
  return useMutation<BatchNotificationResponse, Error, WelcomeRequest>({
    mutationFn: data => systemNotificationsApi.notifyWelcome(data),
  });
};

/**
 * Hook to notify user when their email address is changed
 */
export const useNotifyEmailChanged = () => {
  return useMutation<BatchNotificationResponse, Error, EmailChangedRequest>({
    mutationFn: data => systemNotificationsApi.notifyEmailChanged(data),
  });
};

/**
 * Hook to notify user when their password is changed
 */
export const useNotifyPasswordChanged = () => {
  return useMutation<BatchNotificationResponse, Error, PasswordChangedRequest>({
    mutationFn: data => systemNotificationsApi.notifyPasswordChanged(data),
  });
};

/**
 * Hook to send maintenance notification to users
 */
export const useNotifyMaintenance = () => {
  return useMutation<BatchNotificationResponse, Error, MaintenanceRequest>({
    mutationFn: data => systemNotificationsApi.notifyMaintenance(data),
  });
};
