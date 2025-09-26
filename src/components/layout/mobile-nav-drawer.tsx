'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Navigation
import { topLevelNavigation } from '@/config/navigation';
import { filterNavigationItems } from '@/lib/navigation/filter-utils';
import {
  isRouteActive,
  hasNavItemBadge,
  getNavItemBadge,
  getNavItemBadgeVariant,
} from '@/lib/navigation/route-utils';

// Store hooks
import { useNavigationStore } from '@/stores/ui/navigation-store';
import { useAuthStore } from '@/stores/auth-store';

export interface MobileNavDrawerProps {
  className?: string;
}

/**
 * MobileNavDrawer Component
 *
 * Full-screen mobile navigation drawer.
 *
 * Features:
 * - Slide-out navigation from right side
 * - User profile section at top
 * - Complete navigation menu
 * - Sign in prompt when not authenticated
 * - Smooth animations and backdrop
 * - Auto-close on navigation
 */
export const MobileNavDrawer = React.forwardRef<
  HTMLDivElement,
  MobileNavDrawerProps
>(({ className }, ref) => {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useNavigationStore();
  const { isAuthenticated, user, authUser } = useAuthStore();

  // Filter navigation items for mobile
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
      isMobile: true,
    });

    // Sort by sortOrder
    return [...filtered].sort((a, b) => {
      const orderA = a.metadata?.sortOrder ?? 999;
      const orderB = b.metadata?.sortOrder ?? 999;
      return orderA - orderB;
    });
  }, [isAuthenticated]);

  // Handle navigation link click
  const handleNavClick = React.useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  // User display information
  const displayName = user?.name ?? authUser?.email ?? 'User';
  const userEmail = authUser?.email;

  return (
    <Drawer
      open={isMobileMenuOpen}
      onOpenChange={open => !open && closeMobileMenu()}
      className="w-full max-w-sm"
    >
      <div
        ref={ref}
        className={cn('bg-background flex h-full flex-col', className)}
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileMenu}
            className="h-8 w-8"
            aria-label="Close mobile menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Section */}
        {isAuthenticated ? (
          <div className="border-border border-b p-4">
            <Link
              href="/profile"
              onClick={handleNavClick}
              className="hover:bg-accent flex items-center space-x-3 rounded-lg p-2 transition-colors"
            >
              <UserAvatar
                src={user?.id ? `/api/users/${user.id}/avatar` : undefined}
                alt={displayName}
                name={displayName}
                className="h-10 w-10"
              />
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm font-medium">
                  {displayName}
                </div>
                {userEmail && (
                  <div className="text-muted-foreground truncate text-xs">
                    {userEmail}
                  </div>
                )}
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </Link>
          </div>
        ) : (
          <div className="border-border border-b p-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-3 text-sm">
                Sign in to access all features
              </p>
              <Link href="/auth/login" onClick={handleNavClick}>
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {filteredNavItems.map(item => {
              const isActive = item.href
                ? isRouteActive(item.href, pathname)
                : false;
              const hasBadge = hasNavItemBadge(item);
              const badgeText = getNavItemBadge(item);
              const badgeVariant = getNavItemBadgeVariant(item);

              return (
                <Link
                  key={item.id}
                  href={item.href ?? '#'}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    isActive && 'bg-accent text-accent-foreground',
                    item.metadata?.disabled &&
                      'pointer-events-none cursor-not-allowed opacity-50'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Icon */}
                  {item.icon && (
                    <item.icon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  {/* Label */}
                  <span className="flex-1">{item.label}</span>

                  {/* Badge */}
                  {hasBadge && badgeText && (
                    <Badge variant={badgeVariant} className="h-5 px-2 text-xs">
                      {badgeText}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-border border-t p-4">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Recipe App v1.0.0</p>
          </div>
        </div>
      </div>
    </Drawer>
  );
});

MobileNavDrawer.displayName = 'MobileNavDrawer';
