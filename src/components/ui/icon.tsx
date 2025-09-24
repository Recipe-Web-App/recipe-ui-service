import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  iconVariants,
  iconContainerVariants,
  recipeIconVariants,
} from '@/lib/ui/icon-variants';
import { getIcon, hasIcon } from '@/lib/ui/icon-registry';
import type {
  IconProps,
  IconContainerProps,
  RecipeIconProps,
  IconName,
} from '@/types/ui/icon';

/**
 * Icon Component
 *
 * A flexible, accessible icon component that provides a unified interface
 * for all Lucide React icons with comprehensive styling and theming support.
 *
 * Features:
 * - Type-safe icon names from registry
 * - Multiple size variants (xs, sm, default, lg, xl, 2xl)
 * - Color system integration with theme
 * - Animation support (spin, pulse, bounce, ping)
 * - Accessibility built-in with proper ARIA attributes
 * - Recipe-specific styling variants
 * - Interactive states and event handling
 */
const Icon = React.forwardRef<
  React.ElementRef<'svg'>,
  IconProps & React.ComponentPropsWithoutRef<'svg'>
>(
  (
    {
      name,
      size = 'default',
      color = 'default',
      animation = 'none',
      state = 'default',
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      title,
      onClick,
      focusable = false,
      role,
      ...props
    },
    ref
  ) => {
    // Validate icon exists
    if (!hasIcon(name)) {
      console.warn(`Icon "${name}" not found in registry`);
      return null;
    }

    const IconComponent = getIcon(name);

    // Early return if icon doesn't exist
    if (!IconComponent) {
      return null;
    }

    // Determine accessibility attributes
    const isDecorative =
      ariaHidden === true || (!ariaLabel && !title && !onClick);
    const iconRole =
      role ?? (onClick ? 'button' : isDecorative ? 'presentation' : 'img');
    const isFocusable = focusable || !!onClick;

    return (
      <IconComponent
        ref={ref}
        className={cn(
          iconVariants({ size, color, animation, state }),
          onClick && 'cursor-pointer',
          className
        )}
        aria-label={isDecorative ? undefined : (ariaLabel ?? `${name} icon`)}
        aria-hidden={isDecorative}
        role={iconRole}
        tabIndex={isFocusable ? 0 : undefined}
        focusable={isFocusable}
        onClick={onClick ? () => onClick() : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        {...props}
      >
        {title && <title>{title}</title>}
      </IconComponent>
    );
  }
);

Icon.displayName = 'Icon';

/**
 * IconContainer Component
 *
 * A container for grouping multiple icons with consistent spacing
 * and optional background styling.
 */
const IconContainer = React.forwardRef<HTMLDivElement, IconContainerProps>(
  (
    {
      children,
      spacing = 'default',
      background = 'none',
      className,
      interactive = false,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          iconContainerVariants({ spacing, background }),
          interactive && 'cursor-pointer transition-opacity hover:opacity-80',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

IconContainer.displayName = 'IconContainer';

/**
 * RecipeIcon Component
 *
 * A specialized icon component for recipe-related content with
 * category-specific styling and semantic meaning.
 */
const RecipeIcon = React.forwardRef<React.ElementRef<'svg'>, RecipeIconProps>(
  (
    {
      name,
      category = 'cooking',
      emphasis = 'normal',
      size = 'default',
      className,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...iconProps
    },
    ref
  ) => {
    return (
      <Icon
        ref={ref}
        name={name}
        size={size}
        className={cn(recipeIconVariants({ category, emphasis }), className)}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        {...iconProps}
      />
    );
  }
);

RecipeIcon.displayName = 'RecipeIcon';

/**
 * Common icon pattern components for convenience
 */

/**
 * LoadingIcon - Standard loading spinner
 */
const LoadingIcon: React.FC<{
  size?: IconProps['size'];
  className?: string;
}> = ({ size = 'default', className }) => (
  <Icon
    name="loading"
    size={size}
    animation="spin"
    aria-label="Loading"
    className={className}
  />
);

/**
 * CloseIcon - Standard close/dismiss icon
 */
const CloseIcon: React.FC<{
  size?: IconProps['size'];
  onClick?: () => void;
  className?: string;
}> = ({ size = 'default', onClick, className }) => (
  <Icon
    name="close"
    size={size}
    state={onClick ? 'interactive' : 'default'}
    onClick={onClick}
    aria-label="Close"
    className={className}
  />
);

/**
 * SearchIcon - Standard search icon
 */
const SearchIcon: React.FC<{
  size?: IconProps['size'];
  className?: string;
}> = ({ size = 'default', className }) => (
  <Icon name="search" size={size} aria-label="Search" className={className} />
);

/**
 * MenuIcon - Standard menu/hamburger icon
 */
const MenuIcon: React.FC<{
  size?: IconProps['size'];
  onClick?: () => void;
  className?: string;
}> = ({ size = 'default', onClick, className }) => (
  <Icon
    name="menu"
    size={size}
    state={onClick ? 'interactive' : 'default'}
    onClick={onClick}
    aria-label="Menu"
    className={className}
  />
);

/**
 * ChevronIcon - Directional chevron icon
 */
const ChevronIcon: React.FC<{
  direction: 'left' | 'right' | 'up' | 'down';
  size?: IconProps['size'];
  onClick?: () => void;
  className?: string;
}> = ({ direction, size = 'default', onClick, className }) => (
  <Icon
    name={`chevron-${direction}` as IconName}
    size={size}
    state={onClick ? 'interactive' : 'default'}
    onClick={onClick}
    aria-label={`${direction} arrow`}
    className={className}
  />
);

/**
 * StatusIcon - Status indicator icon
 */
const StatusIcon: React.FC<{
  status: 'success' | 'error' | 'warning' | 'info';
  size?: IconProps['size'];
  className?: string;
}> = ({ status, size = 'default', className }) => {
  const getIconName = (
    status: 'success' | 'error' | 'warning' | 'info'
  ): IconName => {
    switch (status) {
      case 'success':
        return 'success' as IconName;
      case 'error':
        return 'error' as IconName;
      case 'warning':
        return 'warning' as IconName;
      case 'info':
        return 'info' as IconName;
      default:
        return 'info' as IconName;
    }
  };

  const getIconColor = (status: 'success' | 'error' | 'warning' | 'info') => {
    switch (status) {
      case 'success':
        return 'success' as const;
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'warning' as const;
      case 'info':
        return 'info' as const;
      default:
        return 'info' as const;
    }
  };

  return (
    <Icon
      name={getIconName(status)}
      size={size}
      color={getIconColor(status)}
      aria-label={`${status} status`}
      className={className}
    />
  );
};

export {
  Icon,
  IconContainer,
  RecipeIcon,
  LoadingIcon,
  CloseIcon,
  SearchIcon,
  MenuIcon,
  ChevronIcon,
  StatusIcon,
};

export type { IconProps, IconContainerProps, RecipeIconProps, IconName };
