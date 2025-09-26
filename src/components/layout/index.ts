// Core layout components
export { Layout, LayoutWithoutProvider } from './layout';
export {
  LayoutProvider,
  LayoutProviderWithErrorBoundary,
  LayoutErrorBoundary,
  useLayoutContext,
} from './layout-provider';

// Pre-configured layout variants
export { DefaultLayout, FocusedLayout, MinimalLayout } from './layout-variants';

// Layout utility hooks
export {
  useLayoutVariant,
  useSidebarVisibility,
  useFooterVisibility,
  useLayoutSubNavigation,
} from './layout-hooks';

// Layout HOCs
export {
  withLayout,
  withDefaultLayout,
  withFocusedLayout,
  withMinimalLayout,
  withLayoutProvider,
} from './layout-hocs';

// Types
export type {
  LayoutVariant,
  LayoutContextType,
  LayoutProviderProps,
} from './layout-provider';
export type { LayoutProps } from './layout';
