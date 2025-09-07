import type { PaginatedResponse, CountOnlyResponse } from './common';

// Notification Core Types
export interface Notification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification List Responses
export type NotificationListResponse = PaginatedResponse<
  Notification,
  'notifications'
>;

export type NotificationCountResponse = CountOnlyResponse;

// Notification Management Types
export interface NotificationReadResponse {
  message: string;
}

export interface NotificationReadAllResponse {
  message: string;
  readNotificationIds: string[];
}

export interface NotificationDeleteRequest {
  notificationIds: string[];
}

export interface NotificationDeleteResponse {
  message?: string;
  deleted_notification_ids?: string[];
}
