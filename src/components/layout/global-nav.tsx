'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SimpleTooltip } from '@/components/ui/tooltip';

// Navigation configuration and utilities
import { topLevelNavigation } from '@/config/navigation';
import { filterNavigationItems } from '@/lib/navigation/filter-utils';
import {
  isRouteActive,
  getNavItemBadgeVariant,
  hasNavItemBadge,
  getNavItemBadge,
  isExternalNavItem,
  getNavItemTarget,
} from '@/lib/navigation/route-utils';

// Store hooks
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';

export interface GlobalNavProps {
  className?: string;
  maxItems?: number;
  showIcons?: boolean;
  showBadges?: boolean;
}

/**
 * GlobalNav Component
 *
 * Displays the main navigation items for desktop/tablet views.
 * Features:
 * - Filters items based on auth state, feature flags, and platform
 * - Shows active state highlighting
 * - Displays badges and tooltips
 * - Handles external links properly
 * - Responsive design
 */
export const GlobalNav = React.forwardRef<HTMLDivElement, GlobalNavProps>(
  ({ className, maxItems = 6, showIcons = false, showBadges = true }, ref) => {
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const { breakpoint } = useLayoutStore();

    // Filter navigation items based on current context
    const filteredNavItems = React.useMemo(() => {
      const filtered = filterNavigationItems(topLevelNavigation, {
        isAuthenticated,
        // TODO: Add feature flags when available
        featureFlags: {
          SHOW_COMPONENTS_DEMO: process.env.NODE_ENV === 'development',
          ENABLE_MEAL_PLANNING: true,
          ENABLE_GROCERY_LISTS: true,
          ENABLE_SOCIAL_FEATURES: true,
          ENABLE_USER_PROFILES: true,
          ENABLE_ANALYTICS: true,
        },
        isMobile: false, // This is desktop navigation
      });

      // Sort by sortOrder and limit to maxItems
      const sorted = [...filtered].sort((a, b) => {
        const orderA = a.metadata?.sortOrder ?? 999;
        const orderB = b.metadata?.sortOrder ?? 999;
        return orderA - orderB;
      });

      return sorted.slice(0, maxItems);
    }, [isAuthenticated, maxItems]);

    if (filteredNavItems.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-1 md:space-x-2', className)}
        role="menubar"
        aria-label="Main navigation"
      >
        {filteredNavItems.map(item => {
          const isActive = item.href
            ? isRouteActive(item.href, pathname)
            : false;
          const isExternal = isExternalNavItem(item);
          const target = getNavItemTarget(item);
          const hasBadge = hasNavItemBadge(item);
          const badgeText = getNavItemBadge(item);
          const badgeVariant = getNavItemBadgeVariant(item);

          const LinkComponent = (
            <Link
              href={item.href ?? '#'}
              target={target}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={cn(
                'relative inline-flex items-center space-x-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                isActive && 'bg-accent text-accent-foreground',
                item.metadata?.disabled &&
                  'pointer-events-none cursor-not-allowed opacity-50'
              )}
              role="menuitem"
              aria-current={isActive ? 'page' : undefined}
              tabIndex={item.metadata?.disabled ? -1 : 0}
            >
              {/* Icon */}
              {showIcons && item.icon && (
                <item.icon className="h-4 w-4" aria-hidden="true" />
              )}

              {/* Label */}
              <span>{item.label}</span>

              {/* Badge */}
              {showBadges && hasBadge && badgeText && (
                <Badge
                  variant={badgeVariant}
                  className="ml-1.5 h-5 px-1.5 text-xs"
                  aria-label={`${item.label} badge: ${badgeText}`}
                >
                  {badgeText}
                </Badge>
              )}

              {/* External link indicator */}
              {isExternal && (
                <svg
                  className="h-3 w-3 opacity-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </Link>
          );

          // Wrap with tooltip if tooltip text is provided
          if (item.metadata?.tooltip && breakpoint !== 'mobile') {
            return (
              <SimpleTooltip key={item.id} content={item.metadata.tooltip}>
                {LinkComponent}
              </SimpleTooltip>
            );
          }

          return <React.Fragment key={item.id}>{LinkComponent}</React.Fragment>;
        })}
      </div>
    );
  }
);

GlobalNav.displayName = 'GlobalNav';
