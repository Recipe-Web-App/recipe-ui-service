import { create } from 'zustand';
import type {
  NotificationFilter,
  NotificationPanelState,
} from '@/types/ui/notification';

/**
 * Notification Panel Store
 *
 * Manages UI state for the notification panel dropdown:
 * - Panel open/closed state
 * - Active filter (all, social, activity, system)
 * - Last check time for "new since last check" logic
 */
interface NotificationPanelStoreState extends NotificationPanelState {
  // Actions
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  setFilter: (filter: NotificationFilter) => void;
  updateLastCheckTime: () => void;
  resetLastCheckTime: () => void;

  // Utility methods
  isFilterActive: (filter: NotificationFilter) => boolean;
}

export const useNotificationPanelStore = create<NotificationPanelStoreState>(
  (set, get) => ({
    // Initial state
    isPanelOpen: false,
    filter: 'all',
    lastCheckTime: null,

    // Actions
    openPanel: () => {
      set({ isPanelOpen: true });
      // Update last check time when panel opens
      get().updateLastCheckTime();
    },

    closePanel: () => {
      set({ isPanelOpen: false });
    },

    togglePanel: () => {
      const { isPanelOpen } = get();
      if (isPanelOpen) {
        get().closePanel();
      } else {
        get().openPanel();
      }
    },

    setFilter: (filter: NotificationFilter) => {
      set({ filter });
    },

    updateLastCheckTime: () => {
      set({ lastCheckTime: new Date() });
    },

    resetLastCheckTime: () => {
      set({ lastCheckTime: null });
    },

    // Utility methods
    isFilterActive: (filter: NotificationFilter) => {
      return get().filter === filter;
    },
  })
);
