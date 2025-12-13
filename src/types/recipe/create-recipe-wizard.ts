import type { FieldErrors, UseFormReturn } from 'react-hook-form';
import type {
  CreateRecipeRequest,
  CreateRecipeIngredientRequest,
  CreateRecipeStepRequest,
} from '@/types/recipe-management/recipe';
import { DifficultyLevel } from '@/types/recipe-management/common';

/**
 * Wizard step identifiers
 */
export enum CreateRecipeWizardStep {
  BASIC_INFO = 'basic-info',
  TIMING = 'timing',
  INGREDIENTS = 'ingredients',
  INSTRUCTIONS = 'instructions',
  REVIEW = 'review',
}

/**
 * Wizard step configuration
 */
export interface WizardStepConfig {
  id: CreateRecipeWizardStep;
  title: string;
  description: string;
  icon?: string;
  isOptional?: boolean;
}

/**
 * All wizard steps configuration
 */
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: CreateRecipeWizardStep.BASIC_INFO,
    title: 'Basic Info',
    description: 'Recipe name and description',
  },
  {
    id: CreateRecipeWizardStep.INGREDIENTS,
    title: 'Ingredients',
    description: 'List all ingredients needed',
  },
  {
    id: CreateRecipeWizardStep.INSTRUCTIONS,
    title: 'Instructions',
    description: 'Step-by-step cooking instructions',
  },
  {
    id: CreateRecipeWizardStep.TIMING,
    title: 'Timing & Servings',
    description: 'Prep time, cook time, and servings',
  },
  {
    id: CreateRecipeWizardStep.REVIEW,
    title: 'Review & Publish',
    description: 'Review and publish your recipe',
  },
];

/**
 * Basic info step form data
 */
export interface BasicInfoStepData {
  title: string;
  description: string;
}

/**
 * Timing step form data
 * Note: servings is optional to allow clearing the field during editing.
 * Step validation enforces the requirement when clicking Next.
 */
export interface TimingStepData {
  servings?: number;
  prepTime: number;
  cookTime: number;
  difficulty: DifficultyLevel;
}

/**
 * Ingredient form data (for a single ingredient)
 * Index signature required for SortableList compatibility
 */
export interface IngredientFormData {
  id: string; // Temporary ID for drag-and-drop tracking
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  [key: string]: unknown;
}

/**
 * Ingredients step form data
 */
export interface IngredientsStepData {
  ingredients: IngredientFormData[];
}

/**
 * Instruction form data (for a single step)
 * Index signature required for SortableList compatibility
 */
export interface InstructionFormData {
  id: string; // Temporary ID for drag-and-drop tracking
  stepNumber: number;
  instruction: string;
  duration?: number;
  [key: string]: unknown;
}

/**
 * Instructions step form data
 */
export interface InstructionsStepData {
  steps: InstructionFormData[];
}

/**
 * Tags step data (optional, included in review)
 */
export interface TagsStepData {
  tags: string[];
}

/**
 * Complete wizard form data
 * Combines all step data into a single form
 * Note: tags is optional here to match Zod schema input type,
 * but defaults to [] in both schema and default values.
 * Servings is optional to allow clearing during editing; step validation enforces the requirement.
 */
export interface CreateRecipeFormData {
  // Basic Info
  title: string;
  description: string;
  // Timing
  servings?: number;
  prepTime: number;
  cookTime: number;
  difficulty: DifficultyLevel;
  // Ingredients
  ingredients: IngredientFormData[];
  // Instructions
  steps: InstructionFormData[];
  // Tags (optional, defaults to empty array)
  tags?: string[];
}

/**
 * Default values for the create recipe form
 */
export const CREATE_RECIPE_DEFAULT_VALUES: CreateRecipeFormData = {
  title: '',
  description: '',
  servings: 4,
  prepTime: 0,
  cookTime: 0,
  difficulty: DifficultyLevel.MEDIUM,
  ingredients: [
    {
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      unit: 'UNIT',
      notes: '',
    },
  ],
  steps: [
    {
      id: crypto.randomUUID(),
      stepNumber: 1,
      instruction: '',
      duration: undefined,
    },
  ],
  tags: [],
};

/**
 * Wizard navigation state
 */
export interface WizardNavigationState {
  currentStep: CreateRecipeWizardStep;
  completedSteps: Set<CreateRecipeWizardStep>;
  visitedSteps: Set<CreateRecipeWizardStep>;
}

/**
 * Auto-save state
 */
export interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

/**
 * Step component common props
 */
export interface StepComponentProps {
  /** React Hook Form instance */
  form: UseFormReturn<CreateRecipeFormData>;
  /** Whether the step is currently active */
  isActive: boolean;
  /** Callback when step is complete and wants to proceed */
  onNext?: () => void;
  /** Callback when step wants to go back */
  onPrevious?: () => void;
  /** Current step index (0-based) */
  stepIndex: number;
  /** Total number of steps */
  totalSteps: number;
}

/**
 * Review step props (extends base props)
 */
export interface ReviewStepProps extends StepComponentProps {
  /** Callback to navigate to a specific step for editing */
  onEditStep: (step: CreateRecipeWizardStep) => void;
  /** Whether the form is currently being submitted */
  isSubmitting: boolean;
  /** Callback to save as draft */
  onSaveDraft: () => void;
  /** Callback to publish the recipe */
  onPublish: () => void;
  /** Whether draft is being saved */
  isSavingDraft: boolean;
}

/**
 * Wizard component props
 */
export interface CreateRecipeWizardProps {
  /** Optional initial form data (for restoring draft) */
  initialData?: Partial<CreateRecipeFormData>;
  /** Callback when recipe is successfully created */
  onSuccess?: (recipeId: number) => void;
  /** Callback when creation fails */
  onError?: (error: Error) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * Convert form data to API request format
 */
export function convertFormDataToRequest(
  formData: CreateRecipeFormData
): CreateRecipeRequest {
  return {
    title: formData.title,
    description: formData.description ?? '',
    servings: formData.servings ?? 4, // Validated before calling; fallback for type safety
    preparationTime: formData.prepTime,
    cookingTime: formData.cookTime,
    difficulty: formData.difficulty,
    ingredients: formData.ingredients.map(
      (ing): CreateRecipeIngredientRequest => ({
        ingredientName: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Convert empty string to undefined
        notes: ing.notes || undefined,
      })
    ),
    steps: formData.steps.map(
      (step, index): CreateRecipeStepRequest => ({
        stepNumber: index + 1,
        instruction: step.instruction,
        timerSeconds: step.duration,
      })
    ),
    tags:
      formData.tags && formData.tags.length > 0
        ? formData.tags.map(tag => ({ tagId: 0, name: tag }))
        : undefined,
  };
}

/**
 * Generate a new ingredient with default values
 */
export function createEmptyIngredient(): IngredientFormData {
  return {
    id: crypto.randomUUID(),
    name: '',
    quantity: 1,
    unit: 'UNIT',
    notes: '',
  };
}

/**
 * Generate a new instruction step with default values
 */
export function createEmptyInstruction(
  stepNumber: number
): InstructionFormData {
  return {
    id: crypto.randomUUID(),
    stepNumber,
    instruction: '',
    duration: undefined,
  };
}

/**
 * Get step index by step ID
 */
export function getStepIndex(stepId: CreateRecipeWizardStep): number {
  return WIZARD_STEPS.findIndex(step => step.id === stepId);
}

/**
 * Get step by index
 */
export function getStepById(
  stepId: CreateRecipeWizardStep
): WizardStepConfig | undefined {
  return WIZARD_STEPS.find(step => step.id === stepId);
}

/**
 * Check if step has validation errors
 */
export function stepHasErrors(
  stepId: CreateRecipeWizardStep,
  errors: FieldErrors<CreateRecipeFormData>
): boolean {
  switch (stepId) {
    case CreateRecipeWizardStep.BASIC_INFO:
      return !!(errors.title ?? errors.description);
    case CreateRecipeWizardStep.TIMING:
      return !!(
        errors.servings ??
        errors.prepTime ??
        errors.cookTime ??
        errors.difficulty
      );
    case CreateRecipeWizardStep.INGREDIENTS:
      return !!errors.ingredients;
    case CreateRecipeWizardStep.INSTRUCTIONS:
      return !!errors.steps;
    case CreateRecipeWizardStep.REVIEW:
      return false; // Review step doesn't have its own fields
    default:
      return false;
  }
}
