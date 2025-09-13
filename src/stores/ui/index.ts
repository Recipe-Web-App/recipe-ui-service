// Import all stores first
import { useToastStore } from './toast-store';
import { useThemeStore } from './theme-store';
import { useNavigationStore } from './navigation-store';
import { useModalStore } from './modal-store';
import { useLoadingStore } from './loading-store';
import { useSearchFilterStore } from './search-filter-store';
import { useLayoutStore } from './layout-store';
import { useInteractionStore } from './interaction-store';
import { useOfflineStore } from './offline-store';
import { useAccessibilityStore } from './accessibility-store';
import { useFeatureStore } from './feature-store';

// Individual store exports
export { useToastStore } from './toast-store';
export { useThemeStore } from './theme-store';
export { useNavigationStore } from './navigation-store';
export { useModalStore } from './modal-store';
export { useLoadingStore } from './loading-store';
export { useSearchFilterStore } from './search-filter-store';
export { useLayoutStore } from './layout-store';
export { useInteractionStore } from './interaction-store';
export { useOfflineStore } from './offline-store';
export { useAccessibilityStore } from './accessibility-store';
export { useFeatureStore } from './feature-store';

// Re-export types for convenience
export type * from '@/types/ui';

// Composed hooks for common usage patterns
export const useUI = () => ({
  toast: useToastStore(),
  theme: useThemeStore(),
  navigation: useNavigationStore(),
  modal: useModalStore(),
  loading: useLoadingStore(),
  search: useSearchFilterStore(),
  layout: useLayoutStore(),
  interaction: useInteractionStore(),
  offline: useOfflineStore(),
  accessibility: useAccessibilityStore(),
  features: useFeatureStore(),
});

// Utility hooks for common patterns
export const useNotifications = () => {
  const toast = useToastStore();
  const accessibility = useAccessibilityStore();

  return {
    success: (message: string) => {
      const id = toast.addSuccessToast(message);
      accessibility.announce(`Success: ${message}`, 'polite');
      return id;
    },
    error: (message: string) => {
      const id = toast.addErrorToast(message);
      accessibility.announce(`Error: ${message}`, 'assertive');
      return id;
    },
    warning: (message: string) => {
      const id = toast.addWarningToast(message);
      accessibility.announce(`Warning: ${message}`, 'polite');
      return id;
    },
    info: (message: string) => {
      const id = toast.addInfoToast(message);
      accessibility.announce(`Info: ${message}`, 'polite');
      return id;
    },
  };
};

export const useAppState = () => {
  const loading = useLoadingStore();
  const offline = useOfflineStore();
  const modal = useModalStore();

  return {
    isLoading: loading.isAnyLoading(),
    isOffline: !offline.isOnline,
    hasModals: modal.hasOpenModals(),
    appReady: !loading.globalLoading && offline.isOnline,
  };
};

export const useFeatureFlag = (featureKey: string) => {
  const features = useFeatureStore();

  return {
    isEnabled: features.isFeatureEnabled(featureKey),
    variant: features.getFeatureVariant(featureKey),
    feature: features.getFeature(featureKey),
  };
};

export const useSelection = () => {
  const interaction = useInteractionStore();

  return {
    selectedItems: interaction.selectedItems,
    selectedCount: interaction.getSelectedCount(),
    isSelected: interaction.isItemSelected,
    select: interaction.selectItem,
    deselect: interaction.deselectItem,
    toggle: interaction.toggleSelection,
    selectAll: interaction.selectAll,
    clear: interaction.clearSelection,
    selectRange: interaction.selectRange,
  };
};

export const useRecentItems = () => {
  const interaction = useInteractionStore();

  return {
    recentItems: interaction.recentlyViewed,
    addRecent: interaction.addToRecentlyViewed,
    removeRecent: interaction.removeFromRecentlyViewed,
    clearRecent: interaction.clearRecentlyViewed,
    getRecent: interaction.getRecentItem,
  };
};

export const useSync = () => {
  const offline = useOfflineStore();

  return {
    isOnline: offline.isOnline,
    pendingCount: offline.getPendingCount(),
    failedCount: offline.getFailedCount(),
    addOperation: offline.addPendingOperation,
    retryFailed: offline.retryAllFailedOperations,
    clearFailed: offline.clearFailedOperations,
    syncInProgress: offline.syncInProgress,
  };
};

// Initialization hook for setting up UI stores
export const useInitializeUI = () => {
  const theme = useThemeStore();
  const accessibility = useAccessibilityStore();
  const offline = useOfflineStore();

  return {
    initialize: () => {
      theme.initializeFromSystem();
      accessibility.initializeFromSystem();
      offline.initializeNetworkDetection();
    },
  };
};
