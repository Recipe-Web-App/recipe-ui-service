import { type VariantProps } from 'class-variance-authority';
import {
  stepperVariants,
  stepperItemVariants,
  stepIndicatorVariants,
  stepConnectorVariants,
  stepHeaderVariants,
  stepContentVariants,
  stepControlsVariants,
  stepProgressVariants,
  recipeStepperVariants,
  cookingTimerVariants,
} from '@/lib/ui/stepper-variants';

/**
 * Individual step data structure
 */
export interface StepperStep {
  /** Unique identifier for the step */
  id: string;
  /** Display title for the step */
  title: string;
  /** Optional description or subtitle */
  description?: string;
  /** Icon name from the icon registry */
  icon?: string;
  /** React content to display when step is active */
  content?: React.ReactNode;
  /** Whether this step is optional and can be skipped */
  isOptional?: boolean;
  /** Whether this step has been completed */
  isCompleted?: boolean;
  /** Whether this step has validation errors */
  isError?: boolean;
  /** Whether this step can be accessed/clicked */
  isAccessible?: boolean;
  /** Validation rules for step completion */
  validationRules?: ValidationRule[];
  /** Estimated time to complete this step */
  estimatedTime?: string;
  /** Additional metadata for the step */
  metadata?: Record<string, unknown>;
}

/**
 * Validation rule for step completion
 */
export interface ValidationRule {
  /** Validation function that returns true if valid */
  validate: () => boolean | Promise<boolean>;
  /** Error message to display if validation fails */
  errorMessage: string;
  /** Whether this validation is required for progression */
  required?: boolean;
}

/**
 * Navigation callback function signatures
 */
export type StepNavigationHandler = (
  stepId: string,
  direction: 'next' | 'previous' | 'jump'
) => void | Promise<void>;

export type StepValidationHandler = (
  stepId: string
) => boolean | Promise<boolean>;

export type StepChangeHandler = (
  currentStepId: string,
  previousStepId?: string
) => void;

/**
 * Main Stepper component props
 */
export interface StepperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  /** Array of steps to display */
  steps: StepperStep[];
  /** Currently active step ID */
  currentStep?: string;
  /** Default step to start with */
  defaultStep?: string;
  /** Whether to show linear progress bar */
  showProgress?: boolean;
  /** Whether to allow non-linear navigation */
  allowNonLinear?: boolean;
  /** Whether to persist state in localStorage */
  persistState?: boolean;
  /** Storage key for state persistence */
  storageKey?: string;
  /** Callback when step changes */
  onStepChange?: StepChangeHandler;
  /** Callback for step navigation attempts */
  onNavigate?: StepNavigationHandler;
  /** Callback for step validation */
  onValidateStep?: StepValidationHandler;
  /** Custom navigation controls */
  controls?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Stepper item component props
 */
export interface StepperItemProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    VariantProps<typeof stepperItemVariants> {
  /** Step data */
  step: StepperStep;
  /** Whether this step is currently active */
  isActive?: boolean;
  /** Whether this step is completed */
  isCompleted?: boolean;
  /** Whether this step has errors */
  hasError?: boolean;
  /** Step number for display */
  stepNumber?: number;
  /** Whether to show connector to next step */
  showConnector?: boolean;
  /** Click handler for step navigation */
  onStepClick?: (stepId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step indicator component props
 */
export interface StepIndicatorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepIndicatorVariants> {
  /** Step number to display */
  stepNumber?: number;
  /** Icon name from icon registry */
  icon?: string;
  /** Whether step is clickable */
  isClickable?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step connector component props
 */
export interface StepConnectorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepConnectorVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step header component props
 */
export interface StepHeaderProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepHeaderVariants> {
  /** Step title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional estimated time */
  estimatedTime?: string;
  /** Whether step is optional */
  isOptional?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step content component props
 */
export interface StepContentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepContentVariants> {
  /** Content to display */
  children: React.ReactNode;
  /** Whether content is visible */
  isVisible?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step controls component props
 */
export interface StepControlsProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepControlsVariants> {
  /** Whether previous button is disabled */
  canGoPrevious?: boolean;
  /** Whether next button is disabled */
  canGoNext?: boolean;
  /** Whether current step can be skipped */
  canSkip?: boolean;
  /** Whether to show finish button instead of next */
  showFinish?: boolean;
  /** Custom previous button text */
  previousText?: string;
  /** Custom next button text */
  nextText?: string;
  /** Custom skip button text */
  skipText?: string;
  /** Custom finish button text */
  finishText?: string;
  /** Previous button click handler */
  onPrevious?: () => void;
  /** Next button click handler */
  onNext?: () => void;
  /** Skip button click handler */
  onSkip?: () => void;
  /** Finish button click handler */
  onFinish?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Step progress component props
 */
export interface StepProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepProgressVariants> {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Current step number */
  currentStep?: number;
  /** Total number of steps */
  totalSteps?: number;
  /** Whether to show step numbers */
  showStepNumbers?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Recipe stepper component props
 */
export interface RecipeStepperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof recipeStepperVariants> {
  /** Recipe workflow steps */
  steps: RecipeWorkflowStep[];
  /** Current active step */
  currentStep?: string;
  /** Recipe data context */
  recipeData?: RecipeStepperData;
  /** Step completion handler */
  onStepComplete?: (stepId: string, data: unknown) => void;
  /** Recipe save handler */
  onSave?: (data: RecipeStepperData) => void;
  /** Recipe publish handler */
  onPublish?: (data: RecipeStepperData) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Recipe workflow step data
 */
export interface RecipeWorkflowStep extends StepperStep {
  /** Step category for recipe workflow */
  category: 'basic' | 'ingredients' | 'instructions' | 'details' | 'review';
  /** Form data for this step */
  formData?: Record<string, unknown>;
  /** Whether step requires user input */
  requiresInput?: boolean;
  /** Validation schema for step data */
  validationSchema?: unknown;
}

/**
 * Recipe stepper data context
 */
export interface RecipeStepperData {
  /** Basic recipe information */
  basic?: {
    title?: string;
    description?: string;
    cuisine?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    servings?: number;
  };
  /** Recipe ingredients */
  ingredients?: RecipeIngredient[];
  /** Cooking instructions */
  instructions?: RecipeInstruction[];
  /** Additional recipe details */
  details?: {
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    tags?: string[];
    photos?: string[];
    nutritionInfo?: Record<string, unknown>;
  };
  /** Workflow metadata */
  metadata?: {
    createdAt?: Date;
    lastModified?: Date;
    version?: number;
    isDraft?: boolean;
  };
}

/**
 * Recipe ingredient data structure
 */
export interface RecipeIngredient {
  id?: string;
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
  isOptional?: boolean;
  category?: string;
}

/**
 * Recipe instruction data structure
 */
export interface RecipeInstruction {
  id?: string;
  stepNumber: number;
  instruction: string;
  duration?: number;
  temperature?: number;
  equipment?: string[];
  tips?: string;
  photo?: string;
}

/**
 * Cooking stepper component props
 */
export interface CookingStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Recipe instructions as steps */
  instructions: RecipeInstruction[];
  /** Current instruction step */
  currentStep?: number;
  /** Whether to show timers */
  showTimers?: boolean;
  /** Whether to show ingredient checklist */
  showIngredients?: boolean;
  /** Ingredients for reference */
  ingredients?: RecipeIngredient[];
  /** Timer completion handler */
  onTimerComplete?: (stepNumber: number) => void;
  /** Step completion handler */
  onStepComplete?: (stepNumber: number) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Cooking timer component props
 */
export interface CookingTimerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cookingTimerVariants> {
  /** Timer duration in seconds */
  duration: number;
  /** Timer label */
  label?: string;
  /** Whether timer is running */
  isRunning?: boolean;
  /** Whether timer is paused */
  isPaused?: boolean;
  /** Timer completion handler */
  onComplete?: () => void;
  /** Timer start handler */
  onStart?: () => void;
  /** Timer pause handler */
  onPause?: () => void;
  /** Timer reset handler */
  onReset?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Stepper navigation context
 */
export interface StepperNavigationContext {
  /** Current step information */
  currentStep: StepperStep;
  /** All available steps */
  steps: StepperStep[];
  /** Current step index */
  currentIndex: number;
  /** Whether can go to previous step */
  canGoPrevious: boolean;
  /** Whether can go to next step */
  canGoNext: boolean;
  /** Whether current step can be skipped */
  canSkip: boolean;
  /** Whether on last step */
  isLastStep: boolean;
  /** Whether on first step */
  isFirstStep: boolean;
  /** Navigation functions */
  goToStep: (stepId: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  skipStep: () => void;
  validateStep: () => Promise<boolean>;
}

/**
 * Stepper state management
 */
export interface StepperState {
  /** Currently active step ID */
  currentStepId: string;
  /** Completed step IDs */
  completedSteps: Set<string>;
  /** Steps with errors */
  errorSteps: Set<string>;
  /** Skipped step IDs */
  skippedSteps: Set<string>;
  /** Step form data */
  stepData: Record<string, unknown>;
  /** Whether stepper is loading */
  isLoading: boolean;
  /** Global validation errors */
  errors: Record<string, string>;
}

/**
 * Stepper configuration options
 */
export interface StepperConfig {
  /** Whether to allow non-linear navigation */
  allowNonLinear?: boolean;
  /** Whether to persist state */
  persistState?: boolean;
  /** Storage key for persistence */
  storageKey?: string;
  /** Whether to validate on step change */
  validateOnChange?: boolean;
  /** Whether to auto-save progress */
  autoSave?: boolean;
  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to show progress indicator */
  showProgress?: boolean;
  /** Custom validation debounce delay */
  validationDelay?: number;
}

/**
 * Hook return type for stepper state management
 */
export interface UseStepperReturn {
  /** Current stepper state */
  state: StepperState;
  /** Navigation context */
  navigation: StepperNavigationContext;
  /** State update functions */
  actions: {
    setCurrentStep: (stepId: string) => void;
    markStepComplete: (stepId: string) => void;
    markStepError: (stepId: string, error?: string) => void;
    skipStep: (stepId: string) => void;
    updateStepData: (stepId: string, data: unknown) => void;
    resetStepper: () => void;
    validateAllSteps: () => Promise<boolean>;
  };
}

/**
 * Stepper accessibility props
 */
export interface StepperA11yProps {
  /** ARIA label for the stepper */
  ariaLabel?: string;
  /** Whether to announce step changes */
  announceChanges?: boolean;
  /** Custom step announcement text */
  stepAnnouncementText?: (step: StepperStep, index: number) => string;
  /** Whether to use live regions for updates */
  useLiveRegion?: boolean;
}

/**
 * Common recipe workflow patterns
 */
export type RecipeWorkflowPattern =
  | 'creation' // New recipe creation wizard
  | 'editing' // Edit existing recipe
  | 'cooking' // Step-by-step cooking mode
  | 'planning' // Meal planning workflow
  | 'importing' // Import recipe from URL
  | 'scaling' // Scale recipe for different servings
  | 'shopping'; // Generate shopping list

/**
 * Stepper theme configuration
 */
export interface StepperTheme {
  /** Colors for different states */
  colors: {
    pending: string;
    active: string;
    completed: string;
    error: string;
    skipped: string;
  };
  /** Spacing configuration */
  spacing: {
    stepGap: string;
    contentPadding: string;
    indicatorSize: string;
  };
  /** Animation settings */
  animations: {
    duration: string;
    easing: string;
    enableTransitions: boolean;
  };
}

/**
 * Stepper analytics events
 */
export interface StepperAnalytics {
  /** Track step navigation */
  onStepNavigate?: (
    from: string,
    to: string,
    method: 'click' | 'button' | 'keyboard'
  ) => void;
  /** Track step completion */
  onStepComplete?: (stepId: string, timeSpent: number) => void;
  /** Track step skipping */
  onStepSkip?: (stepId: string, reason?: string) => void;
  /** Track validation errors */
  onValidationError?: (stepId: string, errors: string[]) => void;
  /** Track stepper completion */
  onStepperComplete?: (totalTime: number, stepsCompleted: number) => void;
}
