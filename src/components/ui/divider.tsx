import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import {
  dividerVariants,
  dividerWithTextVariants,
  dividerTextVariants,
  recipeDividerVariants,
  dividerIconVariants,
} from '@/lib/ui/divider-variants';
import type {
  DividerProps,
  DividerWithTextProps,
  DividerTextProps,
  DividerWithIconProps,
  DividerIconProps,
  RecipeDividerProps,
  SectionDividerProps,
} from '@/types/ui/divider';

/**
 * Divider Component
 *
 * A flexible, accessible divider component built with Tailwind CSS and
 * class-variance-authority for type-safe variants.
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Multiple styles (solid, dashed, dotted, double)
 * - Various weights, lengths, and spacing options
 * - Recipe-specific variants and contexts
 * - Support for text and icon decorations
 * - Full accessibility compliance
 * - Polymorphic component support (asChild prop)
 */
const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      style = 'solid',
      weight = 'thin',
      length = 'full',
      spacing = 'normal',
      color = 'default',
      asChild = false,
      decorative = true,
      role,
      'aria-orientation': ariaOrientation,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Determine ARIA attributes based on decorative prop
    const ariaAttributes = decorative
      ? {
          role: 'presentation',
          'aria-hidden': true,
        }
      : {
          role: role ?? 'separator',
          'aria-orientation': ariaOrientation ?? orientation,
          ...(ariaLabel && { 'aria-label': ariaLabel }),
        };

    const dividerClassNames = cn(
      dividerVariants({
        orientation,
        style,
        weight,
        length,
        spacing,
        color,
        className,
      })
    );

    if (asChild) {
      return (
        // @ts-expect-error - Props spreading with CVA variants causes type conflicts
        <Slot
          className={dividerClassNames}
          ref={ref}
          {...ariaAttributes}
          {...props}
        />
      );
    }

    return (
      // @ts-expect-error - Props spreading with CVA variants causes type conflicts
      <div
        className={dividerClassNames}
        ref={ref}
        {...ariaAttributes}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

/**
 * DividerText Component
 *
 * Text content for dividers with customizable styling
 */
const DividerText = React.forwardRef<HTMLElement, DividerTextProps>(
  (
    {
      className,
      size = 'md',
      color = 'muted',
      weight = 'medium',
      transform = 'none',
      as: Element = 'span',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Element
        className={cn(
          dividerTextVariants({
            size,
            color,
            weight,
            transform,
            className,
          })
        )}
        // @ts-expect-error - Polymorphic ref forwarding needs generic type
        ref={ref}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

DividerText.displayName = 'DividerText';

/**
 * DividerWithText Component
 *
 * Divider with centered or positioned text content
 */
const DividerWithText = React.forwardRef<HTMLDivElement, DividerWithTextProps>(
  (
    {
      className,
      text,
      orientation = 'horizontal',
      textPosition = 'center',
      spacing = 'normal',
      textProps,
      dividerProps,
      asChild = false,
      decorative = true,
      role,
      'aria-orientation': ariaOrientation,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const ariaAttributes = decorative
      ? {
          role: 'presentation',
          'aria-hidden': true,
        }
      : {
          role: role ?? 'separator',
          'aria-orientation': ariaOrientation ?? orientation,
          'aria-label':
            ariaLabel ?? (typeof text === 'string' ? text : undefined),
        };

    const dividerElement = (
      <Divider
        orientation={orientation}
        decorative={decorative}
        className="flex-1"
        {...dividerProps}
      />
    );

    const content = (
      // @ts-expect-error - Props spreading with CVA variants causes type conflicts
      <div
        className={cn(
          dividerWithTextVariants({
            orientation,
            textPosition,
            spacing,
            className,
          })
        )}
        ref={ref}
        {...ariaAttributes}
        {...props}
      >
        {(textPosition === 'end' || textPosition === 'center') &&
          dividerElement}
        <DividerText {...textProps}>{text}</DividerText>
        {(textPosition === 'start' || textPosition === 'center') &&
          dividerElement}
      </div>
    );

    if (asChild) {
      return <Slot>{content}</Slot>;
    }

    return content;
  }
);

DividerWithText.displayName = 'DividerWithText';

/**
 * DividerIcon Component
 *
 * Icon container for dividers with proper styling
 */
const DividerIcon = React.forwardRef<HTMLDivElement, DividerIconProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      children,
      'aria-hidden': ariaHidden = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          dividerIconVariants({
            size,
            variant,
            className,
          })
        )}
        ref={ref}
        aria-hidden={ariaHidden}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DividerIcon.displayName = 'DividerIcon';

/**
 * DividerWithIcon Component
 *
 * Divider with centered or positioned icon
 */
const DividerWithIcon = React.forwardRef<HTMLDivElement, DividerWithIconProps>(
  (
    {
      className,
      icon,
      orientation = 'horizontal',
      textPosition: iconPosition = 'center',
      spacing = 'normal',
      iconProps,
      dividerProps,
      asChild = false,
      decorative = true,
      role,
      'aria-orientation': ariaOrientation,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const ariaAttributes = decorative
      ? {
          role: 'presentation',
          'aria-hidden': true,
        }
      : {
          role: role ?? 'separator',
          'aria-orientation': ariaOrientation ?? orientation,
          ...(ariaLabel && { 'aria-label': ariaLabel }),
        };

    const dividerElement = (
      <Divider
        orientation={orientation}
        decorative={decorative}
        className="flex-1"
        {...dividerProps}
      />
    );

    const content = (
      // @ts-expect-error - Props spreading with CVA variants causes type conflicts
      <div
        className={cn(
          dividerWithTextVariants({
            orientation,
            textPosition: iconPosition,
            spacing,
            className,
          })
        )}
        ref={ref}
        {...ariaAttributes}
        {...props}
      >
        {(iconPosition === 'end' || iconPosition === 'center') &&
          dividerElement}
        <DividerIcon {...iconProps}>{icon}</DividerIcon>
        {(iconPosition === 'start' || iconPosition === 'center') &&
          dividerElement}
      </div>
    );

    if (asChild) {
      return <Slot>{content}</Slot>;
    }

    return content;
  }
);

DividerWithIcon.displayName = 'DividerWithIcon';

/**
 * RecipeDivider Component
 *
 * Recipe-specific divider with specialized styling and context
 */
const RecipeDivider = React.forwardRef<HTMLDivElement, RecipeDividerProps>(
  (
    {
      className,
      context = 'recipe-section',
      emphasis = 'normal',
      label,
      showLabel = false,
      decorative = true,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const dividerClassNames = cn(
      dividerVariants({ orientation, className: 'border-current' }),
      recipeDividerVariants({ context, emphasis }),
      className
    );

    if (showLabel && label) {
      return (
        // @ts-expect-error - Props spreading with CVA variants causes type conflicts
        <DividerWithText
          ref={ref}
          text={label}
          orientation={orientation}
          decorative={decorative}
          className={dividerClassNames}
          textProps={{
            size: 'sm',
            weight: 'medium',
            transform: 'uppercase',
            color: 'muted',
          }}
          {...props}
        />
      );
    }

    return (
      <Divider
        ref={ref}
        orientation={orientation}
        decorative={decorative}
        className={dividerClassNames}
        {...props}
      />
    );
  }
);

RecipeDivider.displayName = 'RecipeDivider';

/**
 * SectionDivider Component
 *
 * Advanced divider for recipe sections with optional title and collapsible functionality
 */
const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  (
    {
      className,
      section,
      title,
      subtitle,
      icon,
      context,
      emphasis = 'normal',
      collapsible = false,
      defaultCollapsed = false,
      onToggleCollapse,
      decorative = !title && !subtitle,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const handleToggle = React.useCallback(() => {
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      onToggleCollapse?.(newCollapsedState);
    }, [isCollapsed, onToggleCollapse]);

    // Determine context based on section if not explicitly provided
    const sectionContext = context ?? 'recipe-section';

    // If it's a simple divider without content
    if (!title && !subtitle && !icon && !collapsible) {
      return (
        <RecipeDivider
          ref={ref}
          context={sectionContext}
          emphasis={emphasis}
          decorative={decorative}
          className={className}
          {...props}
        />
      );
    }

    // Complex section divider with content
    const content = (
      <div className={cn('flex items-center gap-3', className)} ref={ref}>
        {icon && (
          <DividerIcon size="sm" variant="ghost">
            {icon}
          </DividerIcon>
        )}
        <div className="flex-1">
          {title && (
            <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-xs">{subtitle}</p>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            onClick={handleToggle}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${section} section`}
          >
            <svg
              className={cn(
                'h-4 w-4 transition-transform',
                isCollapsed ? 'rotate-0' : 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>
    );

    return (
      // @ts-expect-error - Props spreading with CVA variants causes type conflicts
      <div
        className={cn(
          recipeDividerVariants({ context: sectionContext, emphasis })
        )}
        {...props}
      >
        {content}
        <RecipeDivider
          context={sectionContext}
          emphasis="subtle"
          decorative
          className="mt-2"
        />
      </div>
    );
  }
);

SectionDivider.displayName = 'SectionDivider';

export {
  Divider,
  DividerText,
  DividerWithText,
  DividerIcon,
  DividerWithIcon,
  RecipeDivider,
  SectionDivider,
  type DividerProps,
  type DividerTextProps,
  type DividerWithTextProps,
  type DividerIconProps,
  type DividerWithIconProps,
  type RecipeDividerProps,
  type SectionDividerProps,
};
