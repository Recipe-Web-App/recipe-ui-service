// UI Types - Re-exports for convenience
export * from './toast';
export * from './theme';
export * from './modal';
export * from './navigation';
export * from './loading';
export * from './search-filter';
export * from './layout';
export * from './interaction';
export * from './offline';
export * from './accessibility';
export * from './features';
export * from './alert';
export * from './switch';
export * from './radio';
export * from './checkbox';

// Combined UI State Type for reference
import type { ToastState } from './toast';
import type { ThemeConfig } from './theme';
import type { ModalState } from './modal';
import type { NavigationState } from './navigation';
import type { LoadingState } from './loading';
import type { SearchState } from './search-filter';
import type { LayoutState } from './layout';
import type { InteractionState } from './interaction';
import type { OfflineState } from './offline';
import type { AccessibilityState } from './accessibility';
import type { FeatureState } from './features';

export interface UIState {
  toast: ToastState;
  theme: ThemeConfig;
  modal: ModalState;
  navigation: NavigationState;
  loading: LoadingState;
  search: SearchState;
  layout: LayoutState;
  interaction: InteractionState;
  offline: OfflineState;
  accessibility: AccessibilityState;
  features: FeatureState;
}
