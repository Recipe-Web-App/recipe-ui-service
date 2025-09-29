'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// UI Components
import { SimpleTooltip } from '@/components/ui/tooltip';

// Navigation
import type { NavItem } from '@/types/navigation';

// Store hooks
import { useNavigationStore } from '@/stores/ui/navigation-store';

// Navigation components
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';

export interface SidebarProps {
  /** Additional CSS classes */
  className?: string;
  /** Override navigation items (optional - uses store by default) */
  items?: NavItem[];
  /** Whether to show the footer with collapse toggle */
  showFooter?: boolean;
  /** Sidebar variant */
  variant?: 'default' | 'minimal';
}

/**
 * Sidebar Component
 *
 * Pure presentation component that renders contextual navigation for the application.
 * This component is designed as a clean display layer that receives pre-filtered
 * navigation items from sub-package extensions.
 *
 * Architecture:
 * - Sidebar focuses purely on presentation and UI behavior
 * - Authentication and feature flag filtering happens in sub-package extensions
 * - Each sub-package provides its own filtered navigation via the navigation store
 * - Supports extensible sub-package architecture for scalable navigation
 *
 * Features:
 * - Collapsible sidebar with smooth transitions
 * - Multi-level navigation support with sub-packages
 * - Mobile responsive (hidden on mobile, uses drawer instead)
 * - Keyboard navigation and accessibility
 * - Tooltip support when collapsed
 * - Integration with existing navigation store
 */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, items, showFooter = true, variant = 'default' }, ref) => {
    const { isSidebarOpen, isSidebarCollapsed, currentSubNavigation } =
      useNavigationStore();

    // Get navigation items - either from props or store (filtered by sub-packages)
    const navigationItems = React.useMemo(() => {
      if (items) {
        return items;
      }

      // Use sub-navigation from store (already filtered by sub-package extensions)
      return currentSubNavigation;
    }, [items, currentSubNavigation]);

    // Don't render on mobile (handled by mobile drawer)
    const shouldRender = isSidebarOpen && variant !== 'minimal';

    if (!shouldRender) {
      return null;
    }

    return (
      <React.Fragment>
        {isSidebarCollapsed ? (
          <SimpleTooltip content="Expand sidebar" side="right">
            <aside
              ref={ref}
              className={cn(
                // Base styles
                'hidden flex-col lg:flex',
                'sticky top-16 h-[calc(100vh-4rem)]',
                'bg-background border-r',
                'transition-all duration-300 ease-in-out',

                // Width based on collapsed state
                isSidebarCollapsed ? 'w-16' : 'w-64',

                // Z-index for proper layering
                'z-30',

                className
              )}
              aria-label={
                isSidebarCollapsed
                  ? 'Collapsed navigation sidebar'
                  : 'Navigation sidebar'
              }
              role="navigation"
            >
              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto">
                <SidebarNav
                  items={navigationItems}
                  collapsed={isSidebarCollapsed}
                />
              </div>

              {/* Footer */}
              {showFooter && <SidebarFooter collapsed={isSidebarCollapsed} />}
            </aside>
          </SimpleTooltip>
        ) : (
          <aside
            ref={ref}
            className={cn(
              // Base styles
              'hidden flex-col lg:flex',
              'sticky top-16 h-[calc(100vh-4rem)]',
              'bg-background border-r',
              'transition-all duration-300 ease-in-out',

              // Width based on collapsed state
              isSidebarCollapsed ? 'w-16' : 'w-64',

              // Z-index for proper layering
              'z-30',

              className
            )}
            aria-label={
              isSidebarCollapsed
                ? 'Collapsed navigation sidebar'
                : 'Navigation sidebar'
            }
            role="navigation"
          >
            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                items={navigationItems}
                collapsed={isSidebarCollapsed}
              />
            </div>

            {/* Footer */}
            {showFooter && <SidebarFooter collapsed={isSidebarCollapsed} />}
          </aside>
        )}
      </React.Fragment>
    );
  }
);

Sidebar.displayName = 'Sidebar';
