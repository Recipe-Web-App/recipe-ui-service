import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OfflineStoreState,
  SyncOperation,
  NetworkStatus,
  SyncOperationType,
  SyncOperationStatus,
} from '@/types/ui/offline';

const generateOperationId = (): string => {
  return `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const detectNetworkStatus = (): NetworkStatus => {
  if (typeof window === 'undefined') return 'online';

  if (!navigator.onLine) return 'offline';

  // Check connection speed if available
  const navigator_extended = navigator as Navigator & {
    connection?: { effectiveType: string };
    mozConnection?: { effectiveType: string };
    webkitConnection?: { effectiveType: string };
  };
  const connection =
    navigator_extended.connection ??
    navigator_extended.mozConnection ??
    navigator_extended.webkitConnection;

  if (connection) {
    if (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    ) {
      return 'slow';
    }
  }

  return 'online';
};

const checkOnlineStatus = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return true;

  if (!navigator.onLine) return false;

  try {
    // Try to fetch a small resource to verify connectivity
    const response = await fetch('/api/v1/recipe-ui/health/live', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const useOfflineStore = create<OfflineStoreState>()(
  persist(
    (set, get) => ({
      networkStatus: 'online',
      isOnline: true,
      lastOnlineTime: Date.now(),
      pendingOperations: [],
      failedOperations: [],
      syncInProgress: false,
      offlineCapable: false,

      setNetworkStatus: (status: NetworkStatus) => {
        const wasOnline = get().isOnline;
        const isOnline = status === 'online';

        set({
          networkStatus: status,
          isOnline,
          lastOnlineTime: isOnline ? Date.now() : get().lastOnlineTime,
        });

        // If we just came back online, trigger sync
        if (!wasOnline && isOnline && get().pendingOperations.length > 0) {
          // Trigger sync in next tick to avoid state update conflicts
          setTimeout(() => {
            // Here you would trigger your sync logic
            console.log(
              'Network restored, triggering sync for pending operations'
            );
          }, 0);
        }
      },

      setOnlineStatus: (online: boolean) => {
        const status: NetworkStatus = online ? 'online' : 'offline';
        get().setNetworkStatus(status);
      },

      updateLastOnlineTime: () => {
        set({ lastOnlineTime: Date.now() });
      },

      addPendingOperation: operationData => {
        const id = generateOperationId();
        const now = Date.now();

        const operation: SyncOperation = {
          id,
          createdAt: now,
          updatedAt: now,
          ...operationData,
          retryCount: operationData.retryCount || 0,
          maxRetries: operationData.maxRetries || 3,
          status: 'pending',
        };

        set(state => ({
          pendingOperations: [...state.pendingOperations, operation],
        }));

        return id;
      },

      removePendingOperation: (id: string) => {
        set(state => ({
          pendingOperations: state.pendingOperations.filter(op => op.id !== id),
        }));
      },

      updateOperationStatus: (
        id: string,
        status: SyncOperationStatus,
        error?: string
      ) => {
        const now = Date.now();

        set(state => ({
          pendingOperations: state.pendingOperations.map(op =>
            op.id === id ? { ...op, status, error, updatedAt: now } : op
          ),
          failedOperations: state.failedOperations.map(op =>
            op.id === id ? { ...op, status, error, updatedAt: now } : op
          ),
        }));
      },

      movePendingToFailed: (id: string, error: string) => {
        set(state => {
          const operation = state.pendingOperations.find(op => op.id === id);
          if (!operation) return state;

          const failedOperation: SyncOperation = {
            ...operation,
            status: 'failed',
            error,
            updatedAt: Date.now(),
          };

          return {
            pendingOperations: state.pendingOperations.filter(
              op => op.id !== id
            ),
            failedOperations: [...state.failedOperations, failedOperation],
          };
        });
      },

      moveFailedToPending: (id: string) => {
        set(state => {
          const operation = state.failedOperations.find(op => op.id === id);
          if (!operation) return state;

          const pendingOperation: SyncOperation = {
            ...operation,
            status: 'pending',
            error: undefined,
            updatedAt: Date.now(),
          };

          return {
            failedOperations: state.failedOperations.filter(op => op.id !== id),
            pendingOperations: [...state.pendingOperations, pendingOperation],
          };
        });
      },

      retryFailedOperation: (id: string) => {
        set(state => {
          const operation = state.failedOperations.find(op => op.id === id);
          if (!operation || operation.retryCount >= operation.maxRetries)
            return state;

          const retryOperation: SyncOperation = {
            ...operation,
            status: 'pending',
            retryCount: operation.retryCount + 1,
            error: undefined,
            updatedAt: Date.now(),
          };

          return {
            failedOperations: state.failedOperations.filter(op => op.id !== id),
            pendingOperations: [...state.pendingOperations, retryOperation],
          };
        });
      },

      retryAllFailedOperations: () => {
        const retryableOps = get().getRetryableOperations();
        retryableOps.forEach(op => get().retryFailedOperation(op.id));
      },

      clearFailedOperations: () => {
        set({ failedOperations: [] });
      },

      removeFailedOperation: (id: string) => {
        set(state => ({
          failedOperations: state.failedOperations.filter(op => op.id !== id),
        }));
      },

      setSyncInProgress: (inProgress: boolean) => {
        set({ syncInProgress: inProgress });
      },

      setOfflineCapable: (capable: boolean) => {
        set({ offlineCapable: capable });
      },

      addBatchOperations: operations => {
        const ids: string[] = [];
        const now = Date.now();

        const syncOperations: SyncOperation[] = operations.map(op => {
          const id = generateOperationId();
          ids.push(id);

          return {
            id,
            createdAt: now,
            updatedAt: now,
            ...op,
            retryCount: op.retryCount || 0,
            maxRetries: op.maxRetries || 3,
            status: 'pending',
          };
        });

        set(state => ({
          pendingOperations: [...state.pendingOperations, ...syncOperations],
        }));

        return ids;
      },

      clearAllOperations: () => {
        set({
          pendingOperations: [],
          failedOperations: [],
        });
      },

      getOperationById: (id: string) => {
        const state = get();
        return [...state.pendingOperations, ...state.failedOperations].find(
          op => op.id === id
        );
      },

      getOperationsByType: (type: SyncOperationType) => {
        const state = get();
        return [...state.pendingOperations, ...state.failedOperations].filter(
          op => op.type === type
        );
      },

      getOperationsByResource: (resourceType: string, resourceId?: string) => {
        const state = get();
        const allOps = [...state.pendingOperations, ...state.failedOperations];

        if (resourceId) {
          return allOps.filter(
            op =>
              op.resourceType === resourceType && op.resourceId === resourceId
          );
        }

        return allOps.filter(op => op.resourceType === resourceType);
      },

      getPendingCount: () => {
        return get().pendingOperations.length;
      },

      getFailedCount: () => {
        return get().failedOperations.length;
      },

      hasOperations: () => {
        const state = get();
        return (
          state.pendingOperations.length > 0 ||
          state.failedOperations.length > 0
        );
      },

      getRetryableOperations: () => {
        return get().failedOperations.filter(
          op => op.retryCount < op.maxRetries
        );
      },

      initializeNetworkDetection: () => {
        if (typeof window === 'undefined') return;

        // Set initial status
        const initialStatus = detectNetworkStatus();
        get().setNetworkStatus(initialStatus);

        // Listen for online/offline events
        const handleOnline = () => {
          get().setNetworkStatus('online');
        };

        const handleOffline = () => {
          get().setNetworkStatus('offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Monitor connection changes if available
        const navigator_extended = navigator as Navigator & {
          connection?: {
            addEventListener: (event: string, handler: () => void) => void;
          };
          mozConnection?: {
            addEventListener: (event: string, handler: () => void) => void;
          };
          webkitConnection?: {
            addEventListener: (event: string, handler: () => void) => void;
          };
        };
        const connection =
          navigator_extended.connection ??
          navigator_extended.mozConnection ??
          navigator_extended.webkitConnection;

        if (connection) {
          const handleConnectionChange = () => {
            const status = detectNetworkStatus();
            get().setNetworkStatus(status);
          };

          connection.addEventListener('change', handleConnectionChange);
        }

        // Periodic connectivity check
        const checkConnectivity = async () => {
          try {
            const isOnline = await get().checkNetworkStatus();
            const currentStatus = get().networkStatus;

            if (!isOnline && currentStatus !== 'offline') {
              get().setNetworkStatus('offline');
            } else if (isOnline && currentStatus === 'offline') {
              get().setNetworkStatus('online');
            }
          } catch (error) {
            console.warn('Network connectivity check failed:', error);
          }
        };

        // Check every 30 seconds
        setInterval(checkConnectivity, 30000);
      },

      checkNetworkStatus: () => {
        return checkOnlineStatus();
      },
    }),
    {
      name: 'offline-storage',
      partialize: state => ({
        pendingOperations: state.pendingOperations,
        failedOperations: state.failedOperations,
        offlineCapable: state.offlineCapable,
        lastOnlineTime: state.lastOnlineTime,
      }),
    }
  )
);
