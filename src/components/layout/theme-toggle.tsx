'use client';

import * as React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { useThemeStore } from '@/stores/ui/theme-store';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  variant?: 'ghost' | 'outline' | 'secondary';
}

/**
 * ThemeToggle Component
 *
 * Provides theme switching functionality with smooth animations.
 * Cycles through: Light → Dark → System → Light...
 *
 * Features:
 * - Visual icons for each theme state
 * - Smooth transition animations
 * - Accessible button with proper labels
 * - Tooltip showing current and next theme
 * - Integration with theme store
 */
export const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  ThemeToggleProps
>(
  (
    { className, size = 'default', showLabel = false, variant = 'ghost' },
    ref
  ) => {
    const { theme, toggleTheme } = useThemeStore();

    // Get the next theme in the cycle
    const getNextTheme = React.useCallback(() => {
      switch (theme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
        default:
          return 'light';
      }
    }, [theme]);

    // Get theme display information
    const getThemeInfo = React.useCallback((themeValue: typeof theme) => {
      switch (themeValue) {
        case 'light':
          return {
            icon: Sun,
            label: 'Light',
            description: 'Light theme',
          };
        case 'dark':
          return {
            icon: Moon,
            label: 'Dark',
            description: 'Dark theme',
          };
        case 'system':
        default:
          return {
            icon: Monitor,
            label: 'System',
            description: 'System theme',
          };
      }
    }, []);

    const currentThemeInfo = getThemeInfo(theme);
    const nextThemeInfo = getThemeInfo(getNextTheme());

    const IconComponent = currentThemeInfo.icon;

    // Button size mapping
    const getButtonSizeClasses = (sizeValue: typeof size) => {
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

    // Icon size mapping
    const getIconSizeClasses = (sizeValue: typeof size) => {
      switch (sizeValue) {
        case 'sm':
          return 'h-3.5 w-3.5';
        case 'lg':
          return 'h-5 w-5';
        case 'default':
        default:
          return 'h-4 w-4';
      }
    };

    const handleThemeToggle = React.useCallback(() => {
      toggleTheme();
    }, [toggleTheme]);

    // Tooltip content
    const tooltipContent = `Switch to ${nextThemeInfo.label.toLowerCase()} theme`;

    const ButtonComponent = (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        onClick={handleThemeToggle}
        className={cn(
          getButtonSizeClasses(size),
          'transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
          showLabel && 'w-auto space-x-2 px-3',
          className
        )}
        aria-label={`Current theme: ${currentThemeInfo.description}. ${tooltipContent}`}
        title={tooltipContent}
      >
        <IconComponent
          className={cn(
            getIconSizeClasses(size),
            'transition-all duration-300 ease-in-out'
          )}
          aria-hidden="true"
        />

        {/* Label (optional) */}
        {showLabel && (
          <span className="text-sm font-medium">{currentThemeInfo.label}</span>
        )}

        {/* Screen reader only text for current state */}
        <span className="sr-only">
          Current theme: {currentThemeInfo.description}. Click to switch to{' '}
          {nextThemeInfo.description}.
        </span>
      </Button>
    );

    // Wrap with tooltip for better UX (except on mobile where tooltips don't work well)
    if (!showLabel) {
      return (
        <SimpleTooltip content={tooltipContent}>
          {ButtonComponent}
        </SimpleTooltip>
      );
    }

    return ButtonComponent;
  }
);

ThemeToggle.displayName = 'ThemeToggle';

/**
 * Standalone theme selector component with all three options visible
 */
export interface ThemeSelectorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
}

export const ThemeSelector = React.forwardRef<
  HTMLDivElement,
  ThemeSelectorProps
>(({ className, orientation = 'horizontal', size = 'default' }, ref) => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  const getButtonSizeClasses = (sizeValue: typeof size) => {
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

  const getIconSizeClasses = (sizeValue: typeof size) => {
    switch (sizeValue) {
      case 'sm':
        return 'h-3.5 w-3.5';
      case 'lg':
        return 'h-5 w-5';
      case 'default':
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'border-border bg-background inline-flex rounded-md border p-1',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        className
      )}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themes.map(({ value, icon: IconComponent, label }) => (
        <SimpleTooltip key={value} content={`${label} theme`}>
          <Button
            variant={theme === value ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setTheme(value)}
            className={cn(
              getButtonSizeClasses(size),
              'transition-all duration-200',
              theme === value && 'shadow-sm'
            )}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
            role="radio"
            aria-checked={theme === value}
          >
            <IconComponent
              className={cn(
                getIconSizeClasses(size),
                'transition-colors duration-200'
              )}
              aria-hidden="true"
            />
            <span className="sr-only">{label}</span>
          </Button>
        </SimpleTooltip>
      ))}
    </div>
  );
});

ThemeSelector.displayName = 'ThemeSelector';
