import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  disclosureVariants,
  disclosureTriggerVariants,
  disclosureContentVariants,
  disclosureIconVariants,
  recipeDisclosureVariants,
  kitchenTipsVariants,
  faqDisclosureVariants,
  disclosureGroupVariants,
  disclosureBadgeVariants,
} from '@/lib/ui/disclosure-variants';
import type {
  DisclosureProps,
  DisclosureTriggerProps,
  DisclosureContentProps,
  RecipeDisclosureProps,
  KitchenTipsDisclosureProps,
  FAQDisclosureProps,
  IngredientNotesDisclosureProps,
  DisclosureGroupProps,
  DisclosureContextValue,
} from '@/types/ui/disclosure.types';

/**
 * Disclosure context for managing state between trigger and content
 */
const DisclosureContext = React.createContext<DisclosureContextValue | null>(
  null
);

/**
 * Custom hook to use disclosure context
 */
const useDisclosure = () => {
  const context = React.useContext(DisclosureContext);
  if (!context) {
    throw new Error(
      'Disclosure components must be used within a Disclosure provider'
    );
  }
  return context;
};

/**
 * Generate unique IDs for accessibility
 */
const useUniqueId = (prefix: string) => {
  const id = React.useId();
  return `${prefix}-${id}`;
};

/**
 * Disclosure Component
 *
 * A simple toggle for showing/hiding a single section of content.
 * Perfect for FAQ items, help text, recipe notes, and other collapsible content.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Disclosure>
 *   <DisclosureTrigger>What is this recipe about?</DisclosureTrigger>
 *   <DisclosureContent>
 *     This is a traditional Italian pasta dish...
 *   </DisclosureContent>
 * </Disclosure>
 *
 * // Controlled usage
 * <Disclosure open={isOpen} onOpenChange={setIsOpen}>
 *   <DisclosureTrigger>Advanced Options</DisclosureTrigger>
 *   <DisclosureContent>Content here</DisclosureContent>
 * </Disclosure>
 * ```
 */
const Disclosure = React.forwardRef<HTMLDivElement, DisclosureProps>(
  (
    {
      className,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      collapsible = true,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;

    const triggerId = useUniqueId('disclosure-trigger');
    const contentId = useUniqueId('disclosure-content');

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (disabled) return;
        if (!collapsible && !newOpen) return;

        if (controlledOpen === undefined) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [disabled, collapsible, controlledOpen, onOpenChange]
    );

    const contextValue = React.useMemo(
      (): DisclosureContextValue => ({
        open,
        onOpenChange: handleOpenChange,
        disabled,
        variant,
        size,
        triggerId,
        contentId,
      }),
      [open, handleOpenChange, disabled, variant, size, triggerId, contentId]
    );

    return (
      <DisclosureContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            disclosureVariants({
              variant,
              size,
              state: open ? 'open' : 'closed',
            }),
            className
          )}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled}
          {...props}
        >
          {children}
        </div>
      </DisclosureContext.Provider>
    );
  }
);
Disclosure.displayName = 'Disclosure';

/**
 * DisclosureTrigger Component
 *
 * The clickable button that toggles the disclosure content.
 * Includes built-in accessibility and keyboard navigation.
 *
 * @example
 * ```tsx
 * <DisclosureTrigger icon={<InfoIcon />} iconPosition="left">
 *   Click to expand
 * </DisclosureTrigger>
 * ```
 */
const DisclosureTrigger = React.forwardRef<
  HTMLButtonElement,
  DisclosureTriggerProps
>(
  (
    {
      className,
      children,
      onClick,
      icon,
      iconPosition = 'right',
      showIcon = true,
      ariaLabel,
      disabled: triggerDisabled,
      ...props
    },
    ref
  ) => {
    const {
      open,
      onOpenChange,
      disabled,
      variant,
      size,
      triggerId,
      contentId,
    } = useDisclosure();

    const isDisabled = disabled || triggerDisabled;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onOpenChange(!open);
      }
      onClick?.(event);
    };

    const defaultIcon = showIcon ? (
      <ChevronDown
        className={cn(
          disclosureIconVariants({
            size,
            state: open ? 'open' : 'closed',
            position: iconPosition,
          })
        )}
      />
    ) : null;

    const displayIcon = icon ?? defaultIcon;

    return (
      <button
        ref={ref}
        id={triggerId}
        type="button"
        className={cn(
          disclosureTriggerVariants({
            variant,
            size,
            disabled: isDisabled,
          }),
          className
        )}
        onClick={handleClick}
        disabled={isDisabled}
        aria-expanded={open}
        aria-controls={contentId}
        aria-label={ariaLabel}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {iconPosition === 'left' && displayIcon}
        <span className="flex-1 text-left">{children}</span>
        {iconPosition === 'right' && displayIcon}
      </button>
    );
  }
);
DisclosureTrigger.displayName = 'DisclosureTrigger';

/**
 * DisclosureContent Component
 *
 * The collapsible content panel that shows/hides based on the trigger state.
 * Includes smooth animations and proper accessibility attributes.
 *
 * @example
 * ```tsx
 * <DisclosureContent>
 *   <p>This content will be shown when the disclosure is open.</p>
 * </DisclosureContent>
 * ```
 */
const DisclosureContent = React.forwardRef<
  HTMLDivElement,
  DisclosureContentProps
>(
  (
    {
      className,
      children,
      forceMount = false,
      animationDuration = 300,
      ...props
    },
    ref
  ) => {
    const { open, variant, size, triggerId, contentId } = useDisclosure();

    // Don't render content if closed and not force mounted
    if (!open && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={contentId}
        className={cn(
          disclosureContentVariants({
            variant,
            size,
            state: open ? 'open' : 'closed',
          }),
          className
        )}
        role="region"
        aria-labelledby={triggerId}
        data-state={open ? 'open' : 'closed'}
        style={
          {
            '--disclosure-duration': `${animationDuration}ms`,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);
DisclosureContent.displayName = 'DisclosureContent';

/**
 * RecipeDisclosure Component
 *
 * Context-aware disclosure with automatic styling based on recipe use case.
 * Perfect for cooking tips, ingredient notes, and recipe-specific information.
 *
 * @example
 * ```tsx
 * <RecipeDisclosure context="tips" badge="Pro Tip">
 *   <DisclosureTrigger>How to get the perfect sear?</DisclosureTrigger>
 *   <DisclosureContent>
 *     Make sure your pan is hot before adding the protein...
 *   </DisclosureContent>
 * </RecipeDisclosure>
 * ```
 */
const RecipeDisclosure = React.forwardRef<
  HTMLDivElement,
  RecipeDisclosureProps
>(({ context, contextIcon, badge, className, children, ...props }, ref) => {
  const getContextIcon = () => {
    if (contextIcon) return contextIcon;

    switch (context) {
      case 'tips':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'notes':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        );
      case 'substitutions':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'nutrition':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Disclosure
      ref={ref}
      className={cn(
        recipeDisclosureVariants({
          context,
          state: 'closed', // Will be updated by internal state
        }),
        className
      )}
      {...props}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === DisclosureTrigger) {
          const triggerChild =
            child as React.ReactElement<DisclosureTriggerProps>;
          return React.cloneElement(triggerChild, {
            icon: triggerChild.props.icon ?? getContextIcon(),
            children: (
              <div className="flex items-center">
                <span>{triggerChild.props.children}</span>
                {badge && (
                  <span
                    className={cn(disclosureBadgeVariants({ variant: 'info' }))}
                  >
                    {badge}
                  </span>
                )}
              </div>
            ),
          });
        }
        return child;
      })}
    </Disclosure>
  );
});
RecipeDisclosure.displayName = 'RecipeDisclosure';

/**
 * KitchenTipsDisclosure Component
 *
 * Specialized disclosure for cooking tips with difficulty indicators.
 *
 * @example
 * ```tsx
 * <KitchenTipsDisclosure
 *   tipType="technique"
 *   difficulty="advanced"
 *   estimatedTime="5 min"
 * >
 *   <DisclosureTrigger>Advanced knife skills</DisclosureTrigger>
 *   <DisclosureContent>Technique details...</DisclosureContent>
 * </KitchenTipsDisclosure>
 * ```
 */
const KitchenTipsDisclosure = React.forwardRef<
  HTMLDivElement,
  KitchenTipsDisclosureProps
>(
  (
    {
      tipType = 'cooking',
      difficulty = 'beginner',
      estimatedTime,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getDifficultyBadge = () => {
      const badges = {
        beginner: { label: 'Beginner', variant: 'success' as const },
        intermediate: { label: 'Intermediate', variant: 'warning' as const },
        advanced: { label: 'Advanced', variant: 'error' as const },
      } as const;

      if (difficulty in badges) {
        return badges[difficulty as keyof typeof badges];
      }
      return badges.beginner;
    };

    const badge = getDifficultyBadge();

    return (
      <Disclosure
        ref={ref}
        className={cn(kitchenTipsVariants({ tipType, difficulty }), className)}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === DisclosureTrigger) {
            const triggerChild =
              child as React.ReactElement<DisclosureTriggerProps>;
            return React.cloneElement(triggerChild, {
              children: (
                <div className="flex w-full items-center justify-between">
                  <span>{triggerChild.props.children}</span>
                  <div className="flex items-center gap-2">
                    {estimatedTime && (
                      <span className="text-xs text-gray-500">
                        {estimatedTime}
                      </span>
                    )}
                    <span
                      className={cn(
                        disclosureBadgeVariants({ variant: badge.variant })
                      )}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>
              ),
            });
          }
          return child;
        })}
      </Disclosure>
    );
  }
);
KitchenTipsDisclosure.displayName = 'KitchenTipsDisclosure';

/**
 * FAQDisclosure Component
 *
 * Specialized disclosure for frequently asked questions with search support.
 *
 * @example
 * ```tsx
 * <FAQDisclosure
 *   question="How long can I store this in the fridge?"
 *   category="storage"
 *   featured
 * >
 *   <DisclosureContent>Up to 3 days in airtight container...</DisclosureContent>
 * </FAQDisclosure>
 * ```
 */
const FAQDisclosure = React.forwardRef<HTMLDivElement, FAQDisclosureProps>(
  (
    {
      question,
      category = 'general',
      featured = false,
      keywords: _keywords = [],
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Disclosure
        ref={ref}
        className={cn(faqDisclosureVariants({ featured, category }), className)}
        {...props}
      >
        <DisclosureTrigger>
          <div className="flex w-full items-center justify-between">
            <span className="font-medium">{question}</span>
            {featured && (
              <span
                className={cn(disclosureBadgeVariants({ variant: 'info' }))}
              >
                Featured
              </span>
            )}
          </div>
        </DisclosureTrigger>
        {children}
      </Disclosure>
    );
  }
);
FAQDisclosure.displayName = 'FAQDisclosure';

/**
 * IngredientNotesDisclosure Component
 *
 * Specialized disclosure for ingredient substitutions and notes.
 *
 * @example
 * ```tsx
 * <IngredientNotesDisclosure
 *   ingredient="Heavy cream"
 *   noteType="substitution"
 *   importance="high"
 * >
 *   <DisclosureTrigger>Substitution options</DisclosureTrigger>
 *   <DisclosureContent>Can use coconut cream or cashew cream...</DisclosureContent>
 * </IngredientNotesDisclosure>
 * ```
 */
const IngredientNotesDisclosure = React.forwardRef<
  HTMLDivElement,
  IngredientNotesDisclosureProps
>(
  (
    {
      ingredient: _ingredient,
      noteType: _noteType = 'substitution',
      importance = 'medium',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getImportanceBadge = () => {
      const badges = {
        low: { label: 'Optional', variant: 'default' as const },
        medium: { label: 'Helpful', variant: 'info' as const },
        high: { label: 'Important', variant: 'warning' as const },
      } as const;

      if (importance in badges) {
        return badges[importance as keyof typeof badges];
      }
      return badges.medium;
    };

    const badge = getImportanceBadge();

    return (
      <RecipeDisclosure
        ref={ref}
        context="substitutions"
        badge={badge.label}
        className={className}
        {...props}
      >
        {children}
      </RecipeDisclosure>
    );
  }
);
IngredientNotesDisclosure.displayName = 'IngredientNotesDisclosure';

/**
 * DisclosureGroup Component
 *
 * Container for managing multiple related disclosures with consistent spacing.
 *
 * @example
 * ```tsx
 * <DisclosureGroup spacing="loose" allowMultiple>
 *   <Disclosure>...</Disclosure>
 *   <Disclosure>...</Disclosure>
 * </DisclosureGroup>
 * ```
 */
const DisclosureGroup = React.forwardRef<HTMLDivElement, DisclosureGroupProps>(
  ({ children, spacing = 'normal', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(disclosureGroupVariants({ spacing }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DisclosureGroup.displayName = 'DisclosureGroup';

export {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  RecipeDisclosure,
  KitchenTipsDisclosure,
  FAQDisclosure,
  IngredientNotesDisclosure,
  DisclosureGroup,
};
