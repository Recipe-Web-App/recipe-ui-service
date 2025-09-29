'use client';

import * as React from 'react';
import { useSubNavigation } from '@/hooks/use-sub-navigation';
import { useNavigationStore } from '@/stores/ui/navigation-store';
import { topLevelNavigation } from '@/config/navigation';
import type { NavItem } from '@/types/navigation';

/**
 * Layout variants for different page types
 */
export type LayoutVariant = 'default' | 'focused' | 'minimal';

/**
 * Layout context interface
 */
export interface LayoutContextType {
  /** Current layout variant */
  variant: LayoutVariant;
  /** Whether to show the sidebar */
  showSidebar: boolean;
  /** Whether to show the footer */
  showFooter: boolean;
  /** Current sub-navigation items */
  subNavigation: NavItem[];
  /** Update layout variant */
  setVariant: (variant: LayoutVariant) => void;
  /** Toggle sidebar visibility */
  toggleSidebar: () => void;
  /** Toggle footer visibility */
  toggleFooter: () => void;
}

/**
 * Layout context
 */
const LayoutContext = React.createContext<LayoutContextType | null>(null);

/**
 * Layout provider props
 */
export interface LayoutProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Default layout variant */
  variant?: LayoutVariant;
  /** Whether to show sidebar by default */
  defaultShowSidebar?: boolean;
  /** Whether to show footer by default */
  defaultShowFooter?: boolean;
}

/**
 * Layout Provider Component
 *
 * Provides layout context for managing layout variants, sidebar visibility,
 * footer visibility, and sub-navigation. This provider wraps the entire
 * application layout and manages the coordination between different layout
 * components.
 *
 * Features:
 * - Layout variant management (default, focused, minimal)
 * - Sidebar and footer visibility control
 * - Sub-navigation context from current route
 * - Integration with navigation store
 * - Error boundary protection
 */
export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  variant: initialVariant = 'default',
  defaultShowSidebar = true,
  defaultShowFooter = true,
}) => {
  // State for layout configuration
  const [variant, setVariant] = React.useState<LayoutVariant>(initialVariant);
  const [showSidebar, setShowSidebar] = React.useState(defaultShowSidebar);
  const [showFooter, setShowFooter] = React.useState(defaultShowFooter);

  // Get sub-navigation from hook
  const subNavigation = useSubNavigation();

  // Update navigation store with current sub-navigation
  const { setCurrentSubNavigation } = useNavigationStore();

  // Use top-level navigation if no sub-navigation is available
  const effectiveNavigation = React.useMemo(() => {
    return subNavigation.length > 0 ? subNavigation : topLevelNavigation;
  }, [subNavigation]);

  // Sync navigation with store
  React.useEffect(() => {
    setCurrentSubNavigation(effectiveNavigation);
  }, [effectiveNavigation, setCurrentSubNavigation]);

  // Adjust sidebar/footer visibility based on variant
  React.useEffect(() => {
    switch (variant) {
      case 'minimal':
        setShowSidebar(false);
        setShowFooter(false);
        break;
      case 'focused':
        setShowSidebar(false);
        setShowFooter(true);
        break;
      case 'default':
      default:
        setShowSidebar(defaultShowSidebar);
        setShowFooter(defaultShowFooter);
        break;
    }
  }, [variant, defaultShowSidebar, defaultShowFooter]);

  // Context value
  const contextValue = React.useMemo<LayoutContextType>(
    () => ({
      variant,
      showSidebar,
      showFooter,
      subNavigation: effectiveNavigation,
      setVariant,
      toggleSidebar: () => setShowSidebar(prev => !prev),
      toggleFooter: () => setShowFooter(prev => !prev),
    }),
    [variant, showSidebar, showFooter, effectiveNavigation]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

/**
 * Hook to use layout context
 *
 * @throws Error if used outside of LayoutProvider
 * @returns Layout context
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useLayoutContext = (): LayoutContextType => {
  const context = React.useContext(LayoutContext);

  if (!context) {
    throw new Error(
      'useLayoutContext must be used within a LayoutProvider. ' +
        'Make sure to wrap your component tree with <LayoutProvider>.'
    );
  }

  return context;
};

/**
 * Layout error boundary component
 * Catches layout-specific errors and provides fallback UI
 */
interface LayoutErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface LayoutErrorBoundaryProps {
  children: React.ReactNode;
}

export class LayoutErrorBoundary extends React.Component<
  LayoutErrorBoundaryProps,
  LayoutErrorBoundaryState
> {
  constructor(props: LayoutErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LayoutErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Layout Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-destructive mb-4 text-2xl font-bold">
              Layout Error
            </h1>
            <p className="text-muted-foreground mb-4">
              Something went wrong with the page layout.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Enhanced layout provider with error boundary
 */
export const LayoutProviderWithErrorBoundary: React.FC<LayoutProviderProps> = ({
  children,
  ...props
}) => (
  <LayoutErrorBoundary>
    <LayoutProvider {...props}>{children}</LayoutProvider>
  </LayoutErrorBoundary>
);

LayoutProvider.displayName = 'LayoutProvider';
LayoutProviderWithErrorBoundary.displayName = 'LayoutProviderWithErrorBoundary';
