'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

import type { NavItem } from '@/types/navigation';

export interface MobileNavDrawerProps {
  className?: string;
}

/**
 * MobileNavDrawer Component
 *
 * Full-screen mobile navigation drawer with accordion-style sub-navigation.
 *
 * Features:
 * - Slide-out navigation from right side
 * - User profile section at top
 * - Accordion navigation for items with children
 * - Sign in prompt when not authenticated
 * - Smooth animations and backdrop
 * - Auto-close on navigation
 * - Auto-expand section containing active route
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
      featureFlags: {
        SHOW_COMPONENTS_DEMO: process.env.NODE_ENV === 'development',
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

  // Find which accordion items should be expanded (contain active route)
  const defaultExpandedItems = React.useMemo(() => {
    const expanded: string[] = [];
    filteredNavItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          child => child.href && isRouteActive(child.href, pathname)
        );
        if (
          hasActiveChild ||
          (item.href && isRouteActive(item.href, pathname))
        ) {
          expanded.push(item.id);
        }
      }
    });
    return expanded;
  }, [filteredNavItems, pathname]);

  // Handle navigation link click
  const handleNavClick = React.useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  // User display information
  const displayName = user?.name ?? authUser?.email ?? 'User';
  const userEmail = authUser?.email;

  // Render a single navigation item (for items without children)
  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = item.href ? isRouteActive(item.href, pathname) : false;
    const hasBadge = hasNavItemBadge(item);
    const badgeText = getNavItemBadge(item);
    const badgeVariant = getNavItemBadgeVariant(item);
    const isAction = item.metadata?.isAction;
    const Icon = item.icon;

    // Handle action items (like logout)
    if (isAction) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            closeMobileMenu();
            // TODO: Handle logout or other actions
          }}
          className={cn(
            'flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground focus:outline-none',
            isChild && 'pl-10',
            item.metadata?.disabled &&
              'pointer-events-none cursor-not-allowed opacity-50'
          )}
        >
          {Icon && (
            <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          )}
          <span className="flex-1 text-left">{item.label}</span>
        </button>
      );
    }

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
          isChild && 'pl-10',
          item.metadata?.disabled &&
            'pointer-events-none cursor-not-allowed opacity-50'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {Icon && (
          <Icon
            className={cn('h-5 w-5 flex-shrink-0', isChild && 'h-4 w-4')}
            aria-hidden="true"
          />
        )}
        <span className="flex-1">{item.label}</span>
        {hasBadge && badgeText && (
          <Badge variant={badgeVariant} className="h-5 px-2 text-xs">
            {badgeText}
          </Badge>
        )}
      </Link>
    );
  };

  // Render an accordion item (for items with children)
  const renderAccordionItem = (item: NavItem) => {
    const isActive = item.href ? isRouteActive(item.href, pathname) : false;
    const hasBadge = hasNavItemBadge(item);
    const badgeText = getNavItemBadge(item);
    const badgeVariant = getNavItemBadgeVariant(item);
    const Icon = item.icon;
    const children = item.children ?? [];

    return (
      <AccordionItem key={item.id} value={item.id} className="border-none">
        <AccordionTrigger
          className={cn(
            'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:no-underline',
            'hover:bg-accent hover:text-accent-foreground',
            '[&[data-state=open]]:bg-accent/50',
            isActive && 'bg-accent/50',
            item.metadata?.disabled &&
              'pointer-events-none cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex flex-1 items-center space-x-3">
            {Icon && (
              <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            )}
            <span className="flex-1 text-left">{item.label}</span>
            {hasBadge && badgeText && (
              <Badge variant={badgeVariant} className="h-5 px-2 text-xs">
                {badgeText}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-0">
          <div className="space-y-1">
            {/* View All link - navigates to the section hub page */}
            {item.href && (
              <Link
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'text-primary hover:bg-primary/10',
                  'focus:bg-primary/10 focus:outline-none',
                  'pl-10'
                )}
              >
                <span>View All {item.label}</span>
              </Link>
            )}
            {children.map(child => renderNavItem(child, true))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

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
              href="/account/profile"
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
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="border-border border-b p-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-3 text-sm">
                Sign in to access all features
              </p>
              <Link href="/login" onClick={handleNavClick}>
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <Accordion
            type="multiple"
            defaultValue={defaultExpandedItems}
            className="space-y-1 px-4"
          >
            {filteredNavItems.map(item => {
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return renderAccordionItem(item);
              }

              return (
                <div key={item.id} className="py-0.5">
                  {renderNavItem(item)}
                </div>
              );
            })}
          </Accordion>
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
