import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import {
  copyButtonVariants,
  copyIconVariants,
} from '@/lib/ui/copy-button-variants';
import { Icon } from './icon';
import { useCopyButton } from '@/hooks/components/ui/copy-button-hooks';
import type {
  CopyButtonProps,
  CopyButtonGroupProps,
  RecipeCopyButtonProps,
} from '@/types/ui/copy-button';

/**
 * Format recipe content for copying
 */
const formatRecipeContent = (
  recipe: RecipeCopyButtonProps['recipe'],
  copyType: RecipeCopyButtonProps['copyType']
): string => {
  const safeRecipe = {
    title: recipe.title ?? 'Untitled Recipe',
    url: recipe.url ?? '',
    ingredients: recipe.ingredients ?? [],
    instructions: recipe.instructions ?? [],
    nutrition: recipe.nutrition ?? {},
    metadata: recipe.metadata ?? {},
  };

  switch (copyType) {
    case 'recipe-url':
    case 'url':
      return safeRecipe.url || `Recipe: ${safeRecipe.title}`;

    case 'ingredients':
      if (!safeRecipe.ingredients.length) return 'No ingredients available';
      return safeRecipe.ingredients
        .map(ingredient => {
          const amount = ingredient.amount ? `${ingredient.amount} ` : '';
          const unit = ingredient.unit ? `${ingredient.unit} ` : '';
          return `${amount}${unit}${ingredient.name}`;
        })
        .join('\n');

    case 'instructions':
      if (!safeRecipe.instructions.length) return 'No instructions available';
      return safeRecipe.instructions
        .map(instruction => `${instruction.step}. ${instruction.instruction}`)
        .join('\n\n');

    case 'nutrition':
      if (!Object.keys(safeRecipe.nutrition).length)
        return 'No nutrition information available';
      return Object.entries(safeRecipe.nutrition)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    case 'formatted-recipe':
      const sections = [
        `# ${safeRecipe.title}`,
        safeRecipe.metadata.servings &&
          `Servings: ${safeRecipe.metadata.servings}`,
        safeRecipe.metadata.prepTime &&
          `Prep Time: ${safeRecipe.metadata.prepTime}`,
        safeRecipe.metadata.cookTime &&
          `Cook Time: ${safeRecipe.metadata.cookTime}`,
        safeRecipe.metadata.difficulty &&
          `Difficulty: ${safeRecipe.metadata.difficulty}`,
        '',
        '## Ingredients',
        safeRecipe.ingredients.length
          ? safeRecipe.ingredients
              .map(ingredient => {
                const amount = ingredient.amount ? `${ingredient.amount} ` : '';
                const unit = ingredient.unit ? `${ingredient.unit} ` : '';
                return `- ${amount}${unit}${ingredient.name}`;
              })
              .join('\n')
          : 'No ingredients available',
        '',
        '## Instructions',
        safeRecipe.instructions.length
          ? safeRecipe.instructions
              .map(
                instruction => `${instruction.step}. ${instruction.instruction}`
              )
              .join('\n\n')
          : 'No instructions available',
      ].filter(Boolean);

      return sections.join('\n');

    default:
      return safeRecipe.title;
  }
};

/**
 * CopyButton Component
 *
 * A flexible, accessible copy button component with visual feedback
 * and recipe-specific functionality.
 */
const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      content,
      variant,
      size,
      state: propState,
      animation: _animation,
      recipe: recipeVariant,
      children,
      icon = 'copy',
      successIcon = 'check',
      errorIcon = 'alert-circle',
      iconOnly = false,
      successMessage = 'Copied!',
      errorMessage = 'Failed to copy',
      onCopyStart,
      onCopySuccess,
      onCopyError,
      onStatusChange,
      copyLabel = 'Copy to clipboard',
      copyingLabel = 'Copying...',
      successLabel = 'Copied to clipboard',
      errorLabel = 'Failed to copy to clipboard',
      announceToScreenReader = true,
      resetDelay = 2000,
      maxLength,
      transformContent,
      asChild = false,
      loading = false,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const { copyToClipboard, status, isSupported } = useCopyButton();
    const [showFeedback, setShowFeedback] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Use prop state if provided, otherwise use hook state
    const currentStatus = propState ?? status;

    // Handle status changes
    React.useEffect(() => {
      if (onStatusChange) {
        onStatusChange(currentStatus);
      }
    }, [currentStatus, onStatusChange]);

    // Handle feedback timeout
    React.useEffect(() => {
      if (currentStatus === 'success' || currentStatus === 'error') {
        setShowFeedback(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setShowFeedback(false);
        }, resetDelay);
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [currentStatus, resetDelay]);

    // Screen reader announcements
    React.useEffect(() => {
      if (!announceToScreenReader) return;

      let message = '';
      switch (currentStatus) {
        case 'copying':
          message = copyingLabel;
          break;
        case 'success':
          message = successLabel;
          break;
        case 'error':
          message = errorLabel;
          break;
      }

      if (message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }
    }, [
      currentStatus,
      announceToScreenReader,
      copyingLabel,
      successLabel,
      errorLabel,
    ]);

    const handleCopy = React.useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (disabled || loading || currentStatus === 'copying') {
          return;
        }

        onCopyStart?.();

        try {
          let contentToCopy: string;

          if (typeof content === 'function') {
            const result = content();
            contentToCopy = result instanceof Promise ? await result : result;
          } else {
            contentToCopy = content;
          }

          // Apply transformations
          if (transformContent) {
            contentToCopy = transformContent(contentToCopy);
          }

          // Apply max length limit
          if (maxLength && contentToCopy.length > maxLength) {
            contentToCopy = contentToCopy.substring(0, maxLength);
          }

          const result = await copyToClipboard(contentToCopy);

          if (result.success) {
            onCopySuccess?.(contentToCopy);
          } else {
            onCopyError?.(result.error ?? new Error('Copy failed'));
          }
        } catch (err) {
          const error =
            err instanceof Error ? err : new Error('Copy operation failed');
          onCopyError?.(error);
        }

        // Call original onClick if provided
        onClick?.(event);
      },
      [
        content,
        transformContent,
        maxLength,
        copyToClipboard,
        onCopyStart,
        onCopySuccess,
        onCopyError,
        onClick,
        disabled,
        loading,
        currentStatus,
      ]
    );

    // Determine accessibility attributes
    const ariaLabel =
      currentStatus === 'copying'
        ? copyingLabel
        : currentStatus === 'success'
          ? successLabel
          : currentStatus === 'error'
            ? errorLabel
            : copyLabel;

    const isDisabled = Boolean(disabled) || Boolean(loading) || !isSupported;

    // Determine which icon to show
    const getCurrentIcon = () => {
      switch (currentStatus) {
        case 'copying':
          return 'loading';
        case 'success':
          return successIcon;
        case 'error':
          return errorIcon;
        default:
          return icon;
      }
    };

    const buttonContent = (
      <>
        {/* Main icon */}
        <Icon
          name={getCurrentIcon()}
          className={cn(
            copyIconVariants({ state: currentStatus }),
            currentStatus === 'copying' && 'animate-spin'
          )}
          aria-hidden={true}
        />

        {/* Text content */}
        {!iconOnly && (
          <span
            className={cn(
              'transition-opacity duration-200',
              (currentStatus === 'success' || currentStatus === 'error') &&
                showFeedback
                ? 'opacity-0'
                : 'opacity-100'
            )}
          >
            {children ?? 'Copy'}
          </span>
        )}

        {/* Success/Error feedback overlay */}
        {showFeedback &&
          (currentStatus === 'success' || currentStatus === 'error') && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5">
              <Icon
                name={currentStatus === 'success' ? successIcon : errorIcon}
                className={cn(
                  'shrink-0 transition-all duration-300',
                  currentStatus === 'success' ? 'text-inherit' : 'text-error'
                )}
                aria-hidden={true}
              />
              {!iconOnly && (
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    currentStatus === 'success' ? 'text-inherit' : 'text-error'
                  )}
                >
                  {currentStatus === 'success' ? successMessage : errorMessage}
                </span>
              )}
            </div>
          )}
      </>
    );

    if (asChild) {
      return (
        <Slot
          className={cn(
            copyButtonVariants({
              variant,
              size,
              state: currentStatus,
              recipe: recipeVariant,
            }),
            className
          )}
          ref={ref}
          aria-label={ariaLabel}
          aria-disabled={isDisabled}
          onClick={handleCopy}
          {...props}
        >
          {React.Children.only(children)}
        </Slot>
      );
    }

    return (
      <button
        className={cn(
          copyButtonVariants({
            variant,
            size,
            state: currentStatus,
            recipe: recipeVariant,
          }),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-label={ariaLabel}
        onClick={handleCopy}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';

/**
 * Recipe-specific CopyButton component
 */
const RecipeCopyButton = React.forwardRef<
  HTMLButtonElement,
  RecipeCopyButtonProps
>(({ recipe, copyType, ...props }, ref) => {
  const content = React.useMemo(
    () => formatRecipeContent(recipe, copyType),
    [recipe, copyType]
  );

  return (
    <CopyButton
      ref={ref}
      content={content}
      recipe={
        copyType === 'ingredients'
          ? 'ingredient'
          : copyType === 'instructions'
            ? 'instruction'
            : copyType === 'url' || copyType === 'recipe-url'
              ? 'url'
              : copyType === 'nutrition'
                ? 'nutrition'
                : 'none'
      }
      {...props}
    />
  );
});

RecipeCopyButton.displayName = 'RecipeCopyButton';

/**
 * CopyButton Group component for organizing multiple copy buttons
 */
const CopyButtonGroup = React.forwardRef<HTMLDivElement, CopyButtonGroupProps>(
  (
    {
      children,
      spacing = 'default',
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => {
    const getSpacingClass = (spacing: 'none' | 'sm' | 'default' | 'lg') => {
      switch (spacing) {
        case 'none':
          return 'gap-0';
        case 'sm':
          return 'gap-2';
        case 'default':
          return 'gap-3';
        case 'lg':
          return 'gap-4';
        default:
          return 'gap-3';
      }
    };

    const getOrientationClass = (orientation: 'horizontal' | 'vertical') => {
      switch (orientation) {
        case 'horizontal':
          return 'flex-row items-center';
        case 'vertical':
          return 'flex-col items-start';
        default:
          return 'flex-row items-center';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          getSpacingClass(spacing),
          getOrientationClass(orientation),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CopyButtonGroup.displayName = 'CopyButtonGroup';

// Compound component pattern
const CopyButtonCompound = Object.assign(CopyButton, {
  Recipe: RecipeCopyButton,
  Group: CopyButtonGroup,
});

export { CopyButtonCompound as CopyButton, RecipeCopyButton, CopyButtonGroup };
export type { CopyButtonProps, RecipeCopyButtonProps, CopyButtonGroupProps };
