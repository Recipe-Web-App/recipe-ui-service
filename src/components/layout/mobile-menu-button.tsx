'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/stores/ui/navigation-store';

export interface MobileMenuButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * MobileMenuButton Component
 *
 * Animated hamburger menu button for mobile navigation.
 *
 * Features:
 * - Smooth animation between hamburger and X states
 * - Integration with navigation store
 * - Touch-friendly sizing
 * - Accessible button with proper labels
 * - Custom animation using CSS transforms
 */
export const MobileMenuButton = React.forwardRef<
  HTMLButtonElement,
  MobileMenuButtonProps
>(({ className, size = 'default' }, ref) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigationStore();

  // Button size mapping
  const getSizeClasses = (sizeValue: typeof size) => {
    switch (sizeValue) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-10 w-10';
      case 'default':
      default:
        return 'h-9 w-9';
    }
  };

  const handleToggle = React.useCallback(() => {
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        getSizeClasses(size),
        'transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        // Minimum touch target for mobile accessibility
        'min-h-[44px] min-w-[44px]',
        className
      )}
      aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
      aria-expanded={isMobileMenuOpen}
      aria-haspopup="menu"
      aria-controls="mobile-menu"
    >
      {/* Animated hamburger/X icon */}
      <div className="relative flex h-5 w-5 flex-col items-center justify-center">
        {/* Top line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out',
            isMobileMenuOpen
              ? 'translate-y-0 rotate-45'
              : '-translate-y-1.5 rotate-0'
          )}
          aria-hidden="true"
        />

        {/* Middle line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out',
            isMobileMenuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          aria-hidden="true"
        />

        {/* Bottom line */}
        <span
          className={cn(
            'absolute h-0.5 w-5 bg-current transition-all duration-300 ease-in-out',
            isMobileMenuOpen
              ? 'translate-y-0 -rotate-45'
              : 'translate-y-1.5 rotate-0'
          )}
          aria-hidden="true"
        />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      </span>
    </Button>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';

/**
 * Alternative hamburger button with different animation style
 */
export interface AlternativeMobileMenuButtonProps
  extends MobileMenuButtonProps {
  variant?: 'hamburger' | 'dots' | 'arrow';
}

export const AlternativeMobileMenuButton = React.forwardRef<
  HTMLButtonElement,
  AlternativeMobileMenuButtonProps
>(({ className, size = 'default', variant = 'hamburger' }, ref) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavigationStore();

  const getSizeClasses = (sizeValue: typeof size) => {
    switch (sizeValue) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-10 w-10';
      case 'default':
      default:
        return 'h-9 w-9';
    }
  };

  const handleToggle = React.useCallback(() => {
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  // Render different variants
  const renderIcon = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex flex-col space-y-1">
            {[1, 2, 3].map(dot => (
              <div
                key={dot}
                className={cn(
                  'h-1 w-1 rounded-full bg-current transition-all duration-200',
                  isMobileMenuOpen && 'scale-0 opacity-0'
                )}
              />
            ))}
          </div>
        );

      case 'arrow':
        return (
          <svg
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isMobileMenuOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        );

      case 'hamburger':
      default:
        return (
          <div className="relative h-5 w-5">
            {/* Three lines that transform into X */}
            {[0, 1, 2].map(index => (
              <span
                key={index}
                className={cn(
                  'absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ease-in-out',
                  index === 0 &&
                    (isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'),
                  index === 1 && (isMobileMenuOpen ? 'opacity-0' : 'top-2'),
                  index === 2 &&
                    (isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4')
                )}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        getSizeClasses(size),
        'transition-all duration-200',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'min-h-[44px] min-w-[44px]',
        className
      )}
      aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
      aria-expanded={isMobileMenuOpen}
    >
      {renderIcon()}
      <span className="sr-only">
        {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      </span>
    </Button>
  );
});

AlternativeMobileMenuButton.displayName = 'AlternativeMobileMenuButton';
