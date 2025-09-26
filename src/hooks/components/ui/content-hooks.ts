import * as React from 'react';
import { useLayoutStore } from '@/stores/ui/layout-store';
import type { ContentContextType } from '@/types/ui/content';
import type { ViewMode } from '@/types/ui/layout';

/**
 * Content Context for managing content state
 */
export const ContentContext = React.createContext<
  ContentContextType | undefined
>(undefined);

/**
 * Hook to use content context
 *
 * Provides access to content view mode and width settings.
 * Must be used within a ContentProvider.
 *
 * @example
 * ```tsx
 * const { viewMode, contentWidth, setViewMode, toggleViewMode } = useContent();
 * ```
 */
export const useContent = (): ContentContextType => {
  const context = React.useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

/**
 * Hook to create content context value
 *
 * Used internally by ContentProvider to create the context value.
 */
export const useContentContextValue = (
  defaultViewMode: ViewMode = 'grid',
  defaultContentWidth: 'full' | 'contained' = 'contained'
): ContentContextType => {
  const {
    viewMode,
    contentWidth,
    setViewMode,
    setContentWidth,
    toggleViewMode,
    toggleContentWidth,
  } = useLayoutStore();

  // Initialize defaults if not set
  React.useEffect(() => {
    if (!viewMode) setViewMode(defaultViewMode);
    if (!contentWidth) setContentWidth(defaultContentWidth);
  }, [
    viewMode,
    contentWidth,
    defaultViewMode,
    defaultContentWidth,
    setViewMode,
    setContentWidth,
  ]);

  const contextValue = React.useMemo<ContentContextType>(
    () => ({
      viewMode: viewMode ?? defaultViewMode,
      contentWidth: contentWidth ?? defaultContentWidth,
      setViewMode,
      setContentWidth,
      toggleViewMode,
      toggleContentWidth,
    }),
    [
      viewMode,
      contentWidth,
      defaultViewMode,
      defaultContentWidth,
      setViewMode,
      setContentWidth,
      toggleViewMode,
      toggleContentWidth,
    ]
  );

  return contextValue;
};
