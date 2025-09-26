'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';

// Store hooks
import { useNavigationStore } from '@/stores/ui/navigation-store';

export interface SidebarFooterProps {
  /** Whether the sidebar is in collapsed state */
  collapsed: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom collapse toggle handler (overrides store default) */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Whether to show additional footer content */
  showVersion?: boolean;
  /** Custom version text to display */
  versionText?: string;
}

/**
 * SidebarFooter Component
 *
 * Footer section of the sidebar with collapse/expand toggle functionality.
 * Provides a clean way to control sidebar state and optionally display
 * version information.
 *
 * Features:
 * - Collapse/expand toggle button with appropriate icons
 * - Tooltip support when collapsed
 * - Optional version information display
 * - Integration with navigation store
 * - Keyboard accessible
 * - Responsive design
 */
export const SidebarFooter = React.forwardRef<HTMLElement, SidebarFooterProps>(
  (
    {
      collapsed,
      className,
      onToggleCollapse,
      showVersion = true,
      versionText = 'v1.0.0',
    },
    ref
  ) => {
    const { collapseSidebar } = useNavigationStore();

    const handleToggleCollapse = React.useCallback(() => {
      const newCollapsedState = !collapsed;

      if (onToggleCollapse) {
        onToggleCollapse(newCollapsedState);
      } else {
        collapseSidebar(newCollapsedState);
      }
    }, [collapsed, onToggleCollapse, collapseSidebar]);

    const toggleButton = (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleCollapse}
        className={cn(
          'h-8 w-8 rounded-lg transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground'
        )}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    );

    return (
      <footer
        ref={ref}
        className={cn(
          'bg-background border-t p-4',
          'flex items-center justify-between',
          collapsed && 'justify-center',
          className
        )}
        role="contentinfo"
        aria-label="Sidebar footer"
      >
        {/* Version Info (only when expanded) */}
        {!collapsed && showVersion && (
          <div className="flex-1">
            <p className="text-muted-foreground text-xs">
              Recipe App {versionText}
            </p>
          </div>
        )}

        {/* Collapse Toggle */}
        {collapsed ? (
          <SimpleTooltip
            content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            side="right"
            sideOffset={8}
          >
            {toggleButton}
          </SimpleTooltip>
        ) : (
          toggleButton
        )}
      </footer>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';
