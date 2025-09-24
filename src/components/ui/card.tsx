import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import {
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardFooterVariants,
  cardTitleVariants,
  cardDescriptionVariants,
} from '@/lib/ui/card-variants';
import {
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps,
  type CardTitleProps,
  type CardDescriptionProps,
} from '@/types/ui/card';

/**
 * Card Component
 *
 * A flexible, accessible card component built with Tailwind CSS and
 * class-variance-authority for type-safe styling variants.
 *
 * Features:
 * - Multiple visual variants (default, elevated, outlined, ghost, interactive)
 * - Three sizes (sm, default, lg)
 * - Interactive states with proper accessibility
 * - Polymorphic rendering with asChild prop
 * - Compound component pattern for flexible layouts
 * - Full TypeScript support with strict typing
 *
 * @example
 * ```tsx
 * <Card variant="elevated" size="lg">
 *   <CardHeader>
 *     <CardTitle>Recipe Title</CardTitle>
 *     <CardDescription>A delicious recipe description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Recipe content goes here...</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>View Recipe</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant, size, asChild = false, interactive, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'div';

    // Apply interactive variant if interactive prop is true
    const effectiveVariant = interactive ? 'interactive' : variant;

    return (
      <Comp
        className={cn(
          cardVariants({ variant: effectiveVariant, size, className })
        )}
        ref={ref}
        {...(interactive && {
          role: 'button',
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Create a synthetic click event from keyboard event
              if (props.onClick) {
                const syntheticEvent = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                });
                Object.defineProperty(syntheticEvent, 'target', {
                  value: e.currentTarget,
                  enumerable: true,
                });
                props.onClick(
                  syntheticEvent as unknown as React.MouseEvent<HTMLDivElement>
                );
              }
            }
          },
        })}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

/**
 * Card Header Component
 *
 * Container for card title, description, and other header content.
 * Provides consistent spacing and layout for card headers.
 *
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>Recipe Title</CardTitle>
 *   <CardDescription>Brief description</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(cardHeaderVariants({ className }))}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

/**
 * Card Content Component
 *
 * Main content area of the card. Provides proper spacing and
 * layout for card body content.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Main card content goes here...</p>
 *   <ul>
 *     <li>Feature 1</li>
 *     <li>Feature 2</li>
 *   </ul>
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(cardContentVariants({ className }))}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 *
 * Footer area for actions, buttons, and other footer content.
 * Typically used for action buttons or metadata.
 *
 * @example
 * ```tsx
 * <CardFooter>
 *   <Button variant="outline">Cancel</Button>
 *   <Button>Save Recipe</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={ref}
        className={cn(cardFooterVariants({ className }))}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

/**
 * Card Title Component
 *
 * Heading element for card titles. Provides consistent typography
 * and spacing for card titles.
 *
 * @example
 * ```tsx
 * <CardTitle>Chocolate Chip Cookies</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'h3';

    return (
      <Comp
        ref={ref}
        className={cn(cardTitleVariants({ className }))}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

/**
 * Card Description Component
 *
 * Subtitle or description element for cards. Provides muted text
 * styling for card descriptions and subtitles.
 *
 * @example
 * ```tsx
 * <CardDescription>
 *   A classic recipe for soft and chewy chocolate chip cookies
 * </CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'p';

  return (
    <Comp
      ref={ref}
      className={cn(cardDescriptionVariants({ className }))}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
};
