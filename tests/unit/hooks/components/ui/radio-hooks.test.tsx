import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  RadioContext,
  RadioGroupContext,
  useRadioContext,
  useRadioGroupContext,
  useRadioGroupState,
  useRadioValidation,
  useRadioFocus,
  useRadioAccessibility,
  useRadioAnimation,
  useRadioSearch,
} from '@/hooks/components/ui/radio-hooks';
import type {
  RadioContextValue,
  RadioGroupContextValue,
} from '@/types/ui/radio';

describe('Radio Hooks', () => {
  describe('useRadioContext', () => {
    it('returns context value when used within RadioContext.Provider', () => {
      const mockContextValue: RadioContextValue = {
        value: 'test-value',
        onValueChange: jest.fn(),
        disabled: false,
        required: false,
        name: 'test-radio',
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={mockContextValue}>
          {children}
        </RadioContext.Provider>
      );

      const { result } = renderHook(() => useRadioContext(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.value).toBe('test-value');
      expect(result.current.disabled).toBe(false);
      expect(result.current.required).toBe(false);
      expect(typeof result.current.onValueChange).toBe('function');
    });

    it('throws error when used outside RadioContext.Provider', () => {
      // Suppress console.error for this test since we expect an error
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useRadioContext());
      }).toThrow(
        'Radio compound components must be used within a RadioGroupRoot'
      );

      console.error = originalError;
    });

    it('handles onValueChange function correctly', () => {
      const mockOnValueChange = jest.fn();
      const mockContextValue: RadioContextValue = {
        value: undefined,
        onValueChange: mockOnValueChange,
        disabled: false,
        required: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={mockContextValue}>
          {children}
        </RadioContext.Provider>
      );

      const { result } = renderHook(() => useRadioContext(), { wrapper });

      act(() => {
        result.current.onValueChange('new-value');
      });

      expect(mockOnValueChange).toHaveBeenCalledWith('new-value');
    });

    it('handles disabled state correctly', () => {
      const mockContextValue: RadioContextValue = {
        value: 'test-value',
        onValueChange: jest.fn(),
        disabled: true,
        required: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={mockContextValue}>
          {children}
        </RadioContext.Provider>
      );

      const { result } = renderHook(() => useRadioContext(), { wrapper });

      expect(result.current.disabled).toBe(true);
    });

    it('handles required state correctly', () => {
      const mockContextValue: RadioContextValue = {
        value: undefined,
        onValueChange: jest.fn(),
        disabled: false,
        required: true,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={mockContextValue}>
          {children}
        </RadioContext.Provider>
      );

      const { result } = renderHook(() => useRadioContext(), { wrapper });

      expect(result.current.required).toBe(true);
    });
  });

  describe('useRadioGroupContext', () => {
    it('returns context value when used within RadioGroupContext.Provider', () => {
      const mockContextValue: RadioGroupContextValue = {
        value: 'selected-value',
        setValue: jest.fn(),
        clearSelection: jest.fn(),
        disabled: false,
        required: false,
        name: 'test-group',
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioGroupContext.Provider value={mockContextValue}>
          {children}
        </RadioGroupContext.Provider>
      );

      const { result } = renderHook(() => useRadioGroupContext(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.value).toBe('selected-value');
      expect(typeof result.current.setValue).toBe('function');
      expect(typeof result.current.clearSelection).toBe('function');
    });

    it('throws error when used outside RadioGroupContext.Provider', () => {
      // Suppress console.error for this test since we expect an error
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useRadioGroupContext());
      }).toThrow('RadioGroupContext must be used within a RadioGroup');

      console.error = originalError;
    });

    it('handles setValue function correctly', () => {
      const mockSetValue = jest.fn();
      const mockContextValue: RadioGroupContextValue = {
        value: undefined,
        setValue: mockSetValue,
        clearSelection: jest.fn(),
        disabled: false,
        required: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioGroupContext.Provider value={mockContextValue}>
          {children}
        </RadioGroupContext.Provider>
      );

      const { result } = renderHook(() => useRadioGroupContext(), { wrapper });

      act(() => {
        result.current.setValue('new-value');
      });

      expect(mockSetValue).toHaveBeenCalledWith('new-value');
    });

    it('handles clearSelection function correctly', () => {
      const mockClearSelection = jest.fn();
      const mockContextValue: RadioGroupContextValue = {
        value: 'selected-value',
        setValue: jest.fn(),
        clearSelection: mockClearSelection,
        disabled: false,
        required: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioGroupContext.Provider value={mockContextValue}>
          {children}
        </RadioGroupContext.Provider>
      );

      const { result } = renderHook(() => useRadioGroupContext(), { wrapper });

      act(() => {
        result.current.clearSelection();
      });

      expect(mockClearSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('useRadioGroupState', () => {
    it('manages uncontrolled state correctly', () => {
      const { result } = renderHook(() =>
        useRadioGroupState(undefined, 'default-value')
      );

      expect(result.current.value).toBe('default-value');

      act(() => {
        result.current.setValue('new-value');
      });

      expect(result.current.value).toBe('new-value');
    });

    it('handles controlled state correctly', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() =>
        useRadioGroupState('controlled-value', undefined, onValueChange)
      );

      expect(result.current.value).toBe('controlled-value');

      act(() => {
        result.current.setValue('new-value');
      });

      expect(onValueChange).toHaveBeenCalledWith('new-value');
      // Value should remain controlled
      expect(result.current.value).toBe('controlled-value');
    });

    it('calls onValueChange when provided', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() =>
        useRadioGroupState(undefined, 'default', onValueChange)
      );

      act(() => {
        result.current.setValue('new-value');
      });

      expect(onValueChange).toHaveBeenCalledWith('new-value');
    });

    it('updates from controlled to uncontrolled correctly', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value?: string }) => useRadioGroupState(value, 'default'),
        { initialProps: { value: 'controlled' as string | undefined } }
      );

      expect(result.current.value).toBe('controlled');

      rerender({ value: undefined });

      act(() => {
        result.current.setValue('uncontrolled-value');
      });

      expect(result.current.value).toBe('uncontrolled-value');
    });
  });

  describe('useRadioValidation', () => {
    it('validates required field correctly', () => {
      const { result } = renderHook(() => useRadioValidation(undefined, true));

      act(() => {
        result.current.markTouched();
      });

      expect(result.current.error).toBe('This field is required');
      expect(result.current.isValid).toBe(false);
    });

    it('handles custom validator correctly', () => {
      const validator = jest.fn().mockReturnValue('Custom error');
      const { result } = renderHook(() =>
        useRadioValidation('test-value', false, validator)
      );

      act(() => {
        result.current.markTouched();
      });

      expect(validator).toHaveBeenCalledWith('test-value');
      expect(result.current.error).toBe('Custom error');
      expect(result.current.isValid).toBe(false);
    });

    it('validates successfully when conditions are met', () => {
      const { result } = renderHook(() =>
        useRadioValidation('valid-value', true)
      );

      act(() => {
        result.current.markTouched();
      });

      expect(result.current.error).toBeUndefined();
      expect(result.current.isValid).toBe(true);
    });

    it('clears error correctly', () => {
      const { result } = renderHook(() => useRadioValidation(undefined, true));

      act(() => {
        result.current.markTouched();
      });

      expect(result.current.error).toBe('This field is required');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeUndefined();
    });

    it('validates programmatically', () => {
      const { result } = renderHook(() =>
        useRadioValidation('test-value', true)
      );

      let isValid: boolean | undefined;
      act(() => {
        isValid = result.current.validate();
      });

      expect(isValid!).toBe(true);
      expect(result.current.isValid).toBe(true);
    });
  });

  describe('useRadioFocus', () => {
    const mockOptions = [
      { id: 'option1', value: 'value1', disabled: false },
      { id: 'option2', value: 'value2', disabled: false },
      { id: 'option3', value: 'value3', disabled: true },
      { id: 'option4', value: 'value4', disabled: false },
    ];

    it('sets initial focus correctly', () => {
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value2'));

      expect(result.current.focusedIndex).toBe(1);
    });

    it('moves focus to next enabled option', () => {
      const { result } = renderHook(() => useRadioFocus(mockOptions));

      act(() => {
        result.current.moveFocus('next');
      });

      expect(result.current.focusedIndex).toBe(1);
    });

    it('moves focus to previous enabled option', () => {
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value4'));

      act(() => {
        result.current.moveFocus('previous');
      });

      expect(result.current.focusedIndex).toBe(1); // Skips disabled option3
    });

    it('wraps focus correctly', () => {
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value4'));

      act(() => {
        result.current.moveFocus('next');
      });

      expect(result.current.focusedIndex).toBe(0); // Wraps to first enabled option
    });

    it('handles keyboard events correctly', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value1'));

      const mockEvent = {
        key: 'ArrowDown',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, onValueChange);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.focusedIndex).toBe(1);
    });

    it('handles space key selection', () => {
      const onValueChange = jest.fn();
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value1'));

      const mockEvent = {
        key: ' ',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent;

      act(() => {
        result.current.handleKeyDown(mockEvent, onValueChange);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalledWith('value1');
    });

    it('skips disabled options in navigation', () => {
      const { result } = renderHook(() => useRadioFocus(mockOptions, 'value2'));

      act(() => {
        result.current.moveFocus('next');
      });

      expect(result.current.focusedIndex).toBe(3); // Skips disabled option3
    });
  });

  describe('useRadioAccessibility', () => {
    it('generates correct accessibility attributes', () => {
      const { result } = renderHook(() =>
        useRadioAccessibility(
          'test-value',
          true,
          'Error message',
          'description-id'
        )
      );

      expect(result.current['aria-invalid']).toBe(true);
      expect(result.current['aria-required']).toBe(true);
      expect(result.current['aria-describedby']).toContain('description-id');
      expect(result.current.errorId).toBeDefined();
    });

    it('handles no error state correctly', () => {
      const { result } = renderHook(() =>
        useRadioAccessibility('test-value', false)
      );

      expect(result.current['aria-invalid']).toBe(false);
      expect(result.current['aria-required']).toBe(false);
      expect(result.current.errorId).toBeUndefined();
    });

    it('combines describedBy IDs correctly', () => {
      const { result } = renderHook(() =>
        useRadioAccessibility('test-value', false, 'Error', 'helper-id')
      );

      const describedBy = result.current['aria-describedby'];
      expect(describedBy).toContain('helper-id');
      expect(describedBy?.split(' ')).toHaveLength(2);
    });
  });

  describe('useRadioAnimation', () => {
    it('handles animation trigger correctly', () => {
      const { result } = renderHook(() => useRadioAnimation('scale', 100));

      expect(result.current.isAnimating).toBe(false);

      act(() => {
        result.current.triggerAnimation();
      });

      expect(result.current.isAnimating).toBe(true);
    });

    it('resets animation state after duration', async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() => useRadioAnimation('bounce', 100));

      act(() => {
        result.current.triggerAnimation();
      });

      expect(result.current.isAnimating).toBe(true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current.isAnimating).toBe(false);

      jest.useRealTimers();
    });

    it('handles no animation correctly', () => {
      const { result } = renderHook(() => useRadioAnimation('none'));

      act(() => {
        result.current.triggerAnimation();
      });

      expect(result.current.isAnimating).toBe(false);
    });

    it('returns correct animation classes', () => {
      const { result } = renderHook(() => useRadioAnimation('pulse'));

      act(() => {
        result.current.triggerAnimation();
      });

      expect(result.current.animationClasses).toBe('animate-pulse');
    });
  });

  describe('useRadioSearch', () => {
    const mockOptions = [
      { label: 'Italian Cuisine', value: 'italian' },
      { label: 'Mexican Food', value: 'mexican' },
      { label: 'Asian Fusion', value: 'asian' },
      { label: 'Mediterranean', value: 'mediterranean' },
    ];

    it('filters options correctly', () => {
      const { result } = renderHook(() =>
        useRadioSearch(mockOptions, 'italian')
      );

      expect(result.current.filteredOptions).toHaveLength(1);
      expect(result.current.filteredOptions[0].value).toBe('italian');
      expect(result.current.hasResults).toBe(true);
    });

    it('handles case-insensitive search', () => {
      const { result } = renderHook(() =>
        useRadioSearch(mockOptions, 'MEXICAN')
      );

      expect(result.current.filteredOptions).toHaveLength(1);
      expect(result.current.filteredOptions[0].value).toBe('mexican');
    });

    it('searches in both label and value', () => {
      const { result } = renderHook(() => useRadioSearch(mockOptions, 'food'));

      expect(result.current.filteredOptions).toHaveLength(1);
      expect(result.current.filteredOptions[0].value).toBe('mexican');
    });

    it('returns all options when search term is empty', () => {
      const { result } = renderHook(() => useRadioSearch(mockOptions, ''));

      expect(result.current.filteredOptions).toHaveLength(4);
      expect(result.current.hasResults).toBe(true);
    });

    it('handles no results correctly', () => {
      const { result } = renderHook(() => useRadioSearch(mockOptions, 'xyz'));

      expect(result.current.filteredOptions).toHaveLength(0);
      expect(result.current.hasResults).toBe(false);
    });

    it('highlights text correctly', () => {
      const { result } = renderHook(() =>
        useRadioSearch(mockOptions, 'italian')
      );

      const highlighted = result.current.highlightText('Italian Cuisine');
      expect(Array.isArray(highlighted)).toBe(true);
    });

    it('handles search term with special characters safely', () => {
      const { result } = renderHook(() =>
        useRadioSearch(mockOptions, 'med+iter')
      );

      // Should not throw error and should handle escaped regex
      expect(() => result.current.filteredOptions).not.toThrow();
      expect(result.current.filteredOptions).toHaveLength(0);
    });

    it('updates when search term changes', () => {
      const { result, rerender } = renderHook(
        ({ searchTerm }) => useRadioSearch(mockOptions, searchTerm),
        { initialProps: { searchTerm: 'italian' } }
      );

      expect(result.current.filteredOptions).toHaveLength(1);

      rerender({ searchTerm: 'asian' });

      expect(result.current.filteredOptions).toHaveLength(1);
      expect(result.current.filteredOptions[0].value).toBe('asian');
    });
  });

  describe('Context Integration', () => {
    it('RadioContext and RadioGroupContext work independently', () => {
      const radioContextValue: RadioContextValue = {
        value: 'radio-value',
        onValueChange: jest.fn(),
        disabled: false,
        required: false,
      };

      const groupContextValue: RadioGroupContextValue = {
        value: 'group-value',
        setValue: jest.fn(),
        clearSelection: jest.fn(),
        disabled: false,
        required: false,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={radioContextValue}>
          <RadioGroupContext.Provider value={groupContextValue}>
            {children}
          </RadioGroupContext.Provider>
        </RadioContext.Provider>
      );

      const { result: radioResult } = renderHook(() => useRadioContext(), {
        wrapper,
      });
      const { result: groupResult } = renderHook(() => useRadioGroupContext(), {
        wrapper,
      });

      expect(radioResult.current).toBe(radioContextValue);
      expect(groupResult.current).toBe(groupContextValue);
    });

    it('nested context providers work correctly', () => {
      const outerRadioValue: RadioContextValue = {
        value: 'outer-value',
        onValueChange: jest.fn(),
        disabled: false,
        required: false,
      };

      const innerRadioValue: RadioContextValue = {
        value: 'inner-value',
        onValueChange: jest.fn(),
        disabled: true,
        required: true,
      };

      const OuterWrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={outerRadioValue}>
          {children}
        </RadioContext.Provider>
      );

      const InnerWrapper = ({ children }: { children: React.ReactNode }) => (
        <RadioContext.Provider value={innerRadioValue}>
          {children}
        </RadioContext.Provider>
      );

      // Test outer context
      const { result: outerResult } = renderHook(() => useRadioContext(), {
        wrapper: OuterWrapper,
      });

      expect(outerResult.current.value).toBe('outer-value');
      expect(outerResult.current.disabled).toBe(false);

      // Test inner context (should override outer)
      const { result: innerResult } = renderHook(() => useRadioContext(), {
        wrapper: ({ children }) => (
          <OuterWrapper>
            <InnerWrapper>{children}</InnerWrapper>
          </OuterWrapper>
        ),
      });

      expect(innerResult.current.value).toBe('inner-value');
      expect(innerResult.current.disabled).toBe(true);
      expect(innerResult.current.required).toBe(true);
    });
  });
});
