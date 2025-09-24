import { renderHook, act } from '@testing-library/react';
import React from 'react';
import {
  CheckboxContext,
  CheckboxGroupContext,
  useCheckboxContext,
  useCheckboxGroupContext,
} from '@/hooks/components/ui/checkbox-hooks';
import type {
  CheckboxContextValue,
  CheckboxGroupContextValue,
} from '@/types/ui/checkbox';

describe('Checkbox Hooks', () => {
  describe('useCheckboxContext', () => {
    it('returns context value when used within CheckboxContext.Provider', () => {
      const mockContextValue: CheckboxContextValue = {
        checked: true,
        disabled: false,
        required: false,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={mockContextValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxContext(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.checked).toBe(true);
      expect(result.current.disabled).toBe(false);
      expect(result.current.required).toBe(false);
      expect(typeof result.current.toggle).toBe('function');
    });

    it('throws error when used outside CheckboxContext.Provider', () => {
      // Suppress console.error for this test since we expect an error
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useCheckboxContext());
      }).toThrow(
        'Checkbox compound components must be used within a CheckboxRoot'
      );

      console.error = originalError;
    });

    it('handles toggle function correctly', () => {
      const mockToggle = jest.fn();
      const mockContextValue: CheckboxContextValue = {
        checked: false,
        disabled: false,
        required: false,
        toggle: mockToggle,
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={mockContextValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxContext(), { wrapper });

      act(() => {
        result.current.toggle();
      });

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('handles disabled state correctly', () => {
      const mockContextValue: CheckboxContextValue = {
        checked: false,
        disabled: true,
        required: false,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={mockContextValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxContext(), { wrapper });

      expect(result.current.disabled).toBe(true);
      expect(result.current.checked).toBe(false);
    });

    it('handles required state correctly', () => {
      const mockContextValue: CheckboxContextValue = {
        checked: false,
        disabled: false,
        required: true,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={mockContextValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxContext(), { wrapper });

      expect(result.current.required).toBe(true);
    });

    it('provides correct input ref', () => {
      const mockInputRef = React.createRef<HTMLButtonElement>();
      const mockContextValue: CheckboxContextValue = {
        checked: false,
        disabled: false,
        required: false,
        toggle: jest.fn(),
        inputRef: mockInputRef,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={mockContextValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxContext(), { wrapper });

      expect(result.current.inputRef).toBe(mockInputRef);
    });
  });

  describe('useCheckboxGroupContext', () => {
    it('returns context value when used within CheckboxGroupContext.Provider', () => {
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: true, item2: false },
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: true,
        selectedCount: 1,
        totalCount: 2,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.values).toEqual({ item1: true, item2: false });
      expect(result.current.selectedCount).toBe(1);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(true);
    });

    it('throws error when used outside CheckboxGroupContext.Provider', () => {
      // Suppress console.error for this test since we expect an error
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useCheckboxGroupContext());
      }).toThrow(
        'CheckboxGroupContext must be used within a FilterCheckboxGroup'
      );

      console.error = originalError;
    });

    it('handles setValue function correctly', () => {
      const mockSetValue = jest.fn();
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: false, item2: false },
        setValue: mockSetValue,
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: false,
        selectedCount: 0,
        totalCount: 2,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      act(() => {
        result.current.setValue('item1', true);
      });

      expect(mockSetValue).toHaveBeenCalledWith('item1', true);
    });

    it('handles selectAll function correctly', () => {
      const mockSelectAll = jest.fn();
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: false, item2: false },
        setValue: jest.fn(),
        selectAll: mockSelectAll,
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: false,
        selectedCount: 0,
        totalCount: 2,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      act(() => {
        result.current.selectAll();
      });

      expect(mockSelectAll).toHaveBeenCalledTimes(1);
    });

    it('handles clearAll function correctly', () => {
      const mockClearAll = jest.fn();
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: true, item2: true },
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: mockClearAll,
        isAllSelected: true,
        isIndeterminate: false,
        selectedCount: 2,
        totalCount: 2,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      act(() => {
        result.current.clearAll();
      });

      expect(mockClearAll).toHaveBeenCalledTimes(1);
    });

    it('correctly calculates isAllSelected state', () => {
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: true, item2: true, item3: true },
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: true,
        isIndeterminate: false,
        selectedCount: 3,
        totalCount: 3,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      expect(result.current.isAllSelected).toBe(true);
      expect(result.current.isIndeterminate).toBe(false);
      expect(result.current.selectedCount).toBe(3);
      expect(result.current.totalCount).toBe(3);
    });

    it('correctly calculates isIndeterminate state', () => {
      const mockContextValue: CheckboxGroupContextValue = {
        values: { item1: true, item2: false, item3: false },
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: true,
        selectedCount: 1,
        totalCount: 3,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(true);
      expect(result.current.selectedCount).toBe(1);
      expect(result.current.totalCount).toBe(3);
    });

    it('handles empty values correctly', () => {
      const mockContextValue: CheckboxGroupContextValue = {
        values: {},
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: false,
        selectedCount: 0,
        totalCount: 0,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      expect(result.current.values).toEqual({});
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('handles large number of items correctly', () => {
      const values: Record<string, boolean> = {};
      for (let i = 1; i <= 100; i++) {
        values[`item${i}`] = i <= 50; // First 50 items selected
      }

      const mockContextValue: CheckboxGroupContextValue = {
        values,
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: false,
        isIndeterminate: true,
        selectedCount: 50,
        totalCount: 100,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxGroupContext.Provider value={mockContextValue}>
          {children}
        </CheckboxGroupContext.Provider>
      );

      const { result } = renderHook(() => useCheckboxGroupContext(), {
        wrapper,
      });

      expect(result.current.selectedCount).toBe(50);
      expect(result.current.totalCount).toBe(100);
      expect(result.current.isIndeterminate).toBe(true);
      expect(result.current.isAllSelected).toBe(false);
    });
  });

  describe('Context Integration', () => {
    it('CheckboxContext and CheckboxGroupContext work independently', () => {
      const checkboxContextValue: CheckboxContextValue = {
        checked: true,
        disabled: false,
        required: false,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const groupContextValue: CheckboxGroupContextValue = {
        values: { item1: true },
        setValue: jest.fn(),
        selectAll: jest.fn(),
        clearAll: jest.fn(),
        isAllSelected: true,
        isIndeterminate: false,
        selectedCount: 1,
        totalCount: 1,
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={checkboxContextValue}>
          <CheckboxGroupContext.Provider value={groupContextValue}>
            {children}
          </CheckboxGroupContext.Provider>
        </CheckboxContext.Provider>
      );

      const { result: checkboxResult } = renderHook(
        () => useCheckboxContext(),
        {
          wrapper,
        }
      );
      const { result: groupResult } = renderHook(
        () => useCheckboxGroupContext(),
        {
          wrapper,
        }
      );

      expect(checkboxResult.current).toBe(checkboxContextValue);
      expect(groupResult.current).toBe(groupContextValue);
    });

    it('nested context providers work correctly', () => {
      const outerCheckboxValue: CheckboxContextValue = {
        checked: false,
        disabled: false,
        required: false,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const innerCheckboxValue: CheckboxContextValue = {
        checked: true,
        disabled: true,
        required: true,
        toggle: jest.fn(),
        inputRef: React.createRef<HTMLButtonElement>(),
      };

      const OuterWrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={outerCheckboxValue}>
          {children}
        </CheckboxContext.Provider>
      );

      const InnerWrapper = ({ children }: { children: React.ReactNode }) => (
        <CheckboxContext.Provider value={innerCheckboxValue}>
          {children}
        </CheckboxContext.Provider>
      );

      // Test outer context
      const { result: outerResult } = renderHook(() => useCheckboxContext(), {
        wrapper: OuterWrapper,
      });

      expect(outerResult.current.checked).toBe(false);
      expect(outerResult.current.disabled).toBe(false);

      // Test inner context (should override outer)
      const { result: innerResult } = renderHook(() => useCheckboxContext(), {
        wrapper: ({ children }) => (
          <OuterWrapper>
            <InnerWrapper>{children}</InnerWrapper>
          </OuterWrapper>
        ),
      });

      expect(innerResult.current.checked).toBe(true);
      expect(innerResult.current.disabled).toBe(true);
      expect(innerResult.current.required).toBe(true);
    });
  });
});
