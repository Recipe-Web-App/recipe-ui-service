import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRecipeFormSchema,
  editRecipeFormSchema,
  updateRecipeFormSchema,
  type RecipeFormData,
  type EditRecipeFormData,
  type UpdateRecipeFormData,
  convertToCreateRecipeRequest,
  convertToUpdateRecipeRequest,
  convertFromRecipeDto,
  convertFromRecipeDtoToUpdate,
  createRecipeDefaultValues,
  validationOptions,
} from '@/lib/validation/recipe-schemas';
import { recipesApi } from '@/lib/api/recipe-management';
import type {
  RecipeDto,
  SearchRecipesResponse,
} from '@/types/recipe-management';
import { IngredientUnit } from '@/types/recipe-management/common';
import { QUERY_KEYS } from '@/constants';

// Safe query keys to prevent TypeScript unsafe member access warnings
const RECIPES = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPES as readonly string[];
const RECIPE = QUERY_KEYS.RECIPE_MANAGEMENT.RECIPE as readonly string[];

/**
 * Configuration options for the recipe form
 */
export interface UseRecipeFormOptions {
  mode: 'create' | 'edit' | 'update';
  recipeId?: number;
  initialData?: RecipeDto;
  onSuccess?: (data: RecipeDto) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing recipe form state and submissions
 */
export function useRecipeForm({
  mode,
  recipeId,
  initialData,
  onSuccess,
  onError,
}: UseRecipeFormOptions) {
  // Always call hooks in the same order
  const createHook = useCreateRecipeFormInternal({
    onSuccess,
    onError,
  });

  const editHook = useEditRecipeFormInternal({
    recipeId: recipeId ?? 0,
    initialData: initialData ?? ({} as RecipeDto),
    onSuccess,
    onError,
  });

  const updateHook = useUpdateRecipeFormInternal({
    recipeId: recipeId ?? 0,
    initialData: initialData ?? ({} as RecipeDto),
    onSuccess,
    onError,
  });

  // Return the appropriate hook result based on mode
  switch (mode) {
    case 'edit':
      return editHook;
    case 'update':
      return updateHook;
    case 'create':
    default:
      return createHook;
  }
}

/**
 * Internal hook for create mode
 */
function useCreateRecipeFormInternal({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: RecipeDto) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(createRecipeFormSchema) as Resolver<RecipeFormData>,
    defaultValues: createRecipeDefaultValues,
    ...validationOptions.create,
  });

  const createMutation = useMutation({
    mutationFn: async (data: RecipeFormData) => {
      const requestData = convertToCreateRecipeRequest(data);
      return await recipesApi.createRecipe(requestData);
    },
    onSuccess: data => {
      // Add the new recipe to the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            recipes: [data, ...oldData.recipes],
            totalElements: oldData.totalElements + 1,
          };
        }
        return oldData;
      });

      // Set the new recipe in cache
      queryClient.setQueryData([...RECIPE, data.recipeId], data);

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });

      form.reset();
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const resetForm = () => {
    form.reset(createRecipeDefaultValues);
  };

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue('ingredients', [
      ...currentIngredients,
      {
        name: '',
        quantity: 1,
        unit: IngredientUnit.UNIT,
        isOptional: false,
        notes: undefined,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients');
    if (currentIngredients.length > 1) {
      form.setValue(
        'ingredients',
        currentIngredients.filter((_, i) => i !== index)
      );
    }
  };

  const addStep = () => {
    const currentSteps = form.getValues('steps');
    form.setValue('steps', [
      ...currentSteps,
      {
        stepNumber: currentSteps.length + 1,
        instruction: '',
        optional: false,
        duration: undefined,
      },
    ]);
  };

  const removeStep = (index: number) => {
    const currentSteps = form.getValues('steps');
    if (currentSteps.length > 1) {
      const updatedSteps = currentSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }));
      form.setValue('steps', updatedSteps);
    }
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tag.trim())) {
      form.setValue('tags', [...currentTags, tag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter((_, i) => i !== index)
    );
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
    // Recipe-specific methods
    addIngredient,
    removeIngredient,
    addStep,
    removeStep,
    addTag,
    removeTag,
  };
}

/**
 * Internal hook for edit mode (full recipe editing)
 */
function useEditRecipeFormInternal({
  recipeId,
  initialData,
  onSuccess,
  onError,
}: {
  recipeId: number;
  initialData: RecipeDto;
  onSuccess?: (data: RecipeDto) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  const defaultValues = convertFromRecipeDto(initialData);

  const form = useForm<EditRecipeFormData>({
    resolver: zodResolver(editRecipeFormSchema) as Resolver<EditRecipeFormData>,
    defaultValues,
    ...validationOptions.edit,
  });

  const editMutation = useMutation({
    mutationFn: async (data: EditRecipeFormData) => {
      // For full edit, we would need a full update API endpoint
      // For now, we'll use the partial update endpoint with all fields
      const updateData = convertToUpdateRecipeRequest({
        recipeId: data.recipeId,
        title: data.title,
        description: data.description,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        difficulty: data.difficulty,
      });
      return await recipesApi.updateRecipe(recipeId, updateData);
    },
    onSuccess: data => {
      // Update the specific recipe in cache
      queryClient.setQueryData([...RECIPE, recipeId], data);

      // Update the recipe in the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            recipes: oldData.recipes.map(recipe =>
              recipe.recipeId === recipeId ? data : recipe
            ),
          };
        }
        return oldData;
      });

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });

      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await editMutation.mutateAsync(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const addIngredient = () => {
    const currentIngredients = form.getValues('ingredients');
    form.setValue('ingredients', [
      ...currentIngredients,
      {
        name: '',
        quantity: 1,
        unit: IngredientUnit.UNIT,
        isOptional: false,
        notes: undefined,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues('ingredients');
    if (currentIngredients.length > 1) {
      form.setValue(
        'ingredients',
        currentIngredients.filter((_, i) => i !== index)
      );
    }
  };

  const addStep = () => {
    const currentSteps = form.getValues('steps');
    form.setValue('steps', [
      ...currentSteps,
      {
        stepNumber: currentSteps.length + 1,
        instruction: '',
        optional: false,
        duration: undefined,
      },
    ]);
  };

  const removeStep = (index: number) => {
    const currentSteps = form.getValues('steps');
    if (currentSteps.length > 1) {
      const updatedSteps = currentSteps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }));
      form.setValue('steps', updatedSteps);
    }
  };

  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tag.trim())) {
      form.setValue('tags', [...currentTags, tag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter((_, i) => i !== index)
    );
  };

  return {
    form,
    handleSubmit,
    resetForm,
    isSubmitting: form.formState.isSubmitting || editMutation.isPending,
    hasErrors: Object.keys(form.formState.errors).length > 0,
    isValid: form.formState.isValid,
    hasChanges: form.formState.isDirty,
    // React Hook Form's watch() is intentionally not memoized to track form changes
    // eslint-disable-next-line react-hooks/incompatible-library
    currentValues: form.watch(),
    isCreating: false,
    isUpdating: editMutation.isPending,
    createError: null,
    updateError: editMutation.error,
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
    // Recipe-specific methods
    addIngredient,
    removeIngredient,
    addStep,
    removeStep,
    addTag,
    removeTag,
  };
}

/**
 * Internal hook for update mode (partial recipe updates)
 */
function useUpdateRecipeFormInternal({
  recipeId,
  initialData,
  onSuccess,
  onError,
}: {
  recipeId: number;
  initialData: RecipeDto;
  onSuccess?: (data: RecipeDto) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  const defaultValues = convertFromRecipeDtoToUpdate(initialData);

  const form = useForm<UpdateRecipeFormData>({
    resolver: zodResolver(
      updateRecipeFormSchema
    ) as Resolver<UpdateRecipeFormData>,
    defaultValues,
    ...validationOptions.update,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateRecipeFormData) => {
      const updateData = convertToUpdateRecipeRequest(data);
      return await recipesApi.updateRecipe(recipeId, updateData);
    },
    onSuccess: data => {
      // Update the specific recipe in cache
      queryClient.setQueryData([...RECIPE, recipeId], data);

      // Update the recipe in the recipes list cache
      queryClient.setQueryData<SearchRecipesResponse>(RECIPES, oldData => {
        if (oldData) {
          return {
            ...oldData,
            recipes: oldData.recipes.map(recipe =>
              recipe.recipeId === recipeId ? data : recipe
            ),
          };
        }
        return oldData;
      });

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [...RECIPE, recipeId],
      });
      queryClient.invalidateQueries({
        queryKey: RECIPES,
      });

      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const handleSubmit = form.handleSubmit(async data => {
    try {
      await updateMutation.mutateAsync(data);
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
    // Update mode doesn't include ingredient/step/tag management
    addIngredient: undefined,
    removeIngredient: undefined,
    addStep: undefined,
    removeStep: undefined,
    addTag: undefined,
    removeTag: undefined,
  };
}

/**
 * Simplified hook for creating recipes
 */
export function useCreateRecipeForm(
  options?: Omit<UseRecipeFormOptions, 'mode'>
) {
  return useRecipeForm({
    mode: 'create',
    ...options,
  });
}

/**
 * Simplified hook for editing recipes (full editing with ingredients, steps, tags)
 */
export function useEditRecipeForm(
  recipeId: number,
  initialData: RecipeDto,
  options?: Omit<UseRecipeFormOptions, 'mode' | 'recipeId' | 'initialData'>
) {
  return useRecipeForm({
    mode: 'edit',
    recipeId,
    initialData,
    ...options,
  });
}

/**
 * Simplified hook for updating recipes (basic fields only)
 */
export function useUpdateRecipeForm(
  recipeId: number,
  initialData: RecipeDto,
  options?: Omit<UseRecipeFormOptions, 'mode' | 'recipeId' | 'initialData'>
) {
  return useRecipeForm({
    mode: 'update',
    recipeId,
    initialData,
    ...options,
  });
}
