'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { isRouteActive } from '@/lib/navigation/route-utils';
import type { NavItem } from '@/types/navigation';

export interface NavDropdownProps {
  /** The navigation item with children */
  item: NavItem;
  /** Whether the dropdown is currently active (route matches) */
  isActive?: boolean;
  /** Optional class name for the trigger */
  className?: string;
  /** Whether to show icons in dropdown items */
  showIcons?: boolean;
  /** Alignment of the dropdown content */
  align?: 'start' | 'center' | 'end';
  /** Side offset from the trigger */
  sideOffset?: number;
}

/**
 * NavDropdown Component
 *
 * A split-button dropdown navigation component for top-level nav items with children.
 * Features:
 * - Label part navigates to the parent page
 * - Chevron button opens dropdown menu
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Active state highlighting
 * - Badge support for items
 * - Accessible with proper ARIA attributes
 */
export function NavDropdown({
  item,
  isActive = false,
  className,
  showIcons = true,
  align = 'start',
  sideOffset = 8,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Close dropdown when navigating
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const children = item.children ?? [];
  const Icon = item.icon;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* Split button container */}
      <div
        className={cn(
          'group inline-flex items-center rounded-md transition-all duration-200',
          'hover:bg-accent',
          isActive && 'bg-accent',
          item.metadata?.disabled &&
            'pointer-events-none cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Navigable link part - clicking navigates to the section page */}
        <Link
          href={item.href ?? '#'}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-l-md px-3 py-2 text-sm font-medium transition-colors',
            'hover:text-accent-foreground',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
            isActive && 'text-accent-foreground'
          )}
        >
          {showIcons && Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          <span>{item.label}</span>
        </Link>

        {/* Dropdown trigger part - clicking opens the dropdown */}
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center rounded-r-md px-1.5 py-2 transition-colors',
              'hover:text-accent-foreground',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
              isActive && 'text-accent-foreground'
            )}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={`Open ${item.label} menu`}
            disabled={item.metadata?.disabled}
          >
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
      </div>

      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        className="w-64 p-2"
        role="menu"
        aria-label={`${item.label} navigation`}
      >
        <nav className="flex flex-col gap-1">
          {children.map(child => {
            const ChildIcon = child.icon;
            const childIsActive = child.href
              ? isRouteActive(child.href, pathname)
              : false;
            const hasBadge = child.metadata?.badge;
            const isAction = child.metadata?.isAction;

            // Handle action items (like logout) differently
            if (isAction) {
              return (
                <button
                  key={child.id}
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                    child.metadata?.disabled && 'pointer-events-none opacity-50'
                  )}
                  role="menuitem"
                  onClick={() => {
                    // Handle logout or other actions
                    setIsOpen(false);
                    // TODO: Implement action handler (e.g., open logout modal)
                  }}
                >
                  {showIcons && ChildIcon && (
                    <ChildIcon
                      className="text-muted-foreground h-4 w-4"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex-1 text-left">{child.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={child.id}
                href={child.href ?? '#'}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  childIsActive && 'bg-accent/50 font-medium',
                  child.metadata?.disabled && 'pointer-events-none opacity-50'
                )}
                role="menuitem"
                aria-current={childIsActive ? 'page' : undefined}
                onClick={() => setIsOpen(false)}
              >
                {showIcons && ChildIcon && (
                  <ChildIcon
                    className={cn(
                      'h-4 w-4',
                      childIsActive
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1">{child.label}</span>
                {hasBadge && (
                  <Badge
                    variant={child.metadata?.badgeVariant ?? 'secondary'}
                    className="ml-auto h-5 px-1.5 text-xs"
                  >
                    {child.metadata?.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </PopoverContent>
    </Popover>
  );
}

NavDropdown.displayName = 'NavDropdown';

export default NavDropdown;
