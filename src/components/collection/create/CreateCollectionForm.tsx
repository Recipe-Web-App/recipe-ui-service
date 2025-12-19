'use client';

import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BasicInfoSection } from './BasicInfoSection';
import { RecipePickerSection } from './RecipePickerSection';
import { CollaboratorPickerSection } from './CollaboratorPickerSection';
import { createCollectionFormSchema } from '@/lib/validation/create-collection-schemas';
import {
  CREATE_COLLECTION_DEFAULT_VALUES,
  type CreateCollectionFormData,
} from '@/types/collection/create-collection-form';
import { CollaborationMode } from '@/types/recipe-management/common';
import type { CollectionDto } from '@/types/recipe-management';
import { useCreateCollection } from '@/hooks/recipe-management';
import { collectionRecipesApi } from '@/lib/api/recipe-management/collection-recipes';
import { collectionCollaboratorsApi } from '@/lib/api/recipe-management/collection-collaborators';
import { cn } from '@/lib/utils';

/**
 * Props for the CreateCollectionForm component.
 */
export interface CreateCollectionFormProps {
  /** Callback when collection is created successfully */
  onSuccess?: (collection: CollectionDto) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback to cancel form */
  onCancel?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Initial form values for editing or prefilling */
  initialValues?: Partial<CreateCollectionFormData>;
}

/**
 * CreateCollectionForm Component
 *
 * Main form component for creating a new collection.
 * Combines BasicInfoSection, CollaboratorPickerSection, and RecipePickerSection
 * into a single-page form.
 */
export function CreateCollectionForm({
  onSuccess,
  onError,
  onCancel,
  className,
  initialValues,
}: CreateCollectionFormProps) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<CreateCollectionFormData>({
    resolver: zodResolver(
      createCollectionFormSchema
    ) as Resolver<CreateCollectionFormData>,
    defaultValues: {
      ...CREATE_COLLECTION_DEFAULT_VALUES,
      ...initialValues,
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, formState } = form;
  const { isValid, isDirty, errors } = formState;

  // Watch collaboration mode for conditional rendering
  const collaborationMode = watch('collaborationMode');
  const showCollaborators =
    collaborationMode === CollaborationMode.SPECIFIC_USERS;

  // Create collection mutation
  const createCollectionMutation = useCreateCollection();

  /**
   * Handle form submission.
   * Creates the collection, then adds recipes and collaborators.
   */
  const onSubmit = async (data: CreateCollectionFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Step 1: Create the collection
      const collectionResponse = await createCollectionMutation.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        visibility: data.visibility,
        collaborationMode: data.collaborationMode,
      });

      const collectionId = collectionResponse.collectionId;

      // Step 2: Add recipes to the collection
      if (data.recipes.length > 0) {
        const recipePromises = data.recipes.map(recipe =>
          collectionRecipesApi.addRecipeToCollection(
            collectionId,
            recipe.recipeId
          )
        );
        await Promise.all(recipePromises);

        // Reorder recipes if needed (to match display order from form)
        if (data.recipes.length > 1) {
          await collectionRecipesApi.reorderRecipes(collectionId, {
            recipes: data.recipes.map((recipe, index) => ({
              recipeId: recipe.recipeId,
              displayOrder: index,
            })),
          });
        }
      }

      // Step 3: Add collaborators if in SPECIFIC_USERS mode
      if (
        data.collaborationMode === CollaborationMode.SPECIFIC_USERS &&
        data.collaborators.length > 0
      ) {
        const collaboratorPromises = data.collaborators.map(collaborator =>
          collectionCollaboratorsApi.addCollaborator(collectionId, {
            userId: collaborator.userId,
          })
        );
        await Promise.all(collaboratorPromises);
      }

      // Success callback
      onSuccess?.(collectionResponse);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create collection';
      setSubmitError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel action with unsaved changes warning.
   */
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) return;
    }
    onCancel?.();
  };

  // Check if form has validation errors to show
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Create Collection</CardTitle>
        <CardDescription>
          Create a new collection to organize and share your favorite recipes.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-8">
          {/* Error Alert */}
          {submitError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information Section */}
          <BasicInfoSection form={form} isActive={true} />

          {/* Collaborator Picker Section (conditionally shown) */}
          <CollaboratorPickerSection form={form} isActive={showCollaborators} />

          {/* Recipe Picker Section */}
          <RecipePickerSection form={form} isActive={true} />
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          {/* Validation Summary */}
          {hasErrors && (
            <div className="text-destructive w-full text-sm">
              Please fix the errors above before submitting.
            </div>
          )}

          {/* Form Actions */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Collection'
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

CreateCollectionForm.displayName = 'CreateCollectionForm';
