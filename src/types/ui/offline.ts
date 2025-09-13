// Offline and Sync Types
export type NetworkStatus = 'online' | 'offline' | 'slow' | 'reconnecting';
export type SyncOperationType = 'create' | 'update' | 'delete' | 'batch';
export type SyncOperationStatus =
  | 'pending'
  | 'syncing'
  | 'success'
  | 'failed'
  | 'cancelled';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  status: SyncOperationStatus;
  resourceType: string;
  resourceId: string;
  data: unknown;
  retryCount: number;
  maxRetries: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface OfflineState {
  networkStatus: NetworkStatus;
  isOnline: boolean;
  lastOnlineTime: number;
  pendingOperations: SyncOperation[];
  failedOperations: SyncOperation[];
  syncInProgress: boolean;
  offlineCapable: boolean;
}

// Store interface with all actions
export interface OfflineStoreState extends OfflineState {
  // Network status actions
  setNetworkStatus: (status: NetworkStatus) => void;
  setOnlineStatus: (online: boolean) => void;
  updateLastOnlineTime: () => void;

  // Sync operation actions
  addPendingOperation: (
    operation: Omit<SyncOperation, 'id' | 'createdAt' | 'updatedAt'>
  ) => string;
  removePendingOperation: (id: string) => void;
  updateOperationStatus: (
    id: string,
    status: SyncOperationStatus,
    error?: string
  ) => void;
  movePendingToFailed: (id: string, error: string) => void;
  moveFailedToPending: (id: string) => void;

  // Failed operation actions
  retryFailedOperation: (id: string) => void;
  retryAllFailedOperations: () => void;
  clearFailedOperations: () => void;
  removeFailedOperation: (id: string) => void;

  // Sync management
  setSyncInProgress: (inProgress: boolean) => void;
  setOfflineCapable: (capable: boolean) => void;

  // Batch operations
  addBatchOperations: (
    operations: Omit<SyncOperation, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => string[];
  clearAllOperations: () => void;

  // Utility methods
  getOperationById: (id: string) => SyncOperation | undefined;
  getOperationsByType: (type: SyncOperationType) => SyncOperation[];
  getOperationsByResource: (
    resourceType: string,
    resourceId?: string
  ) => SyncOperation[];
  getPendingCount: () => number;
  getFailedCount: () => number;
  hasOperations: () => boolean;
  getRetryableOperations: () => SyncOperation[];

  // Network detection
  initializeNetworkDetection: () => void;
  checkNetworkStatus: () => Promise<boolean>;
}
