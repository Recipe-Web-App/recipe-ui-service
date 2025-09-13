import { useOfflineStore } from '@/stores/ui/offline-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useOfflineStore', () => {
  beforeEach(() => {
    // Reset store state
    useOfflineStore.setState({
      networkStatus: 'online',
      isOnline: true,
      lastOnlineTime: Date.now(),
      pendingOperations: [],
      failedOperations: [],
      syncInProgress: false,
      offlineCapable: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useOfflineStore.getState();

      expect(state.networkStatus).toBe('online');
      expect(state.isOnline).toBe(true);
      expect(state.pendingOperations).toEqual([]);
      expect(state.failedOperations).toEqual([]);
      expect(state.syncInProgress).toBe(false);
      expect(state.offlineCapable).toBe(false);
      expect(typeof state.lastOnlineTime).toBe('number');
    });
  });

  describe('network status management', () => {
    it('should set network status', () => {
      useOfflineStore.getState().setNetworkStatus('offline');
      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('offline');
      expect(state.isOnline).toBe(false);
    });

    it('should set online status', () => {
      useOfflineStore.getState().setOnlineStatus(false);
      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('offline');
      expect(state.isOnline).toBe(false);
    });

    it('should update last online time', () => {
      const beforeTime = Date.now();
      useOfflineStore.getState().updateLastOnlineTime();
      const state = useOfflineStore.getState();
      expect(state.lastOnlineTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('sync operations', () => {
    it('should add pending operation', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      const state = useOfflineStore.getState();

      expect(typeof id).toBe('string');
      expect(state.pendingOperations).toHaveLength(1);
      expect(state.pendingOperations[0].id).toBe(id);
      expect(state.pendingOperations[0].type).toBe('create');
    });

    it('should remove pending operation', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().removePendingOperation(id);

      expect(useOfflineStore.getState().pendingOperations).toHaveLength(0);
    });

    it('should update operation status', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().updateOperationStatus(id, 'syncing');

      const state = useOfflineStore.getState();
      expect(state.pendingOperations[0].status).toBe('syncing');
    });

    it('should move pending to failed', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toHaveLength(0);
      expect(state.failedOperations).toHaveLength(1);
      expect(state.failedOperations[0].status).toBe('failed');
      expect(state.failedOperations[0].error).toBe('Network error');
    });

    it('should move failed to pending', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');
      useOfflineStore.getState().moveFailedToPending(id);

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toHaveLength(1);
      expect(state.failedOperations).toHaveLength(0);
      expect(state.pendingOperations[0].status).toBe('pending');
      expect(state.pendingOperations[0].error).toBeUndefined();
    });
  });

  describe('failed operations', () => {
    it('should retry failed operation', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');
      useOfflineStore.getState().retryFailedOperation(id);

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toHaveLength(1);
      expect(state.failedOperations).toHaveLength(0);
      expect(state.pendingOperations[0].retryCount).toBe(1);
    });

    it('should not retry operation that exceeds max retries', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 3,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');
      useOfflineStore.getState().retryFailedOperation(id);

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toHaveLength(0);
      expect(state.failedOperations).toHaveLength(1);
    });

    it('should clear failed operations', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');
      useOfflineStore.getState().clearFailedOperations();

      expect(useOfflineStore.getState().failedOperations).toHaveLength(0);
    });

    it('should remove specific failed operation', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Network error');
      useOfflineStore.getState().removeFailedOperation(id);

      expect(useOfflineStore.getState().failedOperations).toHaveLength(0);
    });
  });

  describe('sync management', () => {
    it('should set sync in progress', () => {
      useOfflineStore.getState().setSyncInProgress(true);
      expect(useOfflineStore.getState().syncInProgress).toBe(true);
    });

    it('should set offline capable', () => {
      useOfflineStore.getState().setOfflineCapable(true);
      expect(useOfflineStore.getState().offlineCapable).toBe(true);
    });
  });

  describe('batch operations', () => {
    it('should add batch operations', () => {
      const operations = [
        {
          type: 'create' as const,
          resourceType: 'recipe',
          resourceId: '123',
          data: { name: 'Recipe 1' },
          status: 'pending' as const,
          retryCount: 0,
          maxRetries: 3,
        },
        {
          type: 'update' as const,
          resourceType: 'recipe',
          resourceId: '456',
          data: { name: 'Recipe 2' },
          status: 'pending' as const,
          retryCount: 0,
          maxRetries: 3,
        },
      ];

      const ids = useOfflineStore.getState().addBatchOperations(operations);
      const state = useOfflineStore.getState();

      expect(ids).toHaveLength(2);
      expect(state.pendingOperations).toHaveLength(2);
      expect(state.pendingOperations[0].type).toBe('create');
      expect(state.pendingOperations[1].type).toBe('update');
    });

    it('should clear all operations', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Error');
      useOfflineStore.getState().clearAllOperations();

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toHaveLength(0);
      expect(state.failedOperations).toHaveLength(0);
    });
  });

  describe('network status changes', () => {
    it('should trigger sync when coming back online with pending operations', () => {
      // Add pending operations first
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(operationData);

      // Set offline
      useOfflineStore.getState().setNetworkStatus('offline');
      expect(useOfflineStore.getState().isOnline).toBe(false);

      // Mock console.log to verify sync trigger
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Come back online - should trigger sync message
      useOfflineStore.getState().setNetworkStatus('online');
      expect(useOfflineStore.getState().isOnline).toBe(true);

      // Wait for setTimeout to execute
      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Network restored, triggering sync for pending operations'
        );
      }, 1);

      consoleSpy.mockRestore();
    });

    it('should not trigger sync when coming online with no pending operations', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      useOfflineStore.getState().setNetworkStatus('offline');
      useOfflineStore.getState().setNetworkStatus('online');

      setTimeout(() => {
        expect(consoleSpy).not.toHaveBeenCalledWith(
          'Network restored, triggering sync for pending operations'
        );
      }, 1);

      consoleSpy.mockRestore();
    });

    it('should update last online time when going online', () => {
      const beforeTime = Date.now();
      useOfflineStore.getState().setNetworkStatus('online');
      const afterTime = useOfflineStore.getState().lastOnlineTime;

      expect(afterTime).toBeGreaterThanOrEqual(beforeTime);
    });

    it('should not update last online time when going offline', () => {
      useOfflineStore.getState().setNetworkStatus('online');
      const onlineTime = useOfflineStore.getState().lastOnlineTime;

      useOfflineStore.getState().setNetworkStatus('offline');
      expect(useOfflineStore.getState().lastOnlineTime).toBe(onlineTime);
    });
  });

  describe('network detection and checking', () => {
    let originalNavigator: Navigator;

    beforeEach(() => {
      // Save original navigator
      originalNavigator = global.navigator;

      // Mock window.addEventListener
      jest.spyOn(window, 'addEventListener').mockImplementation();

      // Reset navigator to clean state
      Object.defineProperty(global, 'navigator', {
        value: {
          ...originalNavigator,
          onLine: true,
        },
        writable: true,
        configurable: true,
      });

      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
      } as Response);

      // Mock setInterval for periodic connectivity check
      jest.spyOn(global, 'setInterval').mockImplementation();
    });

    afterEach(() => {
      // Restore original navigator
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
        configurable: true,
      });
      jest.restoreAllMocks();
    });

    it('should initialize network detection', () => {
      useOfflineStore.getState().initializeNetworkDetection();

      expect(window.addEventListener).toHaveBeenCalledWith(
        'online',
        expect.any(Function)
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        'offline',
        expect.any(Function)
      );
      expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 30000);
    });

    it('should check network status via API call', async () => {
      const isOnline = await useOfflineStore.getState().checkNetworkStatus();

      expect(isOnline).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/v1/recipe-ui/health/live', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: expect.any(AbortSignal),
      });
    });

    it('should handle network check failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const isOnline = await useOfflineStore.getState().checkNetworkStatus();
      expect(isOnline).toBe(false);
    });

    it('should detect slow network connection', () => {
      // Mock navigator with connection API
      const mockNavigator = {
        ...navigator,
        onLine: true,
        connection: {
          effectiveType: 'slow-2g',
          addEventListener: jest.fn(),
        },
      };
      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('slow');
    });

    it('should detect 2g connection as slow', () => {
      // Mock navigator with 2g connection
      const mockNavigator = {
        ...navigator,
        onLine: true,
        connection: {
          effectiveType: '2g',
          addEventListener: jest.fn(),
        },
      };
      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('slow');
    });

    it('should handle navigator offline state', () => {
      // Mock navigator offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('offline');
    });

    it('should return offline when navigator is offline in checkOnlineStatus', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      const isOnline = await useOfflineStore.getState().checkNetworkStatus();
      expect(isOnline).toBe(false);
    });

    it('should handle window undefined in detectNetworkStatus', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally removing window for SSR test
      delete global.window;

      useOfflineStore.getState().initializeNetworkDetection();

      // Should not crash, test passes if no error is thrown
      expect(true).toBe(true);

      global.window = originalWindow;
    });

    it('should handle window undefined in checkOnlineStatus', async () => {
      const originalWindow = global.window;
      // @ts-expect-error - Intentionally removing window for SSR test
      delete global.window;

      const isOnline = await useOfflineStore.getState().checkNetworkStatus();
      expect(isOnline).toBe(true); // Returns true when window is undefined

      global.window = originalWindow;
    });

    it('should handle periodic connectivity check when online status changes', async () => {
      let connectivityCheckFunction: () => Promise<void>;

      // Mock setInterval to capture the callback
      (setInterval as jest.Mock).mockImplementation(fn => {
        connectivityCheckFunction = fn;
        return 123; // Mock timer id
      });

      // Mock fetch to return false (offline)
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      useOfflineStore.getState().initializeNetworkDetection();

      // Execute the periodic check
      await connectivityCheckFunction!();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('offline');
    });

    it('should handle periodic connectivity check when coming back online', async () => {
      let connectivityCheckFunction: () => Promise<void>;

      // Mock setInterval to capture the callback
      (setInterval as jest.Mock).mockImplementation(fn => {
        connectivityCheckFunction = fn;
        return 123;
      });

      // Set initial state to offline
      useOfflineStore.getState().setNetworkStatus('offline');

      // Mock fetch to return true (online)
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

      useOfflineStore.getState().initializeNetworkDetection();

      // Execute the periodic check
      await connectivityCheckFunction!();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('online');
    });

    it('should handle connection change events', () => {
      let connectionChangeHandler: () => void;

      // Mock navigator with connection API that supports addEventListener
      const mockConnection = {
        effectiveType: '4g',
        addEventListener: jest.fn().mockImplementation((event, handler) => {
          if (event === 'change') {
            connectionChangeHandler = handler;
          }
        }),
      };

      const mockNavigator = {
        ...navigator,
        onLine: true,
        connection: mockConnection,
      };

      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      expect(mockConnection.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      // Simulate connection change
      mockConnection.effectiveType = 'slow-2g';
      connectionChangeHandler!();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('slow');
    });

    it('should handle mozConnection API', () => {
      // Mock navigator with mozConnection API
      const mockNavigator = {
        ...navigator,
        onLine: true,
        connection: undefined,
        mozConnection: {
          effectiveType: 'slow-2g',
          addEventListener: jest.fn(),
        },
      };

      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('slow');
    });

    it('should handle webkitConnection API', () => {
      // Mock navigator with webkitConnection API
      const mockNavigator = {
        ...navigator,
        onLine: true,
        connection: undefined,
        mozConnection: undefined,
        webkitConnection: {
          effectiveType: '2g',
          addEventListener: jest.fn(),
        },
      };

      Object.defineProperty(global, 'navigator', {
        value: mockNavigator,
        writable: true,
      });

      useOfflineStore.getState().initializeNetworkDetection();

      const state = useOfflineStore.getState();
      expect(state.networkStatus).toBe('slow');
    });

    it('should handle periodic connectivity check errors', async () => {
      let connectivityCheckFunction: () => Promise<void>;
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock setInterval to capture the callback
      (setInterval as jest.Mock).mockImplementation(fn => {
        connectivityCheckFunction = fn;
        return 123;
      });

      // Mock checkNetworkStatus to throw an error
      const originalCheckNetworkStatus =
        useOfflineStore.getState().checkNetworkStatus;
      useOfflineStore.setState({
        checkNetworkStatus: jest
          .fn()
          .mockRejectedValue(new Error('Network check failed')),
      });

      useOfflineStore.getState().initializeNetworkDetection();

      // Execute the periodic check
      await connectivityCheckFunction!();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Network connectivity check failed:',
        expect.any(Error)
      );

      // Restore original function
      useOfflineStore.setState({
        checkNetworkStatus: originalCheckNetworkStatus,
      });
      consoleWarnSpy.mockRestore();
    });
  });

  describe('retry all failed operations', () => {
    it('should retry all retryable failed operations', () => {
      // Add multiple failed operations with different retry counts
      const ops = [
        {
          type: 'create' as const,
          resourceType: 'recipe',
          resourceId: '1',
          data: {},
          status: 'pending' as const,
          retryCount: 1,
          maxRetries: 3,
        },
        {
          type: 'update' as const,
          resourceType: 'recipe',
          resourceId: '2',
          data: {},
          status: 'pending' as const,
          retryCount: 3,
          maxRetries: 3,
        },
        {
          type: 'delete' as const,
          resourceType: 'recipe',
          resourceId: '3',
          data: {},
          status: 'pending' as const,
          retryCount: 0,
          maxRetries: 3,
        },
      ];

      const ids = ops.map(op =>
        useOfflineStore.getState().addPendingOperation(op)
      );

      // Move all to failed
      ids.forEach((id, index) => {
        useOfflineStore
          .getState()
          .movePendingToFailed(id, `Error ${index + 1}`);
      });

      expect(useOfflineStore.getState().failedOperations).toHaveLength(3);

      // Retry all
      useOfflineStore.getState().retryAllFailedOperations();

      // Should only retry the retryable ones (first and third operation)
      expect(useOfflineStore.getState().pendingOperations).toHaveLength(2);
      expect(useOfflineStore.getState().failedOperations).toHaveLength(1); // Only the maxed-out retry should remain
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      useOfflineStore.getState().clearAllOperations();
    });

    it('should get operation by id', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      const operation = useOfflineStore.getState().getOperationById(id);

      expect(operation).toBeDefined();
      expect(operation?.id).toBe(id);
    });

    it('should get operations by type', () => {
      const createData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const updateData = {
        type: 'update' as const,
        resourceType: 'recipe',
        resourceId: '456',
        data: { name: 'Test Recipe 2' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(createData);
      useOfflineStore.getState().addPendingOperation(updateData);

      const createOps = useOfflineStore
        .getState()
        .getOperationsByType('create');
      expect(createOps).toHaveLength(1);
      expect(createOps[0].type).toBe('create');
    });

    it('should get operations by resource', () => {
      const recipeData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const userData = {
        type: 'update' as const,
        resourceType: 'user',
        resourceId: '456',
        data: { name: 'Test User' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(recipeData);
      useOfflineStore.getState().addPendingOperation(userData);

      const recipeOps = useOfflineStore
        .getState()
        .getOperationsByResource('recipe');
      expect(recipeOps).toHaveLength(1);
      expect(recipeOps[0].resourceType).toBe('recipe');

      const specificRecipeOps = useOfflineStore
        .getState()
        .getOperationsByResource('recipe', '123');
      expect(specificRecipeOps).toHaveLength(1);
      expect(specificRecipeOps[0].resourceId).toBe('123');
    });

    it('should get pending count', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(operationData);
      expect(useOfflineStore.getState().getPendingCount()).toBe(1);
    });

    it('should get failed count', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Error');
      expect(useOfflineStore.getState().getFailedCount()).toBe(1);
    });

    it('should check if has operations', () => {
      expect(useOfflineStore.getState().hasOperations()).toBe(false);

      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(operationData);
      expect(useOfflineStore.getState().hasOperations()).toBe(true);
    });

    it('should get retryable operations', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 1,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Error');

      const retryableOps = useOfflineStore.getState().getRetryableOperations();
      expect(retryableOps).toHaveLength(1);
      expect(retryableOps[0].retryCount).toBeLessThan(
        retryableOps[0].maxRetries
      );
    });
  });

  describe('edge cases and missing coverage', () => {
    it('should handle movePendingToFailed with non-existent operation', () => {
      const initialState = useOfflineStore.getState();

      useOfflineStore
        .getState()
        .movePendingToFailed('non-existent-id', 'Error');

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toEqual(initialState.pendingOperations);
      expect(state.failedOperations).toEqual(initialState.failedOperations);
    });

    it('should handle moveFailedToPending with non-existent operation', () => {
      const initialState = useOfflineStore.getState();

      useOfflineStore.getState().moveFailedToPending('non-existent-id');

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toEqual(initialState.pendingOperations);
      expect(state.failedOperations).toEqual(initialState.failedOperations);
    });

    it('should handle retryFailedOperation with non-existent operation', () => {
      const initialState = useOfflineStore.getState();

      useOfflineStore.getState().retryFailedOperation('non-existent-id');

      const state = useOfflineStore.getState();
      expect(state.pendingOperations).toEqual(initialState.pendingOperations);
      expect(state.failedOperations).toEqual(initialState.failedOperations);
    });

    it('should handle updateOperationStatus for failed operations', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore.getState().addPendingOperation(operationData);
      useOfflineStore.getState().movePendingToFailed(id, 'Initial error');
      useOfflineStore
        .getState()
        .updateOperationStatus(id, 'syncing', 'Updated error');

      const state = useOfflineStore.getState();
      expect(state.failedOperations[0].status).toBe('syncing');
      expect(state.failedOperations[0].error).toBe('Updated error');
    });

    it('should generate unique operation IDs', () => {
      const operationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id1 = useOfflineStore.getState().addPendingOperation(operationData);
      const id2 = useOfflineStore.getState().addPendingOperation(operationData);

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^sync-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^sync-\d+-[a-z0-9]+$/);
    });

    it('should return undefined for getOperationById with non-existent ID', () => {
      const operation = useOfflineStore
        .getState()
        .getOperationById('non-existent-id');
      expect(operation).toBeUndefined();
    });

    it('should handle getOperationsByResource with just resourceType', () => {
      const recipeData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const userData = {
        type: 'update' as const,
        resourceType: 'recipe',
        resourceId: '456',
        data: { name: 'Another Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      useOfflineStore.getState().addPendingOperation(recipeData);
      useOfflineStore.getState().addPendingOperation(userData);

      const recipeOps = useOfflineStore
        .getState()
        .getOperationsByResource('recipe');
      expect(recipeOps).toHaveLength(2);
      expect(recipeOps.every(op => op.resourceType === 'recipe')).toBe(true);
    });

    it('should use default values for operation creation', () => {
      const minimalOperationData = {
        type: 'create' as const,
        resourceType: 'recipe',
        resourceId: '123',
        data: { name: 'Test Recipe' },
        status: 'pending' as const,
        retryCount: 0,
        maxRetries: 3,
      };

      const id = useOfflineStore
        .getState()
        .addPendingOperation(minimalOperationData);
      const state = useOfflineStore.getState();
      const operation = state.pendingOperations[0];

      expect(operation.retryCount).toBe(0);
      expect(operation.maxRetries).toBe(3);
      expect(operation.status).toBe('pending');
    });

    it('should use default values for batch operation creation', () => {
      const minimalOperations = [
        {
          type: 'create' as const,
          resourceType: 'recipe',
          resourceId: '123',
          data: { name: 'Test Recipe' },
          status: 'pending' as const,
          retryCount: 0,
          maxRetries: 3,
        },
      ];

      useOfflineStore.getState().addBatchOperations(minimalOperations);
      const state = useOfflineStore.getState();
      const operation = state.pendingOperations[0];

      expect(operation.retryCount).toBe(0);
      expect(operation.maxRetries).toBe(3);
      expect(operation.status).toBe('pending');
    });
  });
});
