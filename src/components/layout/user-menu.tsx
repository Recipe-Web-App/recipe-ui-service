'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  LogOut,
  UserCircle,
  Heart,
  ChefHat,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Divider } from '@/components/ui/divider';

// Store hooks
import { useAuthStore } from '@/stores/auth-store';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Auth components
import { LogoutModal } from '@/components/auth/logout-modal';

export interface UserMenuProps {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
  align?: 'start' | 'center' | 'end';
}

/**
 * UserMenu Component
 *
 * Displays user authentication state and provides access to user actions.
 *
 * Features:
 * - Shows user avatar and info when authenticated
 * - Provides sign-in button when not authenticated
 * - Dropdown menu with user actions (Profile, Settings, Logout)
 * - Compact mode for mobile/tablet
 * - Role-based menu items
 */
export const UserMenu = React.forwardRef<HTMLDivElement, UserMenuProps>(
  ({ className, compact = false, showLabel = false, align = 'end' }, ref) => {
    const router = useRouter();
    const { isAuthenticated, user, authUser } = useAuthStore();
    const { breakpoint } = useLayoutStore();
    const [isOpen, setIsOpen] = React.useState(false);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const isMobile = breakpoint === 'mobile';

    // User display information
    const displayName = user?.name ?? authUser?.email ?? 'User';
    const userEmail = authUser?.email;

    // Handle sign in
    const handleSignIn = React.useCallback(() => {
      router.push('/auth/login');
    }, [router]);

    // Close menu when clicking outside or navigating
    const handleMenuClose = React.useCallback(() => {
      setIsOpen(false);
    }, []);

    // Menu items configuration
    const menuItems = React.useMemo(() => {
      const items = [
        {
          id: 'profile',
          label: 'Profile',
          href: '/account/profile',
          icon: UserCircle,
          description: 'View and edit your profile',
        },
        {
          id: 'favorites',
          label: 'Favorites',
          href: '/recipes/favorites',
          icon: Heart,
          description: 'Your favorite recipes',
        },
        {
          id: 'recipes',
          label: 'My Recipes',
          href: '/recipes/my-recipes',
          icon: ChefHat,
          description: "Recipes you've created",
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/account/settings',
          icon: Settings,
          description: 'Account and app preferences',
        },
      ];

      // Add admin/analytics for premium users
      const userRoles: string[] = []; // TODO: Get from user object when available
      if (userRoles.includes('admin') || userRoles.includes('premium')) {
        items.splice(-1, 0, {
          id: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: BarChart3,
          description: 'Usage analytics and insights',
        });
      }

      return items;
    }, []);

    // If not authenticated, show sign in button
    if (!isAuthenticated) {
      return (
        <div ref={ref} className={cn('flex items-center', className)}>
          <Button
            onClick={handleSignIn}
            variant="default"
            size={compact ? 'sm' : 'default'}
            className={cn('transition-all duration-200', compact && 'px-3')}
          >
            <UserCircle
              className={cn('h-4 w-4', !compact && showLabel && 'mr-2')}
            />
            {!compact && showLabel && 'Sign In'}
            <span className="sr-only">Sign in to your account</span>
          </Button>
        </div>
      );
    }

    // Authenticated user menu
    const TriggerButton = (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative h-9 w-9 rounded-full transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          compact && 'h-8 w-8',
          showLabel && 'w-auto space-x-2 px-3',
          className
        )}
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <UserAvatar
          src={user?.id ? `/api/users/${user.id}/avatar` : undefined}
          alt={displayName}
          name={displayName}
          className={cn('h-7 w-7', compact && 'h-6 w-6')}
        />

        {showLabel && !compact && (
          <span className="max-w-[100px] truncate text-sm font-medium">
            {displayName}
          </span>
        )}

        {/* Online status indicator */}
        <div className="border-background bg-basil absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2" />
      </Button>
    );

    return (
      <div ref={ref} className={cn('relative', className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
          <PopoverContent align={align} sideOffset={8} className="w-56 p-0">
            <div className="p-0">
              {/* User Info Header */}
              <div className="border-border border-b px-4 py-3">
                <div className="flex items-center space-x-3">
                  <UserAvatar
                    src={user?.id ? `/api/users/${user.id}/avatar` : undefined}
                    alt={displayName}
                    name={displayName}
                    className="h-8 w-8"
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
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1" role="menu">
                {menuItems.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={handleMenuClose}
                    className={cn(
                      'flex items-center px-4 py-2 text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus:bg-accent focus:text-accent-foreground focus:outline-none'
                    )}
                    role="menuitem"
                  >
                    <item.icon className="mr-3 h-4 w-4" aria-hidden="true" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      {!isMobile && (
                        <div className="text-muted-foreground text-xs">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}

                <Divider className="my-1" />

                {/* Logout */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className={cn(
                    'flex w-full items-center px-4 py-2 text-sm transition-colors',
                    'hover:bg-destructive hover:text-destructive-foreground',
                    'focus:bg-destructive focus:text-destructive-foreground focus:outline-none',
                    'text-destructive'
                  )}
                  role="menuitem"
                >
                  <LogOut className="mr-3 h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
      </div>
    );
  }
);

UserMenu.displayName = 'UserMenu';
