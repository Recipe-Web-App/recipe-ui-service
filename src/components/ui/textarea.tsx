import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  textareaVariants,
  textareaLabelVariants,
  textareaHelperVariants,
  recipeTextareaVariants,
  characterCounterVariants,
  textareaContainerVariants,
} from '@/lib/ui/textarea-variants';
import {
  type TextareaProps,
  type RecipeTextareaProps,
  type AutoTextareaProps,
} from '@/types/ui/textarea';

/**
 * Base textarea component
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      resize,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      required = false,
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      (value ?? defaultValue ?? '') as string
    );
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    const currentValue = value ?? internalValue;
    const characterCount = String(currentValue).length;

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [currentValue, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        return; // Prevent typing beyond max length
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(e);
    };

    // Determine variant based on state
    const getVariant = () => {
      if (errorMessage) return 'destructive';
      if (successMessage) return 'success';
      if (warningMessage) return 'warning';
      return variant;
    };

    // Get helper text based on state
    const getHelperText = () => {
      return errorMessage ?? successMessage ?? warningMessage ?? helperText;
    };

    // Get helper text variant based on state
    const getHelperVariant = () => {
      if (errorMessage) return 'error';
      if (successMessage) return 'success';
      if (warningMessage) return 'warning';
      return 'default';
    };

    // Get character counter state
    const getCounterState = () => {
      if (!maxLength) return 'default';
      const percentage = (characterCount / maxLength) * 100;
      if (percentage >= 100) return 'error';
      if (percentage >= 90) return 'warning';
      if (percentage >= 80) return 'success';
      return 'default';
    };

    const textareaId = React.useId();
    const helperId = React.useId();

    return (
      <div className={cn(textareaContainerVariants())}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(textareaLabelVariants({ size, required, disabled }))}
          >
            {label}
          </label>
        )}

        <textarea
          ref={textareaRef}
          id={textareaId}
          className={cn(
            textareaVariants({
              variant: getVariant(),
              size,
              resize: autoResize ? 'none' : resize,
            }),
            className
          )}
          disabled={disabled}
          value={currentValue}
          maxLength={maxLength}
          onChange={handleChange}
          aria-describedby={getHelperText() ? helperId : undefined}
          aria-invalid={!!errorMessage}
          aria-required={required}
          {...props}
        />

        <div className="flex items-center justify-between">
          {getHelperText() && (
            <span
              id={helperId}
              className={cn(
                textareaHelperVariants({ variant: getHelperVariant() })
              )}
            >
              {getHelperText()}
            </span>
          )}

          {(showCharacterCount || maxLength) && (
            <span
              className={cn(
                characterCounterVariants({ state: getCounterState() }),
                'ml-auto'
              )}
            >
              {characterCount}
              {maxLength && ` / ${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/**
 * Recipe-specific textarea component with enhanced features
 */
const RecipeTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RecipeTextareaProps
>(
  (
    {
      className,
      type,
      state,
      label,
      helperText,
      errorMessage,
      successMessage,
      required = false,
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      minWords,
      maxWords,
      showWordCount = false,
      disabled,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      (value ?? defaultValue ?? '') as string
    );
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    const currentValue = value ?? internalValue;
    const characterCount = String(currentValue).length;
    const wordCount = String(currentValue)
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [currentValue, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        return;
      }

      const newWordCount = newValue
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;

      if (maxWords && newWordCount > maxWords) {
        return;
      }

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(e);
    };

    // Determine state based on validation
    const getState = () => {
      if (errorMessage) return 'error';
      if (successMessage) return 'success';
      if (minWords && wordCount < minWords) return 'error';
      if (maxWords && wordCount > maxWords) return 'error';
      return state;
    };

    // Get helper text based on state and validation
    const getHelperText = () => {
      if (errorMessage) return errorMessage;
      if (successMessage) return successMessage;
      if (minWords && wordCount < minWords) {
        return `Minimum ${minWords} words required (${wordCount} written)`;
      }
      if (maxWords && wordCount > maxWords) {
        return `Maximum ${maxWords} words allowed (${wordCount} written)`;
      }
      return helperText;
    };

    // Get placeholder text based on type
    const getPlaceholder = () => {
      if (props.placeholder) return props.placeholder;

      switch (type) {
        case 'description':
          return 'Describe your recipe... What makes it special? What inspired you to create it?';
        case 'instructions':
          return 'Write step-by-step instructions... Be clear and detailed to help others succeed.';
        case 'notes':
          return 'Add any helpful notes... Tips, substitutions, or personal observations.';
        case 'tips':
          return 'Share your cooking tips... What tricks make this recipe better?';
        case 'review':
          return 'Share your experience... How did it turn out? Any modifications you made?';
        default:
          return 'Enter your text here...';
      }
    };

    const textareaId = React.useId();
    const helperId = React.useId();

    return (
      <div className={cn(textareaContainerVariants())}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(textareaLabelVariants({ required, disabled }))}
          >
            {label}
          </label>
        )}

        <textarea
          ref={textareaRef}
          id={textareaId}
          className={cn(
            recipeTextareaVariants({ type, state: getState() }),
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          disabled={disabled}
          value={currentValue}
          maxLength={maxLength}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          aria-describedby={getHelperText() ? helperId : undefined}
          aria-invalid={getState() === 'error'}
          aria-required={required}
          {...props}
        />

        <div className="flex items-center justify-between">
          {getHelperText() && (
            <span
              id={helperId}
              className={cn(
                textareaHelperVariants({
                  variant:
                    getState() === 'error'
                      ? 'error'
                      : getState() === 'success'
                        ? 'success'
                        : 'default',
                })
              )}
            >
              {getHelperText()}
            </span>
          )}

          <div className="ml-auto flex gap-4">
            {showWordCount && (
              <span
                className={cn(
                  characterCounterVariants({
                    state:
                      (minWords && wordCount < minWords) ||
                      (maxWords && wordCount > maxWords)
                        ? 'error'
                        : 'default',
                  })
                )}
              >
                {wordCount} word{wordCount !== 1 ? 's' : ''}
                {maxWords && ` / ${maxWords}`}
              </span>
            )}

            {(showCharacterCount || maxLength) && (
              <span
                className={cn(
                  characterCounterVariants({
                    state:
                      maxLength && characterCount > maxLength * 0.9
                        ? 'warning'
                        : 'default',
                  })
                )}
              >
                {characterCount}
                {maxLength && ` / ${maxLength}`}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
RecipeTextarea.displayName = 'RecipeTextarea';

/**
 * Auto-expanding textarea component
 */

const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(
  (
    {
      className,
      minRows = 3,
      maxRows = 10,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      (value ?? defaultValue ?? '') as string
    );
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    const currentValue = value ?? internalValue;

    const updateHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to measure scrollHeight accurately
      textarea.style.height = 'auto';

      // Calculate number of rows based on scrollHeight
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const rows = Math.max(
        minRows,
        Math.min(maxRows, Math.ceil(textarea.scrollHeight / lineHeight))
      );

      textarea.style.height = `${rows * lineHeight}px`;
    }, [minRows, maxRows]);

    React.useEffect(() => {
      updateHeight();
    }, [currentValue, updateHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(e);

      // Update height after state change
      requestAnimationFrame(updateHeight);
    };

    return (
      <Textarea
        ref={textareaRef}
        className={cn('resize-none overflow-hidden', className)}
        value={currentValue}
        onChange={handleChange}
        autoResize={true}
        {...props}
      />
    );
  }
);
AutoTextarea.displayName = 'AutoTextarea';

export { Textarea, RecipeTextarea, AutoTextarea };
export type { TextareaProps, RecipeTextareaProps, AutoTextareaProps };
