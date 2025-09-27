'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  useLayoutContext,
  LayoutProviderWithErrorBoundary,
} from './layout-provider';
import { TopNav } from './top-nav';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { ContentPane } from '@/components/ui/content';
import { Toaster } from '@/components/ui/toaster';
import type { LayoutVariant } from './layout-provider';
import type { ContentPaneProps } from '@/types/ui/content';

/**
 * Layout component props
 */
export interface LayoutProps {
  /** Child components to render in the content area */
  children: React.ReactNode;
  /** Layout variant (will be overridden by LayoutProvider if already in context) */
  variant?: LayoutVariant;
  /** Whether to show the sidebar (will be managed by LayoutProvider) */
  showSidebar?: boolean;
  /** Whether to show the footer (will be managed by LayoutProvider) */
  showFooter?: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
  /** Props to pass to the ContentPane component */
  contentProps?: Partial<ContentPaneProps>;
}

/**
 * Internal Layout Component
 *
 * This is the internal layout that assumes it's already within a LayoutProvider context.
 * Use the main Layout component for automatic provider wrapping.
 */
const InternalLayout = React.forwardRef<HTMLDivElement, LayoutProps>(
  (
    {
      children,
      className,
      contentProps = {},
      variant: _variant,
      showSidebar: _showSidebar,
      showFooter: _showFooter,
      ...props
    },
    ref
  ) => {
    // Get layout state from context
    const { variant, showSidebar, showFooter, subNavigation } =
      useLayoutContext();

    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-screen flex-col',
          'bg-background text-foreground',
          className
        )}
        data-layout-variant={variant}
        {...props}
      >
        {/* Top Navigation - Always shown */}
        <TopNav
          variant={variant === 'minimal' ? 'minimal' : 'default'}
          position="sticky"
        />

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar - Conditional based on variant and state */}
          {showSidebar && variant !== 'minimal' && (
            <Sidebar
              items={subNavigation}
              showFooter={true}
              variant={variant === 'focused' ? 'minimal' : 'default'}
            />
          )}

          {/* Content Pane */}
          <ContentPane
            viewMode="list"
            contentWidth="contained"
            scrollable={true}
            padding={false}
            {...contentProps}
            className={cn('flex-1 p-4', contentProps.className)}
          >
            {children}
          </ContentPane>
        </div>

        {/* Footer - Conditional based on variant and state */}
        {showFooter && variant !== 'minimal' && (
          <Footer
            showBuildInfo={variant !== 'focused'}
            showSocialLinks={variant !== 'focused'}
          />
        )}

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    );
  }
);
InternalLayout.displayName = 'InternalLayout';

/**
 * Main Layout Component
 *
 * This is the primary layout component that orchestrates the entire application layout.
 * It provides a complete layout system with:
 *
 * - **TopNav**: Global navigation header
 * - **Sidebar**: Contextual navigation (shown/hidden based on variant)
 * - **ContentPane**: Main content area with flexible view modes
 * - **Footer**: Application footer (shown/hidden based on variant)
 * - **Toast System**: Global notifications
 *
 * ### Layout Variants:
 *
 * - **default**: Full layout with TopNav + Sidebar + ContentPane + Footer
 * - **focused**: TopNav + ContentPane + minimal Footer (for detail pages)
 * - **minimal**: TopNav + ContentPane only (for auth pages, modals)
 *
 * ### Responsive Behavior:
 *
 * - **Mobile**: TopNav + Mobile Drawer + ContentPane + Footer
 * - **Tablet**: TopNav + Collapsible Sidebar + ContentPane + Footer
 * - **Desktop**: Full layout with expanded sidebar
 *
 * ### Integration:
 *
 * - Automatically wraps content with LayoutProvider and ErrorBoundary
 * - Integrates with navigation store for sidebar state and sub-navigation
 * - Uses layout store for view modes and responsive behavior
 * - Includes theme provider integration via Toaster
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Layout>
 *   <YourPageContent />
 * </Layout>
 *
 * // With custom variant
 * <Layout variant="focused">
 *   <ArticleDetailPage />
 * </Layout>
 *
 * // With custom content props
 * <Layout
 *   variant="minimal"
 *   contentProps={{
 *     viewMode: "list",
 *     padding: false
 *   }}
 * >
 *   <AuthPage />
 * </Layout>
 * ```
 */
export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  (
    { variant = 'default', showSidebar = true, showFooter = true, ...props },
    ref
  ) => {
    return (
      <LayoutProviderWithErrorBoundary
        variant={variant}
        defaultShowSidebar={showSidebar}
        defaultShowFooter={showFooter}
      >
        <InternalLayout ref={ref} {...props} />
      </LayoutProviderWithErrorBoundary>
    );
  }
);
Layout.displayName = 'Layout';

/**
 * Layout component for pages that are already within a LayoutProvider
 *
 * Use this when you need a layout but are already inside a LayoutProvider context
 * (e.g., in nested layouts or when using the provider at a higher level).
 */
export const LayoutWithoutProvider = InternalLayout;

/**
 * Type exports for external use
 */
export type { LayoutVariant } from './layout-provider';
