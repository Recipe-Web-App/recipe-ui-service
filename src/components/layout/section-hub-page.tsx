'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

// Navigation
import { getSubNavigation, topLevelNavigation } from '@/config/navigation';
import { filterNavigationItems } from '@/lib/navigation/filter-utils';

// Store hooks
import { useAuthStore } from '@/stores/auth-store';

import type { NavItem } from '@/types/navigation';

export interface SectionHubPageProps {
  /** The section ID to get sub-navigation for (e.g., 'recipes', 'collections') */
  sectionId: string;
  /** Page title */
  title: string;
  /** Optional page description/subtitle */
  description?: string;
  /** Optional additional CSS classes for the container */
  className?: string;
}

/**
 * SectionHubPage Component
 *
 * A reusable component that displays a card grid of sub-page navigation options.
 * Used for top-level section landing pages (e.g., /recipes, /collections).
 *
 * Features:
 * - Reads sub-navigation from centralized config
 * - Filters items based on authentication state
 * - Responsive card grid layout
 * - Each card shows icon, label, and description
 */
export function SectionHubPage({
  sectionId,
  title,
  description,
  className,
}: SectionHubPageProps) {
  const { isAuthenticated } = useAuthStore();

  // Get the parent nav item to access its icon
  const parentNavItem = topLevelNavigation.find(
    item => item.id === sectionId || item.href === `/${sectionId}`
  );
  const ParentIcon = parentNavItem?.icon;

  // Get and filter sub-navigation items
  const subNavItems = React.useMemo(() => {
    const items = getSubNavigation(sectionId);

    // Filter based on auth state
    const filtered = filterNavigationItems(items, {
      isAuthenticated,
      featureFlags: {
        SHOW_COMPONENTS_DEMO: process.env.NODE_ENV === 'development',
      },
      isMobile: false,
    });

    // Sort by sortOrder
    return [...filtered].sort((a, b) => {
      const orderA = a.metadata?.sortOrder ?? 999;
      const orderB = b.metadata?.sortOrder ?? 999;
      return orderA - orderB;
    });
  }, [sectionId, isAuthenticated]);

  // Render a single navigation card
  const renderNavCard = (item: NavItem) => {
    const Icon = item.icon;
    const itemDescription = item.metadata?.tooltip ?? '';
    const isAction = item.metadata?.isAction;

    // Skip action items (like logout) - they shouldn't appear as cards
    if (isAction) {
      return null;
    }

    return (
      <Link
        key={item.id}
        href={item.href ?? '#'}
        className={cn(
          'group block transition-transform hover:scale-[1.02]',
          item.metadata?.disabled && 'pointer-events-none opacity-50'
        )}
      >
        <Card
          variant="outlined"
          className={cn(
            'h-full transition-all duration-200',
            'hover:border-primary/50 hover:shadow-md',
            'group-focus-visible:ring-ring group-focus-visible:ring-2'
          )}
        >
          <CardHeader className="flex flex-row items-start gap-4">
            {/* Icon */}
            {Icon && (
              <div
                className={cn(
                  'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
                  'bg-primary/10 text-primary',
                  'group-hover:bg-primary/20 transition-colors'
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            )}

            {/* Text content */}
            <div className="flex-1 space-y-1">
              <CardTitle className="text-base font-semibold">
                {item.label}
              </CardTitle>
              {itemDescription && (
                <CardDescription className="text-sm">
                  {itemDescription}
                </CardDescription>
              )}
            </div>
          </CardHeader>
        </Card>
      </Link>
    );
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {ParentIcon && (
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <ParentIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
          <h1 className="text-foreground text-3xl font-bold">{title}</h1>
        </div>
        {description && (
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>

      {/* Navigation Cards Grid */}
      {subNavItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subNavItems.map(item => renderNavCard(item))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No options available. Please sign in to access all features.
          </p>
        </div>
      )}
    </div>
  );
}

SectionHubPage.displayName = 'SectionHubPage';

export default SectionHubPage;
