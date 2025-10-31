import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  ingredientFormSchema,
  editIngredientFormSchema,
  type IngredientFormData,
  type EditIngredientFormData,
  convertToRecipeIngredientDto,
  convertFromRecipeIngredientDto,
  validationOptions,
} from '@/lib/validation/ingredient-schemas';
import { IngredientUnit } from '@/types/recipe-management/common';
import { useInvalidateIngredients } from '@/hooks/recipe-management/useIngredients';
import type { RecipeIngredientDto } from '@/types/recipe-management';

/**
 * Configuration options for the ingredient form
 */
export interface UseIngredientFormOptions {
  mode: 'create' | 'edit';
  recipeId: number;
  initialData?: RecipeIngredientDto;
  onSuccess?: (data: RecipeIngredientDto) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing ingredient form state and submissions
 */
export function useIngredientForm({
  mode,
  recipeId,
  initialData,
  onSuccess,
  onError,
}: UseIngredientFormOptions) {
  // Always call hooks in the same order
  const createHook = useCreateIngredientFormInternal({
    recipeId,
    onSuccess,
    onError,
  });

  const editHook = useEditIngredientFormInternal({
    recipeId,
    initialData: initialData ?? ({} as RecipeIngredientDto),
    onSuccess,
    onError,
  });

  // Return the appropriate hook result based on mode
  return mode === 'edit' ? editHook : createHook;
}

/**
 * Internal hook for create mode
 */
function useCreateIngredientFormInternal({
  recipeId,
  onSuccess,
  onError,
}: {
  recipeId: number;
  onSuccess?: (data: RecipeIngredientDto) => void;
  onError?: (error: Error) => void;
}) {
  const invalidateIngredients = useInvalidateIngredients();

  const defaultValues: IngredientFormData = {
    ingredientName: '',
    quantity: 1,
    unit: IngredientUnit.UNIT,
    isOptional: false,
  };

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema) as Resolver<IngredientFormData>,
    defaultValues,
    ...validationOptions.create,
  });

  const createMutation = useMutation({
    mutationFn: async (data: IngredientFormData) => {
      convertToRecipeIngredientDto(data, recipeId);
      // Note: You'll need to add this API method to the ingredients API
      throw new Error('Create ingredient API not yet implemented');
    },
    onSuccess: data => {
      invalidateIngredients(recipeId);
      form.reset();
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await createMutation.mutateAsync(data as IngredientFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    handleSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting || createMutation.isPending,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    isValid: form.formState.isValid,
    hasChanges: form.formState.isDirty,
    // React Hook Form's watch() is intentionally not memoized to track form changes
    // eslint-disable-next-line react-hooks/incompatible-library
    currentValues: form.watch(),
    isCreating: createMutation.isPending,
    isUpdating: false,
    createError: createMutation.error,
    updateError: null,
    setFieldValue: form.setValue,
    getFieldError: (fieldName: string) => {
      const errors = form.formState.errors as Record<
        string,
        { message?: string }
      >;
      return errors[fieldName as keyof typeof errors]?.message;
    },
    clearErrors: form.clearErrors,
    validateField: form.trigger,
    validateForm: () => form.trigger(),
  };
}

/**
 * Internal hook for edit mode
 */
function useEditIngredientFormInternal({
  recipeId,
  initialData,
  onSuccess,
  onError,
}: {
  recipeId: number;
  initialData: RecipeIngredientDto;
  onSuccess?: (data: RecipeIngredientDto) => void;
  onError?: (error: Error) => void;
}) {
  const invalidateIngredients = useInvalidateIngredients();

  const defaultValues = convertFromRecipeIngredientDto(initialData);

  const form = useForm<EditIngredientFormData>({
    resolver: zodResolver(
      editIngredientFormSchema
    ) as Resolver<EditIngredientFormData>,
    defaultValues,
    ...validationOptions.edit,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EditIngredientFormData) => {
      convertToRecipeIngredientDto(
        data,
        data.recipeId ?? recipeId,
        data.ingredientId
      );
      // Note: You'll need to add this API method to the ingredients API
      throw new Error('Update ingredient API not yet implemented');
    },
    onSuccess: data => {
      invalidateIngredients(recipeId);
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await updateMutation.mutateAsync(data as EditIngredientFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  return {
    form,
    handleSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting || updateMutation.isPending,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    isValid: form.formState.isValid,
    hasChanges: form.formState.isDirty,
    // React Hook Form's watch() is intentionally not memoized to track form changes
    // eslint-disable-next-line react-hooks/incompatible-library
    currentValues: form.watch(),
    isCreating: false,
    isUpdating: updateMutation.isPending,
    createError: null,
    updateError: updateMutation.error,
    setFieldValue: form.setValue,
    getFieldError: (fieldName: string) => {
      const errors = form.formState.errors as Record<
        string,
        { message?: string }
      >;
      return errors[fieldName as keyof typeof errors]?.message;
    },
    clearErrors: form.clearErrors,
    validateField: form.trigger,
    validateForm: () => form.trigger(),
  };
}

/**
 * Simplified hook for creating ingredients
 */
export function useCreateIngredientForm(
  recipeId: number,
  options?: Omit<UseIngredientFormOptions, 'mode' | 'recipeId'>
) {
  return useIngredientForm({
    mode: 'create',
    recipeId,
    ...options,
  });
}

/**
 * Simplified hook for editing ingredients
 */
export function useEditIngredientForm(
  recipeId: number,
  initialData: RecipeIngredientDto,
  options?: Omit<UseIngredientFormOptions, 'mode' | 'recipeId' | 'initialData'>
) {
  return useIngredientForm({
    mode: 'edit',
    recipeId,
    initialData,
    ...options,
  });
}
