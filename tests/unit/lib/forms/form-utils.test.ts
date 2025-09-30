import { renderHook, act } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  getFieldError,
  hasFieldError,
  getFieldValue,
  isFieldDirty,
  isFieldTouched,
  getFormFieldProps,
} from '@/lib/forms/form-utils';

describe('Form Utils', () => {
  const mockFormData = {
    name: 'test',
    email: 'test@example.com',
    age: 25,
  };

  describe('getFieldError', () => {
    it('should return error message when field has error', () => {
      // Mock form with error state
      const mockForm = {
        formState: {
          errors: {
            name: {
              message: 'Name is required',
              type: 'required',
            },
          },
        },
      } as any;

      const error = getFieldError(mockForm, 'name');
      expect(error).toBe('Name is required');
    });

    it('should return undefined when field has no error', () => {
      // Mock form without errors
      const mockForm = {
        formState: {
          errors: {},
        },
      } as any;

      const error = getFieldError(mockForm, 'name');
      expect(error).toBeUndefined();
    });
  });

  describe('hasFieldError', () => {
    it('should return true when field has error', () => {
      // Mock form with error state
      const mockForm = {
        formState: {
          errors: {
            name: {
              message: 'Name is required',
              type: 'required',
            },
          },
        },
      } as any;

      const hasError = hasFieldError(mockForm, 'name');
      expect(hasError).toBe(true);
    });

    it('should return false when field has no error', () => {
      // Mock form without errors
      const mockForm = {
        formState: {
          errors: {},
        },
      } as any;

      const hasError = hasFieldError(mockForm, 'name');
      expect(hasError).toBe(false);
    });
  });

  describe('getFieldValue', () => {
    it('should return current field value', () => {
      const { result } = renderHook(() =>
        useForm({
          defaultValues: mockFormData,
          mode: 'onChange',
        })
      );

      const value = getFieldValue(result.current, 'name');
      expect(value).toBe('test');
    });

    it('should return updated value after setValue', () => {
      const { result } = renderHook(() =>
        useForm({
          defaultValues: mockFormData,
          mode: 'onChange',
        })
      );

      result.current.setValue('name', 'updated');
      const value = getFieldValue(result.current, 'name');
      expect(value).toBe('updated');
    });
  });

  describe('isFieldDirty', () => {
    it('should return false for untouched field', () => {
      // Mock form with no dirty fields
      const mockForm = {
        formState: {
          dirtyFields: {},
        },
      } as any;

      const isDirty = isFieldDirty(mockForm, 'name');
      expect(isDirty).toBe(false);
    });

    it('should return true for modified field', () => {
      // Mock form with dirty field
      const mockForm = {
        formState: {
          dirtyFields: {
            name: true,
          },
        },
      } as any;

      const isDirty = isFieldDirty(mockForm, 'name');
      expect(isDirty).toBe(true);
    });
  });

  describe('isFieldTouched', () => {
    it('should return false for untouched field', () => {
      // Mock form with no touched fields
      const mockForm = {
        formState: {
          touchedFields: {},
        },
      } as any;

      const isTouched = isFieldTouched(mockForm, 'name');
      expect(isTouched).toBe(false);
    });

    it('should return true for touched field', () => {
      // Mock form with touched field
      const mockForm = {
        formState: {
          touchedFields: {
            name: true,
          },
        },
      } as any;

      const isTouched = isFieldTouched(mockForm, 'name');
      expect(isTouched).toBe(true);
    });
  });

  describe('getFormFieldProps', () => {
    it('should return correct props for field without error', () => {
      const { result } = renderHook(() =>
        useForm({
          defaultValues: mockFormData,
          mode: 'onChange',
        })
      );

      const props = getFormFieldProps(result.current, 'name', {
        required: true,
        disabled: false,
        loading: false,
      });

      expect(props).toEqual({
        error: undefined,
        required: true,
        disabled: false,
        loading: false,
      });
    });

    it('should return correct props for field with error', () => {
      // Mock form with error state
      const mockForm = {
        formState: {
          errors: {
            name: {
              message: 'Name is required',
              type: 'required',
            },
          },
          isSubmitting: false,
        },
      } as any;

      const props = getFormFieldProps(mockForm, 'name', {
        required: true,
        disabled: false,
        loading: false,
      });

      expect(props).toEqual({
        error: 'Name is required',
        required: true,
        disabled: false,
        loading: false,
      });
    });

    it('should disable field when form is submitting', () => {
      const { result } = renderHook(() =>
        useForm({
          defaultValues: mockFormData,
          mode: 'onChange',
        })
      );

      // Mock submitting state by overriding the form state
      const mockFormState = {
        ...result.current.formState,
        isSubmitting: true,
        errors: result.current.formState.errors || {},
      };

      const mockForm = {
        ...result.current,
        formState: mockFormState,
      };

      const props = getFormFieldProps(mockForm, 'name');

      expect(props.disabled).toBe(true);
      expect(props.loading).toBe(true);
    });

    it('should handle undefined options', () => {
      const { result } = renderHook(() =>
        useForm({
          defaultValues: mockFormData,
          mode: 'onChange',
        })
      );

      const props = getFormFieldProps(result.current, 'name');

      expect(props).toEqual({
        error: undefined,
        required: undefined,
        disabled: false,
        loading: false,
      });
    });
  });
});
