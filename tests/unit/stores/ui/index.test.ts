import {
  useUI,
  useNotifications,
  useAppState,
  useFeatureFlag,
  useSelection,
  useRecentItems,
  useSync,
  useInitializeUI,
} from '@/stores/ui';

// Mock all the individual stores with proper return values
jest.mock('@/stores/ui/toast-store', () => ({
  useToastStore: jest.fn(() => ({
    addSuccessToast: jest.fn(() => 'success-id'),
    addErrorToast: jest.fn(() => 'error-id'),
    addWarningToast: jest.fn(() => 'warning-id'),
    addInfoToast: jest.fn(() => 'info-id'),
  })),
}));

jest.mock('@/stores/ui/theme-store', () => ({
  useThemeStore: jest.fn(() => ({
    initializeFromSystem: jest.fn(),
  })),
}));

jest.mock('@/stores/ui/navigation-store', () => ({
  useNavigationStore: jest.fn(() => ({})),
}));

jest.mock('@/stores/ui/modal-store', () => ({
  useModalStore: jest.fn(() => ({
    hasOpenModals: jest.fn(() => false),
  })),
}));

jest.mock('@/stores/ui/loading-store', () => ({
  useLoadingStore: jest.fn(() => ({
    isAnyLoading: jest.fn(() => false),
    globalLoading: false,
  })),
}));

jest.mock('@/stores/ui/search-filter-store', () => ({
  useSearchFilterStore: jest.fn(() => ({})),
}));

jest.mock('@/stores/ui/layout-store', () => ({
  useLayoutStore: jest.fn(() => ({})),
}));

jest.mock('@/stores/ui/interaction-store', () => ({
  useInteractionStore: jest.fn(() => ({
    selectedItems: [],
    getSelectedCount: jest.fn(() => 0),
    isItemSelected: jest.fn(() => false),
    selectItem: jest.fn(),
    deselectItem: jest.fn(),
    toggleSelection: jest.fn(),
    selectAll: jest.fn(),
    clearSelection: jest.fn(),
    selectRange: jest.fn(),
    recentlyViewed: [],
    addToRecentlyViewed: jest.fn(),
    removeFromRecentlyViewed: jest.fn(),
    clearRecentlyViewed: jest.fn(),
    getRecentItem: jest.fn(),
  })),
}));

jest.mock('@/stores/ui/offline-store', () => ({
  useOfflineStore: jest.fn(() => ({
    isOnline: true,
    getPendingCount: jest.fn(() => 0),
    getFailedCount: jest.fn(() => 0),
    addPendingOperation: jest.fn(),
    retryAllFailedOperations: jest.fn(),
    clearFailedOperations: jest.fn(),
    syncInProgress: false,
    initializeNetworkDetection: jest.fn(),
  })),
}));

jest.mock('@/stores/ui/accessibility-store', () => ({
  useAccessibilityStore: jest.fn(() => ({
    announce: jest.fn(),
    initializeFromSystem: jest.fn(),
  })),
}));

jest.mock('@/stores/ui/feature-store', () => ({
  useFeatureStore: jest.fn(() => ({
    isFeatureEnabled: jest.fn(() => false),
    getFeatureVariant: jest.fn(() => null),
    getFeature: jest.fn(() => null),
  })),
}));

describe('UI Store Index', () => {
  describe('exports', () => {
    it('should export all composed hooks', () => {
      expect(useUI).toBeDefined();
      expect(useNotifications).toBeDefined();
      expect(useAppState).toBeDefined();
      expect(useFeatureFlag).toBeDefined();
      expect(useSelection).toBeDefined();
      expect(useRecentItems).toBeDefined();
      expect(useSync).toBeDefined();
      expect(useInitializeUI).toBeDefined();
    });

    it('should export hooks as functions', () => {
      expect(typeof useUI).toBe('function');
      expect(typeof useNotifications).toBe('function');
      expect(typeof useAppState).toBe('function');
      expect(typeof useFeatureFlag).toBe('function');
      expect(typeof useSelection).toBe('function');
      expect(typeof useRecentItems).toBe('function');
      expect(typeof useSync).toBe('function');
      expect(typeof useInitializeUI).toBe('function');
    });
  });

  describe('module structure', () => {
    it('should provide complete API surface', () => {
      // Test that all hooks exist and can be imported
      expect(useUI).toBeDefined();
      expect(useNotifications).toBeDefined();
      expect(useAppState).toBeDefined();
      expect(useFeatureFlag).toBeDefined();
      expect(useSelection).toBeDefined();
      expect(useRecentItems).toBeDefined();
      expect(useSync).toBeDefined();
      expect(useInitializeUI).toBeDefined();
    });

    it('should maintain consistent API patterns', () => {
      // All hooks should be functions
      const hooks = [
        useUI,
        useNotifications,
        useAppState,
        useFeatureFlag,
        useSelection,
        useRecentItems,
        useSync,
        useInitializeUI,
      ];

      hooks.forEach(hook => {
        expect(typeof hook).toBe('function');
      });
    });
  });
});
