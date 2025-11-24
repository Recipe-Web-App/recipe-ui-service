/**
 * UI-specific types for notification components
 *
 * These types are for UI state and display logic, not API data.
 * API notification types are in @/types/user-management/notifications.ts
 */

/**
 * Notification filter options for the panel
 */
export type NotificationFilter = 'all' | 'social' | 'activity' | 'system';

/**
 * Notification type for color coding and styling
 */
export type NotificationDisplayType =
  | 'social'
  | 'activity'
  | 'system'
  | 'default';

/**
 * Notification panel position (for future use)
 */
export type NotificationPanelPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

/**
 * Notification item variant for different states
 */
export type NotificationItemVariant = 'default' | 'unread' | 'read';

/**
 * Props for notification action buttons
 */
export interface NotificationAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

/**
 * UI state for notification panel
 */
export interface NotificationPanelState {
  isPanelOpen: boolean;
  filter: NotificationFilter;
  lastCheckTime: Date | null;
}

/**
 * Utility type to map API notification type to display type
 */
export type NotificationTypeMapping = {
  [key: string]: NotificationDisplayType;
};

/**
 * Default mapping of notification types to display types
 * Can be extended based on actual notification types from backend
 */
export const DEFAULT_TYPE_MAPPING: NotificationTypeMapping = {
  // Social types
  follow: 'social',
  share: 'social',
  collection_add: 'social',

  // Activity types
  like: 'activity',
  comment: 'activity',
  rating: 'activity',
  featured: 'activity',
  trending: 'activity',

  // System types
  welcome: 'system',
  update: 'system',
  maintenance: 'system',

  // Default fallback
  default: 'default',
};
