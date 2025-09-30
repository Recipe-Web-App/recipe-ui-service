import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Get field error message from react-hook-form
 */
export function getFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): string | undefined {
  const errors = form.formState.errors;
  if (!errors || typeof errors !== 'object') {
    return undefined;
  }

  const error = (errors as Record<string, unknown>)[name as string];
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return undefined;
}

/**
 * Check if field has error
 */
export function hasFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): boolean {
  const errors = form.formState.errors;
  if (!errors || typeof errors !== 'object') {
    return false;
  }

  return Boolean((errors as Record<string, unknown>)[name as string]);
}

/**
 * Get field value from react-hook-form
 */
export function getFieldValue<T extends FieldValues, K extends FieldPath<T>>(
  form: UseFormReturn<T>,
  name: K
): T[K] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return form.watch(name);
}

/**
 * Check if field is dirty (has been modified)
 */
export function isFieldDirty<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): boolean {
  const dirtyFields = form.formState.dirtyFields;
  if (!dirtyFields || typeof dirtyFields !== 'object') {
    return false;
  }

  return Boolean((dirtyFields as Record<string, unknown>)[name as string]);
}

/**
 * Check if field is touched (has been focused)
 */
export function isFieldTouched<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): boolean {
  const touchedFields = form.formState.touchedFields;
  if (!touchedFields || typeof touchedFields !== 'object') {
    return false;
  }

  return Boolean((touchedFields as Record<string, unknown>)[name as string]);
}

/**
 * Reset field to its default value
 */
export function resetField<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>
): void {
  form.resetField(name);
}

/**
 * Clear all form errors
 */
export function clearFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>
): void {
  form.clearErrors();
}

/**
 * Set form loading state (custom implementation)
 */
export function setFormLoading<T extends FieldValues>(
  form: UseFormReturn<T>,
  loading: boolean
): void {
  if (loading) {
    // Disable all form fields during loading
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.style.pointerEvents = loading ? 'none' : 'auto';
      formElement.style.opacity = loading ? '0.6' : '1';
    }
  } else {
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.style.pointerEvents = 'auto';
      formElement.style.opacity = '1';
    }
  }
}

/**
 * Common form field props interface
 */
export interface FormFieldProps {
  error?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Convert react-hook-form field state to common props
 */
export function getFormFieldProps<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>,
  options: {
    required?: boolean;
    disabled?: boolean;
    loading?: boolean;
  } = {}
): FormFieldProps {
  return {
    error: getFieldError(form, name),
    required: options.required,
    disabled: options.disabled ?? form.formState.isSubmitting,
    loading: options.loading ?? form.formState.isSubmitting,
  };
}
