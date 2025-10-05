import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  collapseVariants,
  collapseTriggerVariants,
  collapseContentVariants,
  collapseIconVariants,
  recipeSectionCollapseVariants,
} from '@/lib/ui/collapse-variants';
import type {
  CollapseProps,
  CollapseTriggerProps,
  CollapseContentProps,
  RecipeCollapseProps,
  KitchenTipsCollapseProps,
  FAQCollapseProps,
  IngredientNotesCollapseProps,
  CollapseGroupProps,
  CollapseContextValue,
  CollapseAnimationState,
  UseCollapseHeightReturn,
} from '@/types/ui/collapse.types';

/**
 * Collapse context for managing state between trigger and content
 */
const CollapseContext = React.createContext<CollapseContextValue | null>(null);

/**
 * Custom hook to use collapse context
 */
const useCollapse = () => {
  const context = React.useContext(CollapseContext);
  if (!context) {
    throw new Error(
      'Collapse components must be used within a Collapse provider'
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
 * Custom hook for managing collapse height transitions
 */
const useCollapseHeight = (
  open: boolean,
  animationDuration: number
): UseCollapseHeightReturn => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState(0);
  const [animationState, setAnimationState] =
    React.useState<CollapseAnimationState>('idle');

  const isAnimating = animationState !== 'idle';

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (open) {
      setAnimationState('opening');
      const scrollHeight = element.scrollHeight;
      setHeight(scrollHeight);

      const timer = setTimeout(() => {
        setAnimationState('idle');
      }, animationDuration);

      return () => clearTimeout(timer);
    } else {
      setAnimationState('closing');
      setHeight(0);

      const timer = setTimeout(() => {
        setAnimationState('idle');
      }, animationDuration);

      return () => clearTimeout(timer);
    }
  }, [open, animationDuration]);

  return {
    ref,
    height,
    isAnimating,
    animationState,
  };
};

/**
 * Collapse Component
 *
 * A utility component for expanding/collapsing content with smooth animation.
 * Perfect for recipe sections, FAQ items, and other collapsible content.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Collapse trigger="Ingredients">
 *   <p>List of ingredients here...</p>
 * </Collapse>
 *
 * // Controlled usage
 * <Collapse open={isOpen} onOpenChange={setIsOpen}>
 *   <CollapseTrigger>Advanced Options</CollapseTrigger>
 *   <CollapseContent>Content here</CollapseContent>
 * </Collapse>
 * ```
 */
const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      className,
      children,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      disabled = false,
      animationDuration = 300,
      trigger,
      smoothTransitions = true,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen ?? internalOpen;

    const triggerId = useUniqueId('collapse-trigger');
    const contentId = useUniqueId('collapse-content');

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (disabled) return;

        if (controlledOpen === undefined) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [disabled, controlledOpen, onOpenChange]
    );

    const contextValue = React.useMemo(
      (): CollapseContextValue => ({
        open,
        onOpenChange: handleOpenChange,
        disabled,
        variant,
        size,
        animationDuration,
        triggerId,
        contentId,
        smoothTransitions,
      }),
      [
        open,
        handleOpenChange,
        disabled,
        variant,
        size,
        animationDuration,
        triggerId,
        contentId,
        smoothTransitions,
      ]
    );

    return (
      <CollapseContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            collapseVariants({
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
          {trigger && <CollapseTrigger>{trigger}</CollapseTrigger>}
          {children}
        </div>
      </CollapseContext.Provider>
    );
  }
);
Collapse.displayName = 'Collapse';

/**
 * CollapseTrigger Component
 *
 * The clickable button that toggles the collapse content.
 * Includes built-in accessibility and keyboard navigation.
 *
 * @example
 * ```tsx
 * <CollapseTrigger icon={<InfoIcon />} iconPosition="left">
 *   Click to expand
 * </CollapseTrigger>
 * ```
 */
const CollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapseTriggerProps
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
      animationSpeed = 'normal',
      disabled: triggerDisabled,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const {
      open,
      onOpenChange,
      disabled,
      variant: contextVariant,
      size: contextSize,
      triggerId,
      contentId,
    } = useCollapse();

    const isDisabled = disabled || triggerDisabled;
    const finalVariant = variant ?? contextVariant;
    const finalSize = size ?? contextSize;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        onOpenChange(!open);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!isDisabled) {
          onOpenChange(!open);
        }
      }
    };

    const defaultIcon = showIcon ? (
      <ChevronDown
        className={cn(
          collapseIconVariants({
            size: finalSize,
            animationSpeed,
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
          collapseTriggerVariants({
            variant: finalVariant,
            size: finalSize,
            disabled: isDisabled,
          }),
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
CollapseTrigger.displayName = 'CollapseTrigger';

/**
 * CollapseContent Component
 *
 * The collapsible content panel that shows/hides based on the trigger state.
 * Includes smooth height transitions and proper accessibility attributes.
 *
 * @example
 * ```tsx
 * <CollapseContent>
 *   <p>This content will be shown when the collapse is open.</p>
 * </CollapseContent>
 * ```
 */
const CollapseContent = React.forwardRef<HTMLDivElement, CollapseContentProps>(
  (
    {
      className,
      children,
      forceMount = false,
      animationDuration: customAnimationDuration,
      animationEasing = 'ease-in-out',
      collapsedHeight = 0,
      animatePadding = true,
      variant,
      size,
      animationSpeed = 'normal',
      ...props
    },
    ref
  ) => {
    const {
      open,
      variant: contextVariant,
      size: contextSize,
      animationDuration: contextAnimationDuration,
      triggerId,
      contentId,
      smoothTransitions,
    } = useCollapse();

    const finalVariant = variant ?? contextVariant;
    const finalSize = size ?? contextSize;
    const finalAnimationDuration =
      customAnimationDuration ?? contextAnimationDuration;

    const { ref: heightRef, height } = useCollapseHeight(
      open,
      finalAnimationDuration
    );

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
        if (heightRef.current !== node) {
          (heightRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      },
      [ref, heightRef]
    );

    // Don't render content if closed and not force mounted
    if (!open && !forceMount) {
      return null;
    }

    const styles: React.CSSProperties = smoothTransitions
      ? ({
          '--collapse-height': open ? height || 'auto' : collapsedHeight,
          '--collapse-duration': `${finalAnimationDuration}ms`,
          '--collapse-timing': animationEasing,
          '--collapse-property': animatePadding
            ? 'height, padding-top, padding-bottom, opacity'
            : 'height, opacity',
        } as React.CSSProperties)
      : {};

    return (
      <div
        ref={combinedRef}
        id={contentId}
        className={cn(
          collapseContentVariants({
            variant: finalVariant,
            size: finalSize,
            animationSpeed,
            state: open ? 'open' : 'closed',
          }),
          smoothTransitions && [
            '[height:var(--collapse-height)]',
            '[transition-duration:var(--collapse-duration)]',
            '[transition-timing-function:var(--collapse-timing)]',
            '[transition-property:var(--collapse-property)]',
          ],
          className
        )}
        role="region"
        aria-labelledby={triggerId}
        data-state={open ? 'open' : 'closed'}
        style={styles}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CollapseContent.displayName = 'CollapseContent';

/**
 * RecipeCollapse Component
 *
 * Context-aware collapse with automatic styling based on recipe use case.
 * Perfect for cooking sections, ingredient lists, and recipe-specific information.
 *
 * @example
 * ```tsx
 * <RecipeCollapse section="ingredients" count={8} countLabel="ingredients">
 *   <CollapseTrigger>Ingredients</CollapseTrigger>
 *   <CollapseContent>
 *     Ingredient list here...
 *   </CollapseContent>
 * </RecipeCollapse>
 * ```
 */
const RecipeCollapse = React.forwardRef<HTMLDivElement, RecipeCollapseProps>(
  (
    {
      section,
      sectionIcon,
      count,
      countLabel,
      estimatedTime,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getSectionIcon = () => {
      if (sectionIcon) return sectionIcon;

      const iconProps = { className: 'h-4 w-4' };

      switch (section) {
        case 'ingredients':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'instructions':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'equipment':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          );
        case 'nutrition':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'notes':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          );
        case 'tips':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'timeline':
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    const getCountLabel = () => {
      if (countLabel) return countLabel;

      switch (section) {
        case 'ingredients':
          return count === 1 ? 'ingredient' : 'ingredients';
        case 'instructions':
          return count === 1 ? 'step' : 'steps';
        case 'equipment':
          return count === 1 ? 'item' : 'items';
        case 'notes':
          return count === 1 ? 'note' : 'notes';
        case 'tips':
          return count === 1 ? 'tip' : 'tips';
        default:
          return count === 1 ? 'item' : 'items';
      }
    };

    return (
      <Collapse
        ref={ref}
        className={cn(
          recipeSectionCollapseVariants({
            section,
            state: 'closed', // Will be updated by internal state
          }),
          className
        )}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CollapseTrigger) {
            const triggerChild =
              child as React.ReactElement<CollapseTriggerProps>;
            return React.cloneElement(triggerChild, {
              icon: triggerChild.props.icon ?? getSectionIcon(),
              children: (
                <div className="flex w-full items-center justify-between">
                  <span>{triggerChild.props.children}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {count !== undefined && (
                      <span>
                        {count} {getCountLabel()}
                      </span>
                    )}
                    {estimatedTime && <span>• {estimatedTime}</span>}
                  </div>
                </div>
              ),
            });
          }
          return child;
        })}
      </Collapse>
    );
  }
);
RecipeCollapse.displayName = 'RecipeCollapse';

/**
 * KitchenTipsCollapse Component
 *
 * Specialized collapse for cooking tips with difficulty indicators.
 *
 * @example
 * ```tsx
 * <KitchenTipsCollapse
 *   tipType="technique"
 *   difficulty="advanced"
 *   estimatedTime="5 min"
 *   proTip
 * >
 *   <CollapseTrigger>Advanced knife skills</CollapseTrigger>
 *   <CollapseContent>Technique details...</CollapseContent>
 * </KitchenTipsCollapse>
 * ```
 */
const KitchenTipsCollapse = React.forwardRef<
  HTMLDivElement,
  KitchenTipsCollapseProps
>(
  (
    {
      tipType: _tipType = 'cooking',
      difficulty = 'beginner',
      estimatedTime,
      proTip = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getDifficultyBadge = () => {
      const badges = {
        beginner: { label: 'Beginner', color: 'bg-green-100 text-green-800' },
        intermediate: {
          label: 'Intermediate',
          color: 'bg-yellow-100 text-yellow-800',
        },
        advanced: { label: 'Advanced', color: 'bg-red-100 text-red-800' },
      } as const;

      return difficulty in badges
        ? badges[difficulty as keyof typeof badges]
        : badges.beginner;
    };

    const badge = getDifficultyBadge();

    return (
      <RecipeCollapse
        ref={ref}
        section="tips"
        className={cn(
          'border-l-orange-500 bg-orange-50 hover:bg-orange-100',
          className
        )}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CollapseTrigger) {
            const triggerChild =
              child as React.ReactElement<CollapseTriggerProps>;
            return React.cloneElement(triggerChild, {
              children: (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{triggerChild.props.children}</span>
                    {proTip && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        Pro Tip
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {estimatedTime && (
                      <span className="text-gray-500">{estimatedTime}</span>
                    )}
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        badge.color
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
      </RecipeCollapse>
    );
  }
);
KitchenTipsCollapse.displayName = 'KitchenTipsCollapse';

/**
 * FAQCollapse Component
 *
 * Specialized collapse for frequently asked questions with search support.
 *
 * @example
 * ```tsx
 * <FAQCollapse
 *   question="How long can I store this in the fridge?"
 *   category="storage"
 *   featured
 * >
 *   <CollapseContent>Up to 3 days in airtight container...</CollapseContent>
 * </FAQCollapse>
 * ```
 */
const FAQCollapse = React.forwardRef<HTMLDivElement, FAQCollapseProps>(
  (
    {
      question,
      category: _category = 'general',
      featured = false,
      keywords: _keywords = [],
      questionId,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useUniqueId('faq');
    const id = questionId ?? generatedId;

    return (
      <Collapse
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200',
          featured && 'border-blue-300 ring-2 ring-blue-200',
          className
        )}
        {...props}
      >
        <CollapseTrigger>
          <div className="flex w-full items-center justify-between">
            <span className="text-left font-medium">{question}</span>
            {featured && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                Featured
              </span>
            )}
          </div>
        </CollapseTrigger>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CollapseContent) {
            const childProps = child.props as CollapseContentProps;
            return React.cloneElement(
              child as React.ReactElement<CollapseContentProps>,
              {
                ...childProps,
                id,
              }
            );
          }
          return child;
        })}
      </Collapse>
    );
  }
);
FAQCollapse.displayName = 'FAQCollapse';

/**
 * IngredientNotesCollapse Component
 *
 * Specialized collapse for ingredient substitutions and notes.
 *
 * @example
 * ```tsx
 * <IngredientNotesCollapse
 *   ingredient="Heavy cream"
 *   noteType="substitution"
 *   importance="high"
 * >
 *   <CollapseTrigger>Substitution options</CollapseTrigger>
 *   <CollapseContent>Can use coconut cream or cashew cream...</CollapseContent>
 * </IngredientNotesCollapse>
 * ```
 */
const IngredientNotesCollapse = React.forwardRef<
  HTMLDivElement,
  IngredientNotesCollapseProps
>(
  (
    {
      ingredient,
      noteType: _noteType = 'substitution',
      importance = 'medium',
      allergenWarning = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getImportanceBadge = () => {
      const badges = {
        low: { label: 'Optional', color: 'bg-gray-100 text-gray-700' },
        medium: { label: 'Helpful', color: 'bg-blue-100 text-blue-700' },
        high: { label: 'Important', color: 'bg-yellow-100 text-yellow-700' },
      } as const;

      return importance in badges
        ? badges[importance as keyof typeof badges]
        : badges.medium;
    };

    const badge = getImportanceBadge();

    return (
      <Collapse
        ref={ref}
        className={cn(
          'rounded-lg border border-gray-200',
          allergenWarning && 'border-red-300 bg-red-50',
          className
        )}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CollapseTrigger) {
            const triggerChild =
              child as React.ReactElement<CollapseTriggerProps>;
            return React.cloneElement(triggerChild, {
              children: (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{triggerChild.props.children}</span>
                    <span className="text-sm text-gray-500">
                      ({ingredient})
                    </span>
                    {allergenWarning && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        Allergen
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      badge.color
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
              ),
            });
          }
          return child;
        })}
      </Collapse>
    );
  }
);
IngredientNotesCollapse.displayName = 'IngredientNotesCollapse';

/**
 * CollapseGroup Component
 *
 * Container for managing multiple related collapses with consistent spacing.
 *
 * @example
 * ```tsx
 * <CollapseGroup spacing="loose" allowMultiple>
 *   <Collapse>...</Collapse>
 *   <Collapse>...</Collapse>
 * </CollapseGroup>
 * ```
 */
const CollapseGroup = React.forwardRef<HTMLDivElement, CollapseGroupProps>(
  (
    {
      children,
      allowMultiple = true,
      spacing = 'normal',
      defaultOpenItems = [],
      openItems: controlledOpenItems,
      onOpenItemsChange,
      className,
      ...props
    },
    ref
  ) => {
    const [internalOpenItems, setInternalOpenItems] =
      React.useState(defaultOpenItems);
    const openItems = controlledOpenItems ?? internalOpenItems;

    const handleItemOpenChange = React.useCallback(
      (index: number, isOpen: boolean) => {
        let newOpenItems: number[];

        if (allowMultiple) {
          if (isOpen) {
            newOpenItems = [...openItems, index];
          } else {
            newOpenItems = openItems.filter(item => item !== index);
          }
        } else {
          newOpenItems = isOpen ? [index] : [];
        }

        if (controlledOpenItems === undefined) {
          setInternalOpenItems(newOpenItems);
        }
        onOpenItemsChange?.(newOpenItems);
      },
      [allowMultiple, openItems, controlledOpenItems, onOpenItemsChange]
    );

    const spacingClasses = {
      tight: 'space-y-1',
      normal: 'space-y-2',
      loose: 'space-y-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          spacingClasses[spacing as keyof typeof spacingClasses],
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const isOpen = openItems.includes(index);
            const childProps = child.props as CollapseProps & {
              onOpenChange?: (open: boolean) => void;
            };
            return React.cloneElement(
              child as React.ReactElement<CollapseProps>,
              {
                ...childProps,
                open: isOpen,
                onOpenChange: (newOpen: boolean) => {
                  handleItemOpenChange(index, newOpen);
                  childProps.onOpenChange?.(newOpen);
                },
              }
            );
          }
          return child;
        })}
      </div>
    );
  }
);
CollapseGroup.displayName = 'CollapseGroup';

export {
  Collapse,
  CollapseTrigger,
  CollapseContent,
  RecipeCollapse,
  KitchenTipsCollapse,
  FAQCollapse,
  IngredientNotesCollapse,
  CollapseGroup,
};
