'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, AlertTriangle } from 'lucide-react';
import { Stepper, StepControls } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { useCreateRecipe } from '@/hooks/recipe-management/useRecipes';
import { useRecipeStore } from '@/stores/recipe-store';
import { useToastStore } from '@/stores/ui/toast-store';
import {
  createRecipeWizardFormSchema,
  validateStep,
  stepFields,
} from '@/lib/validation/create-recipe-wizard-schemas';
import { cn } from '@/lib/utils';
import {
  BasicInfoStep,
  TimingStep,
  IngredientsStep,
  InstructionsStep,
  ReviewStep,
} from './steps';
import {
  CreateRecipeWizardStep,
  WIZARD_STEPS,
  CREATE_RECIPE_DEFAULT_VALUES,
  convertFormDataToRequest,
  getStepIndex,
  type CreateRecipeFormData,
  type CreateRecipeWizardProps,
} from '@/types/recipe/create-recipe-wizard';
import type { StepperStep } from '@/types/ui/stepper';

/**
 * CreateRecipeWizard Component
 *
 * A multi-step wizard for creating new recipes with:
 * - Step-by-step validation
 * - Auto-save functionality
 * - Draft restoration
 * - Drag-and-drop for ingredients and instructions
 *
 * Architecture: Stepper handles navigation only; form content renders separately
 * via conditional rendering to prevent re-render cascades.
 */
export function CreateRecipeWizard({
  initialData,
  onSuccess,
  onError,
  className,
}: CreateRecipeWizardProps) {
  const router = useRouter();
  const { addSuccessToast, addErrorToast } = useToastStore();
  const {
    draftRecipe,
    hasUnsavedDraft,
    updateDraftRecipe,
    clearDraftRecipe,
    setDraftSaving,
  } = useRecipeStore();

  // State for draft restoration dialog
  const [showRestoreDialog, setShowRestoreDialog] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Current step state
  const [currentStep, setCurrentStep] = React.useState<CreateRecipeWizardStep>(
    CreateRecipeWizardStep.BASIC_INFO
  );

  // Form setup with react-hook-form
  const form = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeWizardFormSchema),
    defaultValues: initialData ?? CREATE_RECIPE_DEFAULT_VALUES,
    mode: 'onChange',
  });

  const {
    reset,
    formState: { isDirty },
  } = form;

  // Create recipe mutation
  const createRecipe = useCreateRecipe();
  const isSubmitting = createRecipe.isPending;

  // Draft saving state
  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  // Auto-save using a simple interval - no complex hook needed
  const autoSaveIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  React.useEffect(() => {
    if (!isInitialized) return;

    // Set up auto-save interval
    autoSaveIntervalRef.current = setInterval(() => {
      if (isDirty) {
        const currentData = form.getValues();
        setDraftSaving(true);
        updateDraftRecipe(
          currentData as unknown as Parameters<typeof updateDraftRecipe>[0]
        );
        setDraftSaving(false);
        setLastSaved(new Date());
      }
    }, 30000); // Save every 30 seconds

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isInitialized, isDirty, form, setDraftSaving, updateDraftRecipe]);

  // Check for existing draft on mount
  React.useEffect(() => {
    if (!isInitialized && hasUnsavedDraft() && !initialData) {
      setShowRestoreDialog(true);
    } else {
      setIsInitialized(true);
    }
  }, [hasUnsavedDraft, initialData, isInitialized]);

  // Handle draft restoration
  const handleRestoreDraft = () => {
    if (draftRecipe) {
      reset({
        ...CREATE_RECIPE_DEFAULT_VALUES,
        ...draftRecipe,
      } as CreateRecipeFormData);
    }
    setShowRestoreDialog(false);
    setIsInitialized(true);
  };

  const handleDiscardDraft = () => {
    clearDraftRecipe();
    setShowRestoreDialog(false);
    setIsInitialized(true);
  };

  // Step validation function
  const validateCurrentStep = React.useCallback(
    async (stepId: string): Promise<boolean> => {
      const result = validateStep(
        stepId as CreateRecipeWizardStep,
        form.getValues()
      );
      return result.success;
    },
    [form]
  );

  // Navigate to a specific step
  const goToStep = React.useCallback((step: CreateRecipeWizardStep) => {
    setCurrentStep(step);
  }, []);

  // Handle save as draft
  const handleSaveDraft = React.useCallback(async () => {
    setIsSavingDraft(true);
    try {
      const currentData = form.getValues();
      setDraftSaving(true);
      updateDraftRecipe(
        currentData as unknown as Parameters<typeof updateDraftRecipe>[0]
      );
      setDraftSaving(false);
      setLastSaved(new Date());
      addSuccessToast('Draft saved successfully');
    } catch {
      addErrorToast('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  }, [form, setDraftSaving, updateDraftRecipe, addSuccessToast, addErrorToast]);

  // Handle publish
  const handlePublish = React.useCallback(async () => {
    const currentFormData = form.getValues();

    // Validate all steps first
    const basicInfoValid = validateStep(
      CreateRecipeWizardStep.BASIC_INFO,
      currentFormData
    );
    const timingValid = validateStep(
      CreateRecipeWizardStep.TIMING,
      currentFormData
    );
    const ingredientsValid = validateStep(
      CreateRecipeWizardStep.INGREDIENTS,
      currentFormData
    );
    const instructionsValid = validateStep(
      CreateRecipeWizardStep.INSTRUCTIONS,
      currentFormData
    );

    if (!basicInfoValid.success) {
      setCurrentStep(CreateRecipeWizardStep.BASIC_INFO);
      addErrorToast('Please complete the Basic Info step');
      return;
    }
    if (!timingValid.success) {
      setCurrentStep(CreateRecipeWizardStep.TIMING);
      addErrorToast('Please complete the Timing & Servings step');
      return;
    }
    if (!ingredientsValid.success) {
      setCurrentStep(CreateRecipeWizardStep.INGREDIENTS);
      addErrorToast('Please add at least one ingredient');
      return;
    }
    if (!instructionsValid.success) {
      setCurrentStep(CreateRecipeWizardStep.INSTRUCTIONS);
      addErrorToast('Please add at least one instruction');
      return;
    }

    // Convert form data to API request
    const request = convertFormDataToRequest(currentFormData);

    try {
      const newRecipe = await createRecipe.mutateAsync(request);

      // Clear draft after successful creation
      clearDraftRecipe();

      // Show success toast
      addSuccessToast('Recipe published successfully!');

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess(newRecipe.recipeId);
      } else {
        router.push(`/recipes/${newRecipe.recipeId}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create recipe';
      addErrorToast(errorMessage);

      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [
    form,
    createRecipe,
    clearDraftRecipe,
    addSuccessToast,
    addErrorToast,
    onSuccess,
    onError,
    router,
  ]);

  // Get current step index
  const currentStepIndex = getStepIndex(currentStep);
  const totalSteps = WIZARD_STEPS.length;

  // Static step configuration - NO content prop, just navigation data
  const stepperSteps = React.useMemo<StepperStep[]>(
    () =>
      WIZARD_STEPS.map(stepConfig => ({
        id: stepConfig.id,
        title: stepConfig.title,
        description: stepConfig.description,
        isAccessible: true,
        // NO content - Stepper only handles navigation UI
      })),
    [] // Truly static - no dependencies
  );

  // Handler for previous button
  const handlePrevious = React.useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = WIZARD_STEPS[currentStepIndex - 1];
      if (prevStep) {
        setCurrentStep(prevStep.id);
      }
    }
  }, [currentStepIndex]);

  // Handler for next button
  const handleNext = React.useCallback(async () => {
    // Get fields for current step and trigger React Hook Form validation
    // This populates the errors object so validation messages display in the UI
    const fieldsToValidate = stepFields[currentStep as CreateRecipeWizardStep];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid && currentStepIndex < totalSteps - 1) {
      const nextStep = WIZARD_STEPS[currentStepIndex + 1];
      if (nextStep) {
        setCurrentStep(nextStep.id);
      }
    }
  }, [currentStep, currentStepIndex, totalSteps, form]);

  // Don't render until initialized
  if (!isInitialized && showRestoreDialog) {
    return (
      <ConfirmationDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
        title="Restore Draft?"
        description="You have an unsaved draft from a previous session. Would you like to continue where you left off?"
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
    <div className={cn('mx-auto w-[90%] max-w-screen-xl', className)}>
      {/* Auto-save indicator */}
      <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
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
        {isDirty && !isSavingDraft && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
        )}
      </div>

      {/* Main wizard content */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={e => e.preventDefault()}>
            {/* Stepper handles ONLY navigation - no form content */}
            <Stepper
              steps={stepperSteps}
              currentStep={currentStep}
              onStepChange={newStep =>
                setCurrentStep(newStep as CreateRecipeWizardStep)
              }
              onValidateStep={validateCurrentStep}
              allowNonLinear={true}
              persistState={true}
              storageKey="create-recipe-wizard-step"
              showProgress={true}
              orientation="horizontal"
              size="default"
              controls={<div />}
            />

            {/* Step content renders DIRECTLY via conditional rendering */}
            {/* Only the active step is mounted - inactive steps don't exist in the tree */}
            <div className="mt-6">
              {currentStep === CreateRecipeWizardStep.BASIC_INFO && (
                <BasicInfoStep
                  form={form}
                  isActive={true}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                />
              )}
              {currentStep === CreateRecipeWizardStep.TIMING && (
                <TimingStep
                  form={form}
                  isActive={true}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                />
              )}
              {currentStep === CreateRecipeWizardStep.INGREDIENTS && (
                <IngredientsStep
                  form={form}
                  isActive={true}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                />
              )}
              {currentStep === CreateRecipeWizardStep.INSTRUCTIONS && (
                <InstructionsStep
                  form={form}
                  isActive={true}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                />
              )}
              {currentStep === CreateRecipeWizardStep.REVIEW && (
                <ReviewStep
                  form={form}
                  isActive={true}
                  stepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                  onEditStep={goToStep}
                  isSubmitting={isSubmitting}
                  onSaveDraft={handleSaveDraft}
                  onPublish={handlePublish}
                  isSavingDraft={isSavingDraft}
                />
              )}
            </div>

            {/* Navigation controls - positioned below content for visibility */}
            {currentStep !== CreateRecipeWizardStep.REVIEW && (
              <StepControls
                canGoPrevious={currentStepIndex > 0}
                canGoNext={currentStepIndex < totalSteps - 1}
                showFinish={false}
                size="lg"
                alignment="center"
                onPrevious={handlePrevious}
                onNext={handleNext}
                className="mt-8 border-t pt-6"
              />
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Format the last saved time for display
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

CreateRecipeWizard.displayName = 'CreateRecipeWizard';
