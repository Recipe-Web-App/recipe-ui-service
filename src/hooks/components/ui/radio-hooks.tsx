import * as React from 'react';
import type {
  RadioContextValue,
  RadioGroupContextValue,
} from '@/types/ui/radio';

// Radio Context for compound components
export const RadioContext = React.createContext<RadioContextValue | null>(null);

// Radio Group Context for group state management
export const RadioGroupContext =
  React.createContext<RadioGroupContextValue | null>(null);

/**
 * Hook to access the radio context value
 * Must be used within a RadioGroupRoot component
 */
export const useRadioContext = (): RadioContextValue => {
  const context = React.useContext(RadioContext);
  if (!context) {
    throw new Error(
      'Radio compound components must be used within a RadioGroupRoot'
    );
  }
  return context;
};

/**
 * Hook to access the radio group context value
 * Must be used within a RadioGroup component
 */
export const useRadioGroupContext = (): RadioGroupContextValue => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupContext must be used within a RadioGroup');
  }
  return context;
};

/**
 * Hook for managing radio group state with controlled/uncontrolled support
 */
export const useRadioGroupState = (
  value?: string,
  defaultValue?: string,
  onValueChange?: (value: string) => void
) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue
  );

  // Determine if currently controlled (can change during component lifecycle)
  const isControlled = value !== undefined;

  // Use controlled value if provided, otherwise use internal state
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return {
    value: currentValue,
    setValue: handleValueChange,
  };
};

/**
 * Hook for managing radio validation state
 */
export const useRadioValidation = (
  value?: string,
  required?: boolean,
  validator?: (value: string) => string | undefined
) => {
  const [error, setError] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const validate = React.useCallback(
    (valueToValidate?: string) => {
      if (!touched && !valueToValidate) return;

      let validationError: string | undefined;

      // Required validation
      if (required && !valueToValidate) {
        validationError = 'This field is required';
      }

      // Custom validation
      if (!validationError && valueToValidate && validator) {
        validationError = validator(valueToValidate);
      }

      setError(validationError);
      return !validationError;
    },
    [required, validator, touched]
  );

  React.useEffect(() => {
    if (touched) {
      validate(value);
    }
  }, [value, validate, touched]);

  const markTouched = React.useCallback(() => {
    setTouched(true);
  }, []);

  const clearError = React.useCallback(() => {
    setError(undefined);
  }, []);

  return {
    error,
    touched,
    validate: () => validate(value),
    markTouched,
    clearError,
    isValid: !error,
  };
};

/**
 * Hook for managing radio focus state with keyboard navigation
 */
export const useRadioFocus = (
  options: Array<{ id: string; value: string; disabled?: boolean }>,
  currentValue?: string
) => {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

  // Find the index of the currently selected option
  const selectedIndex = React.useMemo(() => {
    return options.findIndex(option => option.value === currentValue);
  }, [options, currentValue]);

  // Set initial focus to selected option or first enabled option
  React.useEffect(() => {
    if (selectedIndex >= 0) {
      setFocusedIndex(selectedIndex);
    } else {
      const firstEnabledIndex = options.findIndex(option => !option.disabled);
      if (firstEnabledIndex >= 0) {
        setFocusedIndex(firstEnabledIndex);
      }
    }
  }, [selectedIndex, options]);

  const moveFocus = React.useCallback(
    (direction: 'next' | 'previous') => {
      const enabledOptions = options
        .map((option, index) => ({ ...option, originalIndex: index }))
        .filter(option => !option.disabled);

      if (enabledOptions.length === 0) return;

      const currentEnabledIndex = enabledOptions.findIndex(
        option => option.originalIndex === focusedIndex
      );

      let nextIndex: number;
      if (direction === 'next') {
        nextIndex =
          currentEnabledIndex >= enabledOptions.length - 1
            ? 0
            : currentEnabledIndex + 1;
      } else {
        nextIndex =
          currentEnabledIndex <= 0
            ? enabledOptions.length - 1
            : currentEnabledIndex - 1;
      }

      // Ensure nextIndex is valid before accessing
      if (nextIndex >= 0 && nextIndex < enabledOptions.length) {
        const option = enabledOptions.at(nextIndex);
        if (option) {
          setFocusedIndex(option.originalIndex);
        }
      }
    },
    [focusedIndex, options]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent, onValueChange?: (value: string) => void) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          moveFocus('next');
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          moveFocus('previous');
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            // Use array access with bounds check
            const focusedOption = options.at(focusedIndex);
            if (focusedOption && !focusedOption.disabled) {
              onValueChange?.(focusedOption.value);
            }
          }
          break;
      }
    },
    [focusedIndex, options, moveFocus]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    moveFocus,
  };
};

/**
 * Hook for managing radio accessibility attributes
 */
export const useRadioAccessibility = (
  value?: string,
  required?: boolean,
  error?: string,
  describedBy?: string
) => {
  const errorId = React.useId();
  const descriptionId = React.useId();

  const ariaDescribedBy = React.useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(errorId);
    if (describedBy) ids.push(describedBy);
    return ids.length > 0 ? ids.join(' ') : undefined;
  }, [error, errorId, describedBy]);

  return {
    'aria-invalid': !!error,
    'aria-required': required,
    'aria-describedby': ariaDescribedBy,
    errorId: error ? errorId : undefined,
    descriptionId,
  };
};

/**
 * Hook for managing radio group animations
 */
export const useRadioAnimation = (
  animation?: 'none' | 'scale' | 'bounce' | 'pulse' | 'glow',
  animationDuration = 200
) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const triggerAnimation = React.useCallback(() => {
    if (!animation || animation === 'none') return;

    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [animation, animationDuration]);

  return {
    isAnimating,
    triggerAnimation,
    animationClasses: isAnimating ? `animate-${animation}` : '',
  };
};

/**
 * Hook for managing radio option search/filtering
 */
export const useRadioSearch = <T extends { label: string; value: string }>(
  options: T[],
  searchTerm?: string
) => {
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return options;
    }

    const term = searchTerm.toLowerCase().trim();
    return options.filter(
      option =>
        option.label.toLowerCase().includes(term) ||
        option.value.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  const highlightText = React.useCallback(
    (text: string) => {
      if (!searchTerm || searchTerm.trim() === '') {
        return text;
      }

      // Escape special regex characters to prevent ReDoS attacks
      const escapedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      // eslint-disable-next-line security/detect-non-literal-regexp
      const regex = new RegExp(`(${escapedSearchTerm})`, 'gi'); // nosemgrep

      return text.split(regex).map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900">
            {part}
          </mark>
        ) : (
          part
        )
      );
    },
    [searchTerm]
  );

  return {
    filteredOptions,
    highlightText,
    hasResults: filteredOptions.length > 0,
  };
};
