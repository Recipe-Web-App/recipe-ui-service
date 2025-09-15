import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  accordionIconVariants,
  recipeSectionVariants,
  recipeListVariants,
  recipeListItemVariants,
  recipeStepNumberVariants,
  ingredientCheckboxVariants,
} from '@/lib/ui/accordion-variants';

/**
 * Accordion root component props interface
 */
export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

/**
 * Accordion context for managing state
 */
interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string | string[];
  onItemClick: (itemValue: string) => void;
  variant: VariantProps<typeof accordionVariants>['variant'];
  size: VariantProps<typeof accordionVariants>['size'];
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null
);

/**
 * Accordion root component
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      children,
      type = 'single',
      collapsible = true,
      defaultValue,
      value: controlledValue,
      onValueChange,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      defaultValue ?? (type === 'multiple' ? [] : '')
    );

    const value = controlledValue ?? internalValue;

    const handleItemClick = React.useCallback(
      (itemValue: string) => {
        let newValue: string | string[];

        if (type === 'multiple') {
          const currentArray = Array.isArray(value) ? value : [];
          newValue = currentArray.includes(itemValue)
            ? currentArray.filter(v => v !== itemValue)
            : [...currentArray, itemValue];
        } else {
          newValue = value === itemValue && collapsible ? '' : itemValue;
        }

        if (!controlledValue) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [type, value, collapsible, controlledValue, onValueChange]
    );

    const contextValue = React.useMemo(
      () => ({
        type,
        value,
        onItemClick: handleItemClick,
        variant,
        size,
      }),
      [type, value, handleItemClick, variant, size]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(accordionVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = 'Accordion';

/**
 * Accordion item component props interface
 */
export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

/**
 * Accordion item component
 */
const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const context = React.useContext(AccordionContext);
    if (!context) {
      throw new Error('AccordionItem must be used within an Accordion');
    }

    const { value: accordionValue, variant } = context;
    const isOpen = Array.isArray(accordionValue)
      ? accordionValue.includes(value)
      : accordionValue === value;

    return (
      <div
        ref={ref}
        className={cn(
          accordionItemVariants({
            variant,
            state: isOpen ? 'open' : 'closed',
          }),
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        {...props}
      >
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(
                child as React.ReactElement<{
                  value?: string;
                  disabled?: boolean;
                  isOpen?: boolean;
                }>,
                {
                  value,
                  disabled:
                    disabled ||
                    (child.props as { disabled?: boolean })?.disabled,
                  isOpen,
                }
              )
            : child
        )}
      </div>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

/**
 * Accordion trigger component props interface
 */
export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  disabled?: boolean;
  isOpen?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Accordion trigger component
 */
const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(
  (
    {
      className,
      children,
      value,
      disabled = false,
      isOpen = false,
      icon,
      iconPosition = 'right',
      onClick,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(AccordionContext);
    if (!context) {
      throw new Error('AccordionTrigger must be used within an Accordion');
    }

    const { onItemClick, variant, size } = context;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && value) {
        onItemClick(value);
      }
      onClick?.(e);
    };

    const defaultIcon = (
      <svg
        className={cn(
          accordionIconVariants({
            size,
            state: isOpen ? 'open' : 'closed',
            position: iconPosition,
          })
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
    );

    return (
      <button
        ref={ref}
        className={cn(
          accordionTriggerVariants({ variant, size, disabled }),
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        aria-expanded={isOpen}
        {...props}
      >
        {iconPosition === 'left' && (icon ?? defaultIcon)}
        <span className="flex-1 text-left">{children}</span>
        {iconPosition === 'right' && (icon ?? defaultIcon)}
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

/**
 * Accordion content component props interface
 */
export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  isOpen?: boolean;
}

/**
 * Accordion content component
 */
const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, value, isOpen = false, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionContent must be used within an Accordion');
  }

  const { variant, size } = context;

  return (
    <div
      ref={ref}
      className={cn(
        accordionContentVariants({
          variant,
          size,
          state: isOpen ? 'open' : 'closed',
        }),
        className
      )}
      role="region"
      aria-labelledby={value ? `accordion-trigger-${value}` : undefined}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = 'AccordionContent';

/**
 * Recipe section accordion props interface
 */
export interface RecipeSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  title: string;
  section:
    | 'ingredients'
    | 'instructions'
    | 'nutrition'
    | 'notes'
    | 'tips'
    | 'variations';
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
}

/**
 * Recipe section accordion component
 */
const RecipeSection = React.forwardRef<HTMLDivElement, RecipeSectionProps>(
  (
    {
      className,
      children,
      value,
      title,
      section,
      icon,
      count,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(AccordionContext);
    if (!context) {
      throw new Error('RecipeSection must be used within an Accordion');
    }

    const { value: accordionValue } = context;
    const isOpen = Array.isArray(accordionValue)
      ? accordionValue.includes(value)
      : accordionValue === value;

    const getSectionIcon = () => {
      if (icon) return icon;

      switch (section) {
        case 'ingredients':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'instructions':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'nutrition':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'notes':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          );
        case 'tips':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'variations':
          return (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          recipeSectionVariants({ section, state: isOpen ? 'open' : 'closed' }),
          className
        )}
        {...props}
      >
        <AccordionItem value={value} disabled={disabled}>
          <AccordionTrigger disabled={disabled}>
            <div className="flex items-center gap-3">
              {getSectionIcon()}
              <span className="font-semibold">{title}</span>
              {count !== undefined && (
                <span className="rounded-full bg-white/50 px-2 py-1 text-xs font-medium">
                  {count}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </div>
    );
  }
);
RecipeSection.displayName = 'RecipeSection';

/**
 * Recipe ingredients list props interface
 */
export interface RecipeIngredientsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ingredients: Array<{
    id: string;
    name: string;
    amount?: string;
    unit?: string;
    notes?: string;
    optional?: boolean;
    category?: string;
  }>;
  showCheckboxes?: boolean;
  checkedItems?: string[];
  onItemCheck?: (itemId: string, checked: boolean) => void;
  layout?: 'compact' | 'default' | 'spacious';
}

/**
 * Recipe ingredients list component
 */
const RecipeIngredients = React.forwardRef<
  HTMLDivElement,
  RecipeIngredientsProps
>(
  (
    {
      className,
      ingredients,
      showCheckboxes = false,
      checkedItems = [],
      onItemCheck,
      layout = 'default',
      ...props
    },
    ref
  ) => {
    const handleCheckChange = (itemId: string, checked: boolean) => {
      onItemCheck?.(itemId, checked);
    };

    const groupedIngredients = React.useMemo(() => {
      const groups = new Map<string, typeof ingredients>();
      ingredients.forEach(ingredient => {
        const category = ingredient.category ?? 'main';
        if (!groups.has(category)) {
          groups.set(category, []);
        }
        groups.get(category)!.push(ingredient);
      });
      return Object.fromEntries(groups);
    }, [ingredients]);

    return (
      <div
        ref={ref}
        className={cn(
          recipeListVariants({ type: 'ingredients', layout }),
          className
        )}
        {...props}
      >
        {Object.entries(groupedIngredients).map(
          ([category, categoryIngredients]) => (
            <div key={category} className="space-y-2">
              {category !== 'main' && (
                <h4 className="text-sm font-medium tracking-wide text-gray-900 uppercase">
                  {category}
                </h4>
              )}
              {categoryIngredients.map(ingredient => {
                const isChecked = checkedItems.includes(ingredient.id);
                const displayAmount =
                  ingredient.amount && ingredient.unit
                    ? `${ingredient.amount} ${ingredient.unit}`
                    : (ingredient.amount ?? '');

                return (
                  <div
                    key={ingredient.id}
                    className={cn(
                      recipeListItemVariants({
                        type: 'ingredients',
                        state: isChecked ? 'checked' : 'default',
                      })
                    )}
                  >
                    {showCheckboxes && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e =>
                          handleCheckChange(ingredient.id, e.target.checked)
                        }
                        className={cn(ingredientCheckboxVariants())}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        {displayAmount && (
                          <span className="font-medium text-gray-900">
                            {displayAmount}
                          </span>
                        )}
                        <span
                          className={cn(
                            'text-gray-700',
                            ingredient.optional && 'italic'
                          )}
                        >
                          {ingredient.name}
                          {ingredient.optional && ' (optional)'}
                        </span>
                      </div>
                      {ingredient.notes && (
                        <p className="mt-1 text-sm text-gray-500">
                          {ingredient.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    );
  }
);
RecipeIngredients.displayName = 'RecipeIngredients';

/**
 * Recipe instructions list props interface
 */
export interface RecipeInstructionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  instructions: Array<{
    id: string;
    step: number;
    text: string;
    notes?: string;
    time?: string;
    temperature?: string;
  }>;
  currentStep?: number;
  onStepClick?: (stepNumber: number) => void;
  layout?: 'compact' | 'default' | 'spacious';
  showStepNumbers?: boolean;
}

/**
 * Recipe instructions list component
 */
const RecipeInstructions = React.forwardRef<
  HTMLDivElement,
  RecipeInstructionsProps
>(
  (
    {
      className,
      instructions,
      currentStep,
      onStepClick,
      layout = 'default',
      showStepNumbers = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          recipeListVariants({ type: 'instructions', layout }),
          className
        )}
        {...props}
      >
        {instructions.map(instruction => {
          const isActive = currentStep === instruction.step;
          const isCompleted =
            currentStep !== undefined && instruction.step < currentStep;

          return (
            <div
              key={instruction.id}
              className={cn(
                recipeListItemVariants({
                  type: 'instructions',
                  state: isActive ? 'highlighted' : 'default',
                })
              )}
            >
              {showStepNumbers && (
                <div
                  className={cn(
                    recipeStepNumberVariants({
                      variant: 'default',
                      state: isCompleted
                        ? 'completed'
                        : isActive
                          ? 'active'
                          : 'default',
                    })
                  )}
                  onClick={
                    onStepClick
                      ? () => onStepClick(instruction.step)
                      : undefined
                  }
                  onKeyDown={
                    onStepClick
                      ? e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onStepClick(instruction.step);
                          }
                        }
                      : undefined
                  }
                  role={onStepClick ? 'button' : undefined}
                  tabIndex={onStepClick ? 0 : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    instruction.step
                  )}
                </div>
              )}
              <div className="flex-1">
                <p className="leading-relaxed text-gray-700">
                  {instruction.text}
                </p>
                {(instruction.time ?? instruction.temperature) && (
                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    {instruction.time && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {instruction.time}
                      </span>
                    )}
                    {instruction.temperature && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                        </svg>
                        {instruction.temperature}
                      </span>
                    )}
                  </div>
                )}
                {instruction.notes && (
                  <p className="mt-2 text-sm text-blue-600 italic">
                    💡 {instruction.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);
RecipeInstructions.displayName = 'RecipeInstructions';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  RecipeSection,
  RecipeIngredients,
  RecipeInstructions,
};
