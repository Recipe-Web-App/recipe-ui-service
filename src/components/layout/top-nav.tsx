'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/ui/layout-store';

// Layout Components
import { GlobalNav } from './global-nav';
import { SearchBar } from './search-bar';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';
import { MobileMenuButton } from './mobile-menu-button';
import { MobileNavDrawer } from './mobile-nav-drawer';

export interface TopNavProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'transparent';
  position?: 'sticky' | 'fixed' | 'static';
}

/**
 * TopNav Component
 *
 * Main navigation header component that provides:
 * - Logo/brand section
 * - Global navigation menu (desktop)
 * - Search functionality
 * - Theme toggle
 * - User menu
 * - Mobile menu button
 *
 * Responsive and adaptive based on screen size and authentication state.
 */
export const TopNav = React.forwardRef<HTMLElement, TopNavProps>(
  ({ className, variant = 'default', position = 'sticky' }, ref) => {
    const { breakpoint } = useLayoutStore();
    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';

    // Position classes
    const positionClasses = React.useMemo(() => {
      switch (position) {
        case 'sticky':
          return 'sticky top-0';
        case 'fixed':
          return 'fixed top-0 left-0 right-0';
        case 'static':
        default:
          return '';
      }
    }, [position]);

    // Variant classes
    const variantClasses = React.useMemo(() => {
      switch (variant) {
        case 'minimal':
          return 'bg-background/80 backdrop-blur-md border-b border-border/40';
        case 'transparent':
          return 'bg-transparent';
        case 'default':
        default:
          return 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border';
      }
    }, [variant]);

    return (
      <header
        ref={ref}
        className={cn(
          positionClasses,
          variantClasses,
          'z-50 w-full',
          className
        )}
        role="banner"
      >
        <div className="container flex h-16 max-w-screen-2xl items-center">
          {/* Logo/Brand Section */}
          <div className="mr-4 flex lg:mr-6">
            <Link
              href="/"
              className="hover:text-foreground/80 flex items-center space-x-2 transition-colors"
              aria-label="Recipe App Home"
            >
              <ChefHat className="h-6 w-6" aria-hidden="true" />
              <span className="font-bold tracking-tight">Recipe App</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && !isTablet && variant !== 'minimal' && (
            <nav
              className="hidden flex-1 items-center justify-between lg:flex"
              role="navigation"
              aria-label="Main navigation"
            >
              <GlobalNav />

              <div className="flex items-center space-x-4">
                {/* Search Bar - Hide on small tablets, show as icon */}
                {!isTablet && <SearchBar />}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Menu */}
                <UserMenu />
              </div>
            </nav>
          )}

          {/* Tablet Navigation */}
          {isTablet && variant !== 'minimal' && (
            <nav
              className="flex flex-1 items-center justify-between"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="flex items-center space-x-4">
                <GlobalNav />
              </div>

              <div className="flex items-center space-x-3">
                {/* Search Icon */}
                <SearchBar compact />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Menu */}
                <UserMenu />
              </div>
            </nav>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex flex-1 items-center justify-end space-x-3">
              {/* Search Icon (minimal) */}
              {variant !== 'minimal' && <SearchBar compact />}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Avatar (simplified) */}
              <UserMenu compact />

              {/* Mobile Menu Button */}
              <MobileMenuButton />
            </div>
          )}

          {/* Minimal variant - only show user menu and theme toggle */}
          {variant === 'minimal' && (
            <div className="flex flex-1 items-center justify-end space-x-4">
              <ThemeToggle />
              <UserMenu />
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer - Only render on mobile */}
        {isMobile && <MobileNavDrawer />}
      </header>
    );
  }
);

TopNav.displayName = 'TopNav';
