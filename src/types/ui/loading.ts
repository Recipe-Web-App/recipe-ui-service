// Loading Types
export interface LoadingState {
  globalLoading: boolean;
  operationLoading: Record<string, boolean>;
  loadingMessage: string | null;
}
