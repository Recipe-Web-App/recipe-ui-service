'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Badge } from '@/components/ui/badge';
import { SimpleTooltip } from '@/components/ui/tooltip';
import {
  Collapse,
  CollapseTrigger,
  CollapseContent,
} from '@/components/ui/collapse';

// Navigation types
import type { NavItem } from '@/types/navigation';
import {
  isRouteActive,
  hasNavItemBadge,
  getNavItemBadge,
  getNavItemBadgeVariant,
} from '@/lib/navigation/route-utils';

export interface SidebarNavProps {
  /** Navigation items to render */
  items: NavItem[];
  /** Whether the sidebar is in collapsed state */
  collapsed: boolean;
  /** Current active route for highlighting */
  activeRoute?: string;
  /** Additional CSS classes */
  className?: string;
  /** Maximum depth to render (prevents infinite nesting) */
  maxDepth?: number;
  /** Current nesting level (internal use) */
  level?: number;
  /** Callback when a navigation item is clicked */
  onItemClick?: (item: NavItem) => void;
}

/**
 * SidebarNav Component
 *
 * Renders multi-level navigation items in the sidebar with support for:
 * - Nested navigation with unlimited depth
 * - Collapsible sections
 * - Active route highlighting
 * - Badges and metadata display
 * - Keyboard navigation
 * - Tooltip support when sidebar is collapsed
 * - Accessibility features
 */
export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  (
    {
      items,
      collapsed,
      activeRoute,
      className,
      maxDepth = 3,
      level = 0,
      onItemClick,
    },
    ref
  ) => {
    const pathname = usePathname();
    const currentRoute = activeRoute ?? pathname;

    // Track expanded state for collapsible sections
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
      new Set()
    );

    // Auto-expand sections that contain the active route
    React.useEffect(() => {
      const findActiveParents = (
        navItems: NavItem[],
        targetRoute: string,
        parentIds: string[] = []
      ): string[] => {
        for (const item of navItems) {
          const currentPath = [...parentIds, item.id];

          if (item.href && isRouteActive(item.href, targetRoute)) {
            return parentIds; // Return parent IDs, not including the active item itself
          }

          if (item.children) {
            const result = findActiveParents(
              item.children,
              targetRoute,
              currentPath
            );
            if (result.length > 0) {
              return result;
            }
          }
        }
        return [];
      };

      const activeParents = findActiveParents(items, currentRoute);
      if (activeParents.length > 0) {
        setExpandedItems(prev => new Set([...prev, ...activeParents]));
      }
    }, [items, currentRoute]);

    const toggleExpanded = React.useCallback((itemId: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    }, []);

    const handleItemClick = React.useCallback(
      (item: NavItem) => {
        onItemClick?.(item);
      },
      [onItemClick]
    );

    const renderNavItem = React.useCallback(
      (item: NavItem, itemLevel: number) => {
        const isActive = item.href
          ? isRouteActive(item.href, currentRoute)
          : false;
        const hasChildren = Boolean(item.children && item.children.length > 0);
        const hasBadge = hasNavItemBadge(item);
        const badgeText = getNavItemBadge(item);
        const badgeVariant = getNavItemBadgeVariant(item);
        const isExpanded = expandedItems.has(item.id);
        const shouldRenderChildren =
          hasChildren && itemLevel < maxDepth && isExpanded;

        // Base item content
        const itemContent = (
          <>
            {/* Icon */}
            {item.icon && (
              <item.icon
                className={cn(
                  'flex-shrink-0 transition-colors',
                  collapsed ? 'h-5 w-5' : 'h-4 w-4',
                  isActive
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />
            )}

            {/* Label */}
            {!collapsed && (
              <span
                className={cn(
                  'flex-1 truncate text-sm font-medium transition-colors',
                  isActive
                    ? 'text-accent-foreground'
                    : 'text-foreground group-hover:text-accent-foreground'
                )}
              >
                {item.label}
              </span>
            )}

            {/* Badge */}
            {!collapsed && hasBadge && badgeText && (
              <Badge variant={badgeVariant} className="h-5 px-2 text-xs">
                {badgeText}
              </Badge>
            )}

            {/* Expand/Collapse Icon */}
            {!collapsed && hasChildren && (
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpanded(item.id);
                }}
                className={cn(
                  'flex-shrink-0 rounded-sm p-0.5 transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                )}
                aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            )}
          </>
        );

        // Render item with appropriate wrapper
        const navItemElement = (
          <div key={item.id} className="relative">
            {item.href ? (
              // Navigable item
              <Link
                href={item.href}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                  'hover:bg-primary/10 hover:text-primary',
                  'focus:bg-primary/10 focus:text-primary focus:ring-primary/50 focus:ring-2 focus:outline-none',
                  isActive && 'bg-primary/15 text-primary font-medium',
                  item.metadata?.disabled &&
                    'pointer-events-none cursor-not-allowed opacity-50',
                  collapsed && 'justify-center px-2',
                  // Indentation for nested items
                  !collapsed && itemLevel > 0 && `ml-${itemLevel * 4}`
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {itemContent}
              </Link>
            ) : hasChildren ? (
              // Section header (collapsible)
              <Collapse
                open={isExpanded}
                onOpenChange={() => toggleExpanded(item.id)}
              >
                <CollapseTrigger
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                    'hover:bg-primary/10 hover:text-primary',
                    'focus:bg-primary/10 focus:text-primary focus:ring-primary/50 focus:ring-2 focus:outline-none',
                    collapsed && 'justify-center px-2',
                    // Indentation for nested items
                    !collapsed && itemLevel > 0 && `ml-${itemLevel * 4}`
                  )}
                >
                  {itemContent}
                </CollapseTrigger>
                {/* Render children inside Collapse for context access */}
                {shouldRenderChildren && (
                  <CollapseContent className="space-y-1">
                    <SidebarNav
                      items={item.children!}
                      collapsed={collapsed}
                      activeRoute={currentRoute}
                      maxDepth={maxDepth}
                      level={itemLevel + 1}
                      onItemClick={onItemClick}
                    />
                  </CollapseContent>
                )}
              </Collapse>
            ) : (
              // Non-navigable item (rare case)
              <div
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2',
                  'text-muted-foreground',
                  collapsed && 'justify-center px-2',
                  // Indentation for nested items
                  !collapsed && itemLevel > 0 && `ml-${itemLevel * 4}`
                )}
              >
                {itemContent}
              </div>
            )}
          </div>
        );

        // Wrap with tooltip if sidebar is collapsed
        if (collapsed && (item.label || item.metadata?.tooltip)) {
          const tooltipContent = item.metadata?.tooltip ?? item.label;
          return (
            <SimpleTooltip
              key={item.id}
              content={tooltipContent}
              side="right"
              sideOffset={8}
            >
              {navItemElement}
            </SimpleTooltip>
          );
        }

        return navItemElement;
      },
      [
        collapsed,
        currentRoute,
        expandedItems,
        handleItemClick,
        maxDepth,
        toggleExpanded,
        onItemClick,
      ]
    );

    if (!items || items.length === 0) {
      return (
        <div className="p-4">
          <div className="text-muted-foreground text-center text-sm">
            No navigation items
          </div>
        </div>
      );
    }

    return (
      <nav
        ref={ref}
        className={cn('space-y-1 p-4', className)}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {items.map(item => renderNavItem(item, level))}
      </nav>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';
