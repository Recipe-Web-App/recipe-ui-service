import { act } from '@testing-library/react';
import { useLoadingStore } from '@/stores/ui/loading-store';

describe('useLoadingStore', () => {
  beforeEach(() => {
    // Reset store state
    useLoadingStore.setState({
      globalLoading: false,
      operationLoading: {},
      loadingMessage: null,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useLoadingStore.getState();

      expect(state.globalLoading).toBe(false);
      expect(state.operationLoading).toEqual({});
      expect(state.loadingMessage).toBeNull();
    });
  });

  describe('global loading', () => {
    describe('setGlobalLoading', () => {
      it('should set global loading to true', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true);
        });

        const state = useLoadingStore.getState();
        expect(state.globalLoading).toBe(true);
        expect(state.loadingMessage).toBeNull();
      });

      it('should set global loading to true with message', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true, 'Loading data...');
        });

        const state = useLoadingStore.getState();
        expect(state.globalLoading).toBe(true);
        expect(state.loadingMessage).toBe('Loading data...');
      });

      it('should set global loading to false and clear message', () => {
        // First set loading with message
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true, 'Loading...');
        });

        // Then turn off loading
        act(() => {
          useLoadingStore.getState().setGlobalLoading(false);
        });

        const state = useLoadingStore.getState();
        expect(state.globalLoading).toBe(false);
        expect(state.loadingMessage).toBeNull();
      });
    });
  });

  describe('operation loading', () => {
    describe('setOperationLoading', () => {
      it('should set operation loading to true', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
        });

        const state = useLoadingStore.getState();
        expect(state.operationLoading['fetch-users']).toBe(true);
      });

      it('should set operation loading to false and remove from object', () => {
        // First set loading
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
        });

        expect(useLoadingStore.getState().operationLoading['fetch-users']).toBe(
          true
        );

        // Then turn off loading
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', false);
        });

        const state = useLoadingStore.getState();
        expect(state.operationLoading['fetch-users']).toBeUndefined();
        expect(Object.keys(state.operationLoading)).toHaveLength(0);
      });

      it('should handle multiple operations independently', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        });

        const state = useLoadingStore.getState();
        expect(state.operationLoading['fetch-users']).toBe(true);
        expect(state.operationLoading['fetch-posts']).toBe(true);
        expect(Object.keys(state.operationLoading)).toHaveLength(2);

        // Turn off one operation
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', false);
        });

        const updatedState = useLoadingStore.getState();
        expect(updatedState.operationLoading['fetch-users']).toBeUndefined();
        expect(updatedState.operationLoading['fetch-posts']).toBe(true);
        expect(Object.keys(updatedState.operationLoading)).toHaveLength(1);
      });
    });

    describe('clearOperationLoading', () => {
      it('should clear specific operation loading', () => {
        // Set up multiple operations
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        });

        // Clear one operation
        act(() => {
          useLoadingStore.getState().clearOperationLoading('fetch-users');
        });

        const state = useLoadingStore.getState();
        expect(state.operationLoading['fetch-users']).toBeUndefined();
        expect(state.operationLoading['fetch-posts']).toBe(true);
      });

      it('should do nothing when clearing non-existent operation', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
        });

        act(() => {
          useLoadingStore.getState().clearOperationLoading('non-existent');
        });

        const state = useLoadingStore.getState();
        expect(state.operationLoading['fetch-users']).toBe(true);
        expect(Object.keys(state.operationLoading)).toHaveLength(1);
      });
    });
  });

  describe('clearAllLoading', () => {
    it('should clear all loading states', () => {
      // Set up various loading states
      act(() => {
        useLoadingStore.getState().setGlobalLoading(true, 'Global loading...');
        useLoadingStore.getState().setOperationLoading('fetch-users', true);
        useLoadingStore.getState().setOperationLoading('fetch-posts', true);
      });

      // Verify setup
      expect(useLoadingStore.getState().globalLoading).toBe(true);
      expect(useLoadingStore.getState().loadingMessage).toBe(
        'Global loading...'
      );
      expect(
        Object.keys(useLoadingStore.getState().operationLoading)
      ).toHaveLength(2);

      // Clear all
      act(() => {
        useLoadingStore.getState().clearAllLoading();
      });

      const state = useLoadingStore.getState();
      expect(state.globalLoading).toBe(false);
      expect(state.loadingMessage).toBeNull();
      expect(state.operationLoading).toEqual({});
    });
  });

  describe('utility methods', () => {
    describe('isAnyLoading', () => {
      it('should return true when global loading is active', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true);
        });

        expect(useLoadingStore.getState().isAnyLoading()).toBe(true);
      });

      it('should return true when any operation is loading', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-data', true);
        });

        expect(useLoadingStore.getState().isAnyLoading()).toBe(true);
      });

      it('should return true when both global and operation loading are active', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true);
          useLoadingStore.getState().setOperationLoading('fetch-data', true);
        });

        expect(useLoadingStore.getState().isAnyLoading()).toBe(true);
      });

      it('should return false when no loading is active', () => {
        expect(useLoadingStore.getState().isAnyLoading()).toBe(false);
      });
    });

    describe('isOperationLoading', () => {
      it('should return true for active operation', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
        });

        expect(
          useLoadingStore.getState().isOperationLoading('fetch-users')
        ).toBe(true);
      });

      it('should return false for inactive operation', () => {
        expect(
          useLoadingStore.getState().isOperationLoading('fetch-users')
        ).toBe(false);
      });

      it('should return false for non-existent operation', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
        });

        expect(
          useLoadingStore.getState().isOperationLoading('fetch-posts')
        ).toBe(false);
      });
    });

    describe('getLoadingOperations', () => {
      it('should return empty array when no operations are loading', () => {
        expect(useLoadingStore.getState().getLoadingOperations()).toEqual([]);
      });

      it('should return array of loading operations', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        });

        const operations = useLoadingStore.getState().getLoadingOperations();
        expect(operations).toContain('fetch-users');
        expect(operations).toContain('fetch-posts');
        expect(operations).toHaveLength(2);
      });

      it('should not include operations that have been turned off', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
          useLoadingStore.getState().setOperationLoading('fetch-users', false);
        });

        const operations = useLoadingStore.getState().getLoadingOperations();
        expect(operations).not.toContain('fetch-users');
        expect(operations).toContain('fetch-posts');
        expect(operations).toHaveLength(1);
      });
    });

    describe('getLoadingCount', () => {
      it('should return 0 when nothing is loading', () => {
        expect(useLoadingStore.getState().getLoadingCount()).toBe(0);
      });

      it('should return 1 when only global loading is active', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true);
        });

        expect(useLoadingStore.getState().getLoadingCount()).toBe(1);
      });

      it('should return count of operations when only operation loading is active', () => {
        act(() => {
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        });

        expect(useLoadingStore.getState().getLoadingCount()).toBe(2);
      });

      it('should return total count when both global and operation loading are active', () => {
        act(() => {
          useLoadingStore.getState().setGlobalLoading(true);
          useLoadingStore.getState().setOperationLoading('fetch-users', true);
          useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        });

        expect(useLoadingStore.getState().getLoadingCount()).toBe(3);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical API loading flow', () => {
      // Start global loading
      act(() => {
        useLoadingStore.getState().setGlobalLoading(true, 'Initializing...');
      });

      expect(useLoadingStore.getState().isAnyLoading()).toBe(true);
      expect(useLoadingStore.getState().getLoadingCount()).toBe(1);

      // Add specific operations
      act(() => {
        useLoadingStore
          .getState()
          .setOperationLoading('fetch-user-profile', true);
        useLoadingStore
          .getState()
          .setOperationLoading('fetch-user-preferences', true);
      });

      expect(useLoadingStore.getState().getLoadingCount()).toBe(3);
      expect(useLoadingStore.getState().getLoadingOperations()).toHaveLength(2);

      // Complete operations one by one
      act(() => {
        useLoadingStore
          .getState()
          .setOperationLoading('fetch-user-profile', false);
      });

      expect(useLoadingStore.getState().getLoadingCount()).toBe(2);
      expect(
        useLoadingStore.getState().isOperationLoading('fetch-user-profile')
      ).toBe(false);
      expect(
        useLoadingStore.getState().isOperationLoading('fetch-user-preferences')
      ).toBe(true);

      // Complete remaining operation
      act(() => {
        useLoadingStore
          .getState()
          .setOperationLoading('fetch-user-preferences', false);
      });

      expect(useLoadingStore.getState().getLoadingCount()).toBe(1);
      expect(useLoadingStore.getState().globalLoading).toBe(true);

      // Complete global loading
      act(() => {
        useLoadingStore.getState().setGlobalLoading(false);
      });

      expect(useLoadingStore.getState().isAnyLoading()).toBe(false);
      expect(useLoadingStore.getState().getLoadingCount()).toBe(0);
    });

    it('should handle concurrent operations with same name', () => {
      // Start operation
      act(() => {
        useLoadingStore.getState().setOperationLoading('fetch-data', true);
      });

      expect(useLoadingStore.getState().isOperationLoading('fetch-data')).toBe(
        true
      );

      // Setting same operation to true again should not affect state
      act(() => {
        useLoadingStore.getState().setOperationLoading('fetch-data', true);
      });

      expect(useLoadingStore.getState().isOperationLoading('fetch-data')).toBe(
        true
      );
      expect(useLoadingStore.getState().getLoadingOperations()).toHaveLength(1);

      // Turn off operation
      act(() => {
        useLoadingStore.getState().setOperationLoading('fetch-data', false);
      });

      expect(useLoadingStore.getState().isOperationLoading('fetch-data')).toBe(
        false
      );
    });

    it('should handle emergency clear all during complex loading state', () => {
      // Set up complex loading state
      act(() => {
        useLoadingStore
          .getState()
          .setGlobalLoading(true, 'Complex operation...');
        useLoadingStore.getState().setOperationLoading('fetch-users', true);
        useLoadingStore.getState().setOperationLoading('fetch-posts', true);
        useLoadingStore.getState().setOperationLoading('upload-file', true);
      });

      // Verify complex state
      expect(useLoadingStore.getState().getLoadingCount()).toBe(4);
      expect(useLoadingStore.getState().isAnyLoading()).toBe(true);
      expect(useLoadingStore.getState().loadingMessage).toBe(
        'Complex operation...'
      );

      // Emergency clear all
      act(() => {
        useLoadingStore.getState().clearAllLoading();
      });

      // Everything should be reset
      const state = useLoadingStore.getState();
      expect(state.globalLoading).toBe(false);
      expect(state.operationLoading).toEqual({});
      expect(state.loadingMessage).toBeNull();
      expect(state.isAnyLoading()).toBe(false);
      expect(state.getLoadingCount()).toBe(0);
      expect(state.getLoadingOperations()).toEqual([]);
    });
  });
});
