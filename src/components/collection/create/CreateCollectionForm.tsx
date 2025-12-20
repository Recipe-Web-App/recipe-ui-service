'use client';

import * as React from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, AlertTriangle } from 'lucide-react';
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
import { ConfirmationDialog } from '@/components/ui/dialog';
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
import { useCollectionStore } from '@/stores/collection-store';
import { useToastStore } from '@/stores/ui/toast-store';
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

  // Draft restoration state
  const [showRestoreDialog, setShowRestoreDialog] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Draft saving state
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const autoSaveIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  // Ref to track dirty state for use in callbacks (avoids stale closure issues)
  const isDirtyRef = React.useRef(false);

  // Toast store for notifications
  const { addSuccessToast, addErrorToast } = useToastStore();

  // Collection store for draft management
  const {
    draftCollection,
    hasUnsavedDraft,
    setDraftCollection,
    clearDraftCollection,
    setDraftSaving,
  } = useCollectionStore();

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

  const { handleSubmit, watch, formState, reset } = form;
  const { isValid, isDirty, errors } = formState;

  // Keep isDirtyRef in sync with form's isDirty state
  // This allows interval/event callbacks to access the latest value
  React.useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Watch collaboration mode for conditional rendering
  const collaborationMode = watch('collaborationMode');
  const showCollaborators =
    collaborationMode === CollaborationMode.SPECIFIC_USERS;

  // Create collection mutation
  const createCollectionMutation = useCreateCollection();

  // Check for existing draft on mount
  React.useEffect(() => {
    if (!isInitialized && hasUnsavedDraft() && !initialValues) {
      setShowRestoreDialog(true);
    } else {
      setIsInitialized(true);
    }
  }, [hasUnsavedDraft, initialValues, isInitialized]);

  // Auto-save draft every 30 seconds when form is dirty
  // Note: We use isDirtyRef to get the latest dirty state without
  // recreating the interval on every form change
  React.useEffect(() => {
    if (!isInitialized) {
      return;
    }

    autoSaveIntervalRef.current = setInterval(() => {
      if (isDirtyRef.current) {
        const currentData = form.getValues();
        setDraftSaving(true);
        setDraftCollection(currentData);
        setDraftSaving(false);
        setLastSaved(new Date());
      }
    }, 10000);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isInitialized, form, setDraftSaving, setDraftCollection]);

  // Save draft when user closes browser or navigates away
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (isDirtyRef.current) {
        const currentData = form.getValues();
        setDraftCollection(currentData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form, setDraftCollection]);

  /**
   * Handle restoring draft from storage.
   */
  const handleRestoreDraft = React.useCallback(() => {
    if (draftCollection) {
      reset({
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        ...draftCollection,
      });
    }
    setShowRestoreDialog(false);
    setIsInitialized(true);
  }, [draftCollection, reset]);

  /**
   * Handle discarding draft and starting fresh.
   */
  const handleDiscardDraft = React.useCallback(() => {
    clearDraftCollection();
    setShowRestoreDialog(false);
    setIsInitialized(true);
  }, [clearDraftCollection]);

  /**
   * Handle manually saving draft.
   */
  const handleSaveDraft = React.useCallback(async () => {
    setIsSavingDraft(true);
    try {
      const currentData = form.getValues();
      setDraftSaving(true);
      setDraftCollection(currentData);
      setDraftSaving(false);
      setLastSaved(new Date());
      addSuccessToast('Draft saved successfully');
    } catch {
      addErrorToast('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  }, [
    form,
    setDraftSaving,
    setDraftCollection,
    addSuccessToast,
    addErrorToast,
  ]);

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

      // Clear draft after successful creation
      clearDraftCollection();

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

  // Show draft restoration dialog before initializing
  if (!isInitialized && showRestoreDialog) {
    return (
      <ConfirmationDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
        title="Restore Draft?"
        description="You have an unsaved draft collection from a previous session. Would you like to continue where you left off?"
        icon={<AlertTriangle className="h-5 w-5" />}
        confirmText="Restore Draft"
        cancelText="Start Fresh"
        onConfirm={handleRestoreDraft}
        onCancel={handleDiscardDraft}
        type="save"
      />
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Create Collection</CardTitle>
        <CardDescription>
          Create a new collection to organize and share your favorite recipes.
        </CardDescription>
        {/* Auto-save indicator */}
        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
          {isSavingDraft ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Save className="h-4 w-4" />
              <span>Last saved {formatLastSaved(lastSaved)}</span>
            </>
          ) : isDirty ? (
            <span>Unsaved changes</span>
          ) : null}
        </div>
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
            {isDirty && !isSavingDraft && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isSubmitting}
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </>
                )}
              </Button>
            )}
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

/**
 * Format the last saved time for display.
 */
function formatLastSaved(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 10) {
    return 'just now';
  }
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }
  if (diffMinutes === 1) {
    return '1 minute ago';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
