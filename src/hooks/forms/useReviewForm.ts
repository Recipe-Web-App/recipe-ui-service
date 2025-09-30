import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addReviewFormSchema,
  editReviewFormSchema,
  addReviewDefaultValues,
  convertToAddReviewRequest,
  convertToEditReviewRequest,
  convertFromReviewDto,
  validationOptions,
} from '@/lib/validation/review-schemas';
import type {
  AddReviewFormData,
  EditReviewFormData,
} from '@/lib/validation/review-schemas';
import type { ReviewDto } from '@/types/recipe-management/review';
import {
  useAddRecipeReview,
  useEditRecipeReview,
} from '@/hooks/recipe-management/useReviews';
import { useCallback, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

/**
 * Options for review form hooks
 */
interface ReviewFormOptions {
  onSuccess?: (data: ReviewDto) => void;
  onError?: (error: Error) => void;
}

/**
 * Return type for review form hooks
 */
interface ReviewFormReturn<T extends AddReviewFormData | EditReviewFormData> {
  form: UseFormReturn<T>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetForm: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
  hasChanges: boolean;
  getFieldError: (fieldName: keyof T) => string | undefined;
  validateField: (fieldName: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  clearErrors: () => void;
}

/**
 * Hook for adding a new review
 * @internal
 */
function useAddReviewFormInternal(
  recipeId: number,
  options?: ReviewFormOptions
): ReviewFormReturn<AddReviewFormData> {
  const [initialValues] = useState<AddReviewFormData>(addReviewDefaultValues);

  const form = useForm<AddReviewFormData>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: initialValues,
    ...validationOptions.add,
  });

  const addReviewMutation = useAddRecipeReview();

  const handleSubmit = form.handleSubmit(async (data: AddReviewFormData) => {
    try {
      const requestData = convertToAddReviewRequest(data);
      const result = await addReviewMutation.mutateAsync({
        recipeId,
        data: requestData,
      });
      options?.onSuccess?.(result);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error('Unknown error');
      options?.onError?.(errorObj);
    }
  });

  const resetForm = useCallback(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const getFieldError = useCallback(
    (fieldName: keyof AddReviewFormData) => {
      const errors = form.formState.errors as Record<
        string,
        { message?: string }
      >;
      return errors[fieldName as string]?.message;
    },
    [form.formState.errors]
  );

  const validateField = useCallback(
    async (fieldName: keyof AddReviewFormData) => {
      const result = await form.trigger(fieldName);
      return result;
    },
    [form]
  );

  const validateForm = useCallback(async () => {
    const result = await form.trigger();
    return result;
  }, [form]);

  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  return {
    form,
    handleSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting || addReviewMutation.isPending,
    isValid: form.formState.isValid,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    hasChanges: form.formState.isDirty,
    getFieldError,
    validateField,
    validateForm,
    clearErrors,
  };
}

/**
 * Hook for editing an existing review
 * @internal
 */
function useEditReviewFormInternal(
  recipeId: number,
  reviewId: number,
  initialData: ReviewDto,
  options?: ReviewFormOptions
): ReviewFormReturn<EditReviewFormData> {
  const [initialValues] = useState<EditReviewFormData>(
    convertFromReviewDto(initialData)
  );

  const form = useForm<EditReviewFormData>({
    resolver: zodResolver(editReviewFormSchema),
    defaultValues: initialValues,
    ...validationOptions.edit,
  });

  const editReviewMutation = useEditRecipeReview();

  const handleSubmit = form.handleSubmit(async (data: EditReviewFormData) => {
    try {
      const requestData = convertToEditReviewRequest(data);
      const result = await editReviewMutation.mutateAsync({
        recipeId,
        reviewId,
        data: requestData,
      });
      options?.onSuccess?.(result);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error('Unknown error');
      options?.onError?.(errorObj);
    }
  });

  const resetForm = useCallback(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const getFieldError = useCallback(
    (fieldName: keyof EditReviewFormData) => {
      const errors = form.formState.errors as Record<
        string,
        { message?: string }
      >;
      return errors[fieldName as string]?.message;
    },
    [form.formState.errors]
  );

  const validateField = useCallback(
    async (fieldName: keyof EditReviewFormData) => {
      const result = await form.trigger(fieldName);
      return result;
    },
    [form]
  );

  const validateForm = useCallback(async () => {
    const result = await form.trigger();
    return result;
  }, [form]);

  const clearErrors = useCallback(() => {
    form.clearErrors();
  }, [form]);

  return {
    form,
    handleSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting || editReviewMutation.isPending,
    isValid: form.formState.isValid,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    hasChanges: form.formState.isDirty,
    getFieldError,
    validateField,
    validateForm,
    clearErrors,
  };
}

/**
 * Main hook for review forms
 * Supports both 'add' and 'edit' modes
 */
export function useReviewForm(
  mode: 'add',
  recipeId: number,
  options?: ReviewFormOptions
): ReviewFormReturn<AddReviewFormData>;
export function useReviewForm(
  mode: 'edit',
  recipeId: number,
  reviewId: number,
  initialData: ReviewDto,
  options?: ReviewFormOptions
): ReviewFormReturn<EditReviewFormData>;
export function useReviewForm(
  mode: 'add' | 'edit',
  recipeId: number,
  reviewIdOrOptions?: number | ReviewFormOptions,
  initialDataOrOptions?: ReviewDto | ReviewFormOptions,
  optionsParam?: ReviewFormOptions
): ReviewFormReturn<AddReviewFormData> | ReviewFormReturn<EditReviewFormData> {
  // Always call both hooks to follow rules of hooks
  const reviewId =
    typeof reviewIdOrOptions === 'number' ? reviewIdOrOptions : 0;
  const initialData =
    initialDataOrOptions &&
    typeof initialDataOrOptions === 'object' &&
    'reviewId' in initialDataOrOptions
      ? initialDataOrOptions
      : ({} as ReviewDto);
  const options =
    mode === 'add'
      ? (reviewIdOrOptions as ReviewFormOptions | undefined)
      : optionsParam;

  const addFormResult = useAddReviewFormInternal(recipeId, options);
  const editFormResult = useEditReviewFormInternal(
    recipeId,
    reviewId,
    initialData,
    options
  );

  // Return appropriate result based on mode
  return mode === 'add' ? addFormResult : editFormResult;
}

/**
 * Convenience hook for adding reviews
 */
export function useAddReviewForm(
  recipeId: number,
  options?: ReviewFormOptions
): ReviewFormReturn<AddReviewFormData> {
  return useReviewForm('add', recipeId, options);
}

/**
 * Convenience hook for editing reviews
 */
export function useEditReviewForm(
  recipeId: number,
  reviewId: number,
  initialData: ReviewDto,
  options?: ReviewFormOptions
): ReviewFormReturn<EditReviewFormData> {
  return useReviewForm('edit', recipeId, reviewId, initialData, options);
}
