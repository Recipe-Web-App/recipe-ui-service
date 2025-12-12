'use client';

import * as React from 'react';
import {
  Check,
  X,
  Clock,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  stepperVariants,
  stepperItemVariants,
  stepIndicatorVariants,
  stepConnectorVariants,
  stepHeaderVariants,
  stepTitleVariants,
  stepDescriptionVariants,
  stepContentVariants,
  stepControlsVariants,
  recipeStepperVariants,
  cookingTimerVariants,
} from '@/lib/ui/stepper-variants';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { IconName } from '@/types/ui/icon';
import type {
  StepperProps,
  StepperItemProps,
  StepIndicatorProps,
  StepConnectorProps,
  StepHeaderProps,
  StepContentProps,
  StepControlsProps,
  StepProgressProps,
  RecipeStepperProps,
  CookingStepperProps,
  CookingTimerProps,
  StepperStep,
  StepperState,
  StepperNavigationContext,
} from '@/types/ui/stepper';

/**
 * Stepper Component
 *
 * A multi-step process component for wizards, workflows, and guided experiences.
 * Especially designed for recipe creation, cooking instructions, and meal planning.
 *
 * Features:
 * - Linear and non-linear navigation
 * - Step validation and error handling
 * - Progress tracking and persistence
 * - Recipe-specific workflows
 * - Accessible keyboard navigation
 * - Mobile-responsive design
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      orientation = 'horizontal',
      variant = 'default',
      size = 'default',
      steps,
      currentStep,
      defaultStep,
      showProgress = true,
      allowNonLinear = false,
      persistState = false,
      storageKey = 'stepper-state',
      onStepChange,
      onNavigate,
      onValidateStep,
      controls,
      children,
      ...props
    },
    ref
  ) => {
    // Track previous currentStep prop to detect external changes
    const prevCurrentStepRef = React.useRef(currentStep);

    // State management
    const [state, setState] = React.useState<StepperState>(() => {
      const initialState: StepperState = {
        currentStepId: currentStep ?? defaultStep ?? steps[0]?.id ?? '',
        completedSteps: new Set(),
        errorSteps: new Set(),
        skippedSteps: new Set(),
        stepData: {},
        isLoading: false,
        errors: {},
      };

      // Load persisted state if enabled
      if (persistState && typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsedState = JSON.parse(saved) as {
              currentStepId?: string;
              completedSteps?: string[];
              errorSteps?: string[];
              skippedSteps?: string[];
              stepData?: Record<string, unknown>;
              isLoading?: boolean;
              errors?: Record<string, string>;
            };
            return {
              ...initialState,
              ...parsedState,
              completedSteps: new Set(parsedState.completedSteps ?? []),
              errorSteps: new Set(parsedState.errorSteps ?? []),
              skippedSteps: new Set(parsedState.skippedSteps ?? []),
            };
          }
        } catch (error) {
          console.warn('Failed to load stepper state:', error);
        }
      }

      return initialState;
    });

    // Persist state when it changes
    React.useEffect(() => {
      if (persistState && typeof window !== 'undefined') {
        try {
          const stateToSave = {
            ...state,
            completedSteps: Array.from(state.completedSteps),
            errorSteps: Array.from(state.errorSteps),
            skippedSteps: Array.from(state.skippedSteps),
          };
          localStorage.setItem(storageKey, JSON.stringify(stateToSave));
        } catch (error) {
          console.warn('Failed to save stepper state:', error);
        }
      }
    }, [state, persistState, storageKey]);

    // Sync internal state with controlled currentStep prop
    React.useEffect(() => {
      if (currentStep && currentStep !== prevCurrentStepRef.current) {
        // Find the index of the new current step
        const newStepIndex = steps.findIndex(step => step.id === currentStep);

        // Mark all steps before the current one as completed
        const stepsToComplete = steps
          .slice(0, newStepIndex)
          .map(step => step.id);

        setState(prev => ({
          ...prev,
          currentStepId: currentStep,
          completedSteps: new Set([...prev.completedSteps, ...stepsToComplete]),
        }));
      }
      prevCurrentStepRef.current = currentStep;
    }, [currentStep, steps]);

    // Current step information
    const currentStepIndex = steps.findIndex(
      step => step.id === state.currentStepId
    );
    // eslint-disable-next-line security/detect-object-injection
    const currentStepData = steps[currentStepIndex];

    // Navigation context
    const navigation: StepperNavigationContext = React.useMemo(() => {
      const canGoPrevious = currentStepIndex > 0;
      const canGoNext = currentStepIndex < steps.length - 1;
      const canSkip = currentStepData?.isOptional ?? false;
      const isLastStep = currentStepIndex === steps.length - 1;
      const isFirstStep = currentStepIndex === 0;

      return {
        currentStep: currentStepData,
        steps,
        currentIndex: currentStepIndex,
        canGoPrevious,
        canGoNext,
        canSkip,
        isLastStep,
        isFirstStep,
        goToStep: (stepId: string) => {
          const targetIndex = steps.findIndex(step => step.id === stepId);
          if (targetIndex === -1) return;

          // eslint-disable-next-line security/detect-object-injection
          const targetStep = steps[targetIndex];
          if (!allowNonLinear && !targetStep.isAccessible) return;

          setState(prev => ({ ...prev, currentStepId: stepId }));
          onStepChange?.(stepId, state.currentStepId);
          onNavigate?.(stepId, 'jump');
        },
        goToNext: async () => {
          if (!canGoNext) return;

          // Validate current step if validator provided
          if (onValidateStep) {
            const isValid = await onValidateStep(state.currentStepId);
            if (!isValid) {
              setState(prev => ({
                ...prev,
                errorSteps: new Set([...prev.errorSteps, state.currentStepId]),
              }));
              return;
            }
          }

          // Mark current step as completed
          setState(prev => ({
            ...prev,
            completedSteps: new Set([
              ...prev.completedSteps,
              state.currentStepId,
            ]),
            errorSteps: new Set(
              [...prev.errorSteps].filter(id => id !== state.currentStepId)
            ),
          }));

          const nextStep = steps[currentStepIndex + 1];
          setState(prev => ({ ...prev, currentStepId: nextStep.id }));
          onStepChange?.(nextStep.id, state.currentStepId);
          onNavigate?.(nextStep.id, 'next');
        },
        goToPrevious: () => {
          if (!canGoPrevious) return;

          const previousStep = steps[currentStepIndex - 1];
          setState(prev => ({ ...prev, currentStepId: previousStep.id }));
          onStepChange?.(previousStep.id, state.currentStepId);
          onNavigate?.(previousStep.id, 'previous');
        },
        skipStep: () => {
          if (!canSkip || !canGoNext) return;

          setState(prev => ({
            ...prev,
            skippedSteps: new Set([...prev.skippedSteps, state.currentStepId]),
          }));

          const nextStep = steps[currentStepIndex + 1];
          setState(prev => ({ ...prev, currentStepId: nextStep.id }));
          onStepChange?.(nextStep.id, state.currentStepId);
        },
        validateStep: async () => {
          if (!onValidateStep) return true;
          return await onValidateStep(state.currentStepId);
        },
      };
    }, [
      currentStepIndex,
      currentStepData,
      steps,
      state.currentStepId,
      allowNonLinear,
      onStepChange,
      onNavigate,
      onValidateStep,
    ]);

    // Calculate progress
    const progress =
      ((state.completedSteps.size + state.skippedSteps.size) / steps.length) *
      100;

    return (
      <div
        ref={ref}
        className={cn(
          stepperVariants({ orientation, variant, size }),
          className
        )}
        {...props}
      >
        {/* Progress indicator */}
        {showProgress && (
          <StepProgress
            progress={progress}
            currentStep={currentStepIndex + 1}
            totalSteps={steps.length}
            showStepNumbers={orientation === 'horizontal'}
            className="mb-6"
          />
        )}

        {/* Steps container */}
        <div
          className={cn(
            'flex',
            orientation === 'horizontal'
              ? 'flex-row items-start'
              : 'flex-col space-y-4'
          )}
        >
          {steps.map((step, index) => {
            const isActive = step.id === state.currentStepId;
            const isCompleted = state.completedSteps.has(step.id);
            const hasError = state.errorSteps.has(step.id);
            const isSkipped = state.skippedSteps.has(step.id);
            const showConnector = index < steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <StepperItem
                  step={step}
                  orientation={orientation}
                  size={size}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  hasError={hasError}
                  stepNumber={index + 1}
                  showConnector={showConnector && orientation === 'vertical'}
                  onStepClick={allowNonLinear ? navigation.goToStep : undefined}
                  state={
                    hasError
                      ? 'error'
                      : isSkipped
                        ? 'skipped'
                        : isCompleted
                          ? 'completed'
                          : isActive
                            ? 'active'
                            : 'pending'
                  }
                />

                {/* Horizontal connector */}
                {showConnector && orientation === 'horizontal' && (
                  <StepConnector
                    orientation="horizontal"
                    state={
                      isCompleted || isSkipped
                        ? 'completed'
                        : isActive
                          ? 'active'
                          : 'pending'
                    }
                    className={cn(
                      size === 'sm' ? 'mt-3' : size === 'lg' ? 'mt-5' : 'mt-4'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Active step content */}
        {currentStepData && (
          <StepContent
            orientation={orientation}
            isVisible={true}
            className="mt-6"
          >
            {currentStepData.content}
          </StepContent>
        )}

        {/* Navigation controls */}
        {controls ?? (
          <StepControls
            canGoPrevious={navigation.canGoPrevious}
            canGoNext={navigation.canGoNext}
            canSkip={navigation.canSkip}
            showFinish={navigation.isLastStep}
            onPrevious={navigation.goToPrevious}
            onNext={navigation.goToNext}
            onSkip={navigation.skipStep}
            size={size}
          />
        )}

        {children}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

/**
 * StepperItem Component
 *
 * Individual step display with indicator, title, and description
 */
const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    {
      className,
      orientation = 'horizontal',
      size = 'default',
      state = 'pending',
      step,
      isActive: _isActive,
      isCompleted: _isCompleted,
      hasError: _hasError,
      stepNumber,
      showConnector,
      onStepClick,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (onStepClick && step.isAccessible !== false) {
        onStepClick(step.id);
      }
    };

    const isClickable = onStepClick && step.isAccessible !== false;

    return (
      <div
        ref={ref}
        className={cn(
          stepperItemVariants({ orientation, state, size }),
          isClickable && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={handleClick}
        onKeyDown={e => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={isClickable ? 0 : undefined}
        role={isClickable ? 'button' : undefined}
        {...props}
      >
        {/* Vertical connector (before indicator) */}
        {showConnector && orientation === 'vertical' && (
          <StepConnector
            orientation="vertical"
            state={state}
            className="absolute top-8 left-4 h-8"
          />
        )}

        <StepIndicator
          state={state}
          size={size}
          stepNumber={stepNumber}
          icon={step.icon}
          isClickable={isClickable}
        />

        <StepHeader
          orientation={orientation}
          state={state}
          size={size}
          title={step.title}
          description={step.description}
          estimatedTime={step.estimatedTime}
          isOptional={step.isOptional}
        />
      </div>
    );
  }
);

StepperItem.displayName = 'StepperItem';

/**
 * StepIndicator Component
 *
 * Visual indicator showing step number, icon, or completion state
 */
const StepIndicator = React.forwardRef<HTMLDivElement, StepIndicatorProps>(
  (
    {
      className,
      state = 'pending',
      size = 'default',
      variant = 'numbered',
      stepNumber,
      icon,
      isClickable,
      onClick,
      ...props
    },
    ref
  ) => {
    const getIndicatorContent = () => {
      if (state === 'completed') {
        return <Check className="h-4 w-4" />;
      }

      if (state === 'error') {
        return <X className="h-4 w-4" />;
      }

      if (state === 'skipped') {
        return <MoreHorizontal className="h-4 w-4" />;
      }

      if (icon && variant === 'icon') {
        return <Icon name={icon as IconName} size="sm" />;
      }

      if (variant === 'dotted') {
        return null; // Just the styled circle
      }

      return stepNumber;
    };

    return (
      <div
        ref={ref}
        className={cn(
          stepIndicatorVariants({ state, size, variant }),
          isClickable && 'hover:scale-105',
          className
        )}
        onClick={onClick}
        onKeyDown={e => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        {getIndicatorContent()}
      </div>
    );
  }
);

StepIndicator.displayName = 'StepIndicator';

/**
 * StepConnector Component
 *
 * Visual line connecting steps
 */
const StepConnector = React.forwardRef<HTMLDivElement, StepConnectorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      state = 'pending',
      variant = 'solid',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        stepConnectorVariants({ orientation, state, variant }),
        className
      )}
      {...props}
    />
  )
);

StepConnector.displayName = 'StepConnector';

/**
 * StepHeader Component
 *
 * Step title, description, and metadata
 */
const StepHeader = React.forwardRef<HTMLDivElement, StepHeaderProps>(
  (
    {
      className,
      orientation = 'horizontal',
      state = 'pending',
      size = 'default',
      title,
      description,
      estimatedTime,
      isOptional,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        stepHeaderVariants({ orientation, state, size }),
        className
      )}
      {...props}
    >
      <div className={cn(stepTitleVariants({ size, state }))}>
        {title}
        {isOptional && (
          <span className="text-muted-foreground ml-1 text-xs">(Optional)</span>
        )}
      </div>
      {description && (
        <div
          className={cn(stepDescriptionVariants({ size, state, orientation }))}
        >
          {description}
        </div>
      )}
      {estimatedTime && (
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {estimatedTime}
        </div>
      )}
    </div>
  )
);

StepHeader.displayName = 'StepHeader';

/**
 * StepContent Component
 *
 * Collapsible content area for active step
 */
const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  (
    {
      className,
      orientation = 'horizontal',
      state: _state = 'visible',
      variant = 'default',
      isVisible = true,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        stepContentVariants({
          orientation,
          state: isVisible ? 'visible' : 'hidden',
          variant,
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

StepContent.displayName = 'StepContent';

/**
 * StepControls Component
 *
 * Navigation buttons for stepper
 */
const StepControls = React.forwardRef<HTMLDivElement, StepControlsProps>(
  (
    {
      className,
      alignment = 'between',
      size = 'default',
      canGoPrevious = false,
      canGoNext = true,
      canSkip = false,
      showFinish = false,
      previousText = 'Previous',
      nextText = 'Next',
      skipText = 'Skip',
      finishText = 'Finish',
      onPrevious,
      onNext,
      onSkip,
      onFinish,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(stepControlsVariants({ alignment, size }), className)}
      {...props}
    >
      <div className="flex gap-2">
        {canGoPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            size={size === 'lg' ? 'default' : 'sm'}
          >
            {previousText}
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {canSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            size={size === 'lg' ? 'default' : 'sm'}
          >
            {skipText}
          </Button>
        )}
        {showFinish ? (
          <Button onClick={onFinish} size={size === 'lg' ? 'default' : 'sm'}>
            {finishText}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            size={size === 'lg' ? 'default' : 'sm'}
          >
            {nextText}
          </Button>
        )}
      </div>
    </div>
  )
);

StepControls.displayName = 'StepControls';

/**
 * StepProgress Component
 *
 * Linear progress indicator for stepper
 */
const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  (
    {
      className,
      size = 'default',
      variant = 'default',
      progress,
      currentStep,
      totalSteps,
      showStepNumbers = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'w-full',
        variant === 'default' ? 'mb-6' : variant === 'embedded' ? 'mb-4' : '',
        className
      )}
      {...props}
    >
      {showStepNumbers && currentStep && totalSteps && (
        <div className="mb-2 flex min-w-0 items-center justify-between">
          <span className="text-muted-foreground truncate text-sm">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-muted-foreground ml-2 flex-shrink-0 text-sm">
            {Math.round(progress)}% Complete
          </span>
        </div>
      )}
      <Progress
        value={progress}
        className={cn(
          'bg-muted w-full overflow-hidden rounded-full transition-all duration-300',
          size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2'
        )}
      />
    </div>
  )
);

StepProgress.displayName = 'StepProgress';

/**
 * RecipeStepper Component
 *
 * Specialized stepper for recipe creation and editing workflows
 */
const RecipeStepper = React.forwardRef<HTMLDivElement, RecipeStepperProps>(
  (
    {
      className,
      workflow = 'creation',
      emphasis = 'normal',
      steps,
      currentStep,
      recipeData,
      onStepComplete: _onStepComplete,
      onSave,
      onPublish,
      children,
      ...props
    },
    ref
  ) => {
    const [isDraft, setIsDraft] = React.useState(true);

    return (
      <div
        ref={ref}
        className={cn(recipeStepperVariants({ workflow, emphasis }), className)}
        {...props}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {workflow === 'creation' && 'Create New Recipe'}
            {workflow === 'cooking' && 'Cooking Mode'}
            {workflow === 'planning' && 'Meal Planning'}
            {workflow === 'importing' && 'Import Recipe'}
          </h2>

          {isDraft && (
            <div className="flex items-center gap-2">
              <span className="bg-highlight-light text-warning rounded px-2 py-1 text-xs">
                Draft
              </span>
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSave(recipeData!)}
                >
                  Save Draft
                </Button>
              )}
            </div>
          )}
        </div>

        <Stepper
          steps={steps}
          currentStep={currentStep}
          allowNonLinear={workflow !== 'cooking'}
          persistState={true}
          storageKey={`recipe-${workflow}-stepper`}
          onStepChange={stepId => {
            // Handle step-specific logic
            if (stepId === 'review' && onPublish) {
              setIsDraft(false);
            }
          }}
        />

        {children}
      </div>
    );
  }
);

RecipeStepper.displayName = 'RecipeStepper';

/**
 * CookingStepper Component
 *
 * Specialized stepper for step-by-step cooking instructions
 */
const CookingStepper = React.forwardRef<HTMLDivElement, CookingStepperProps>(
  (
    {
      className,
      instructions,
      currentStep = 0,
      showTimers = true,
      showIngredients = false,
      ingredients,
      onTimerComplete,
      onStepComplete,
      children,
      ...props
    },
    ref
  ) => {
    const steps: StepperStep[] = instructions.map((instruction, index) => ({
      id: `instruction-${index}`,
      title: `Step ${instruction.stepNumber}`,
      description: instruction.instruction,
      estimatedTime: instruction.duration
        ? `${instruction.duration} min`
        : undefined,
      content: (
        <div className="space-y-4">
          <p className="text-base leading-relaxed">{instruction.instruction}</p>

          {instruction.duration && showTimers && (
            <CookingTimer
              duration={instruction.duration * 60}
              label={`Step ${instruction.stepNumber} Timer`}
              onComplete={() => onTimerComplete?.(instruction.stepNumber)}
            />
          )}

          {instruction.equipment && instruction.equipment.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Equipment needed:</h4>
              <ul className="text-muted-foreground list-inside list-disc text-sm">
                {instruction.equipment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {instruction.tips && (
            <div className="border-info/20 bg-highlight-light rounded border-l-4 p-3">
              <p className="text-info text-sm">
                <strong>Tip:</strong> {instruction.tips}
              </p>
            </div>
          )}
        </div>
      ),
    }));

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {showIngredients && ingredients && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="mb-3 font-medium">Ingredients Checklist</h3>
            <div className="grid gap-2">
              {ingredients.map((ingredient, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <Stepper
          steps={steps}
          // eslint-disable-next-line security/detect-object-injection
          currentStep={steps[currentStep]?.id}
          orientation="vertical"
          variant="elevated"
          allowNonLinear={true}
          onStepChange={stepId => {
            const stepIndex = parseInt(stepId.split('-')[1]);
            onStepComplete?.(stepIndex);
          }}
        />

        {children}
      </div>
    );
  }
);

CookingStepper.displayName = 'CookingStepper';

/**
 * CookingTimer Component
 *
 * Timer for cooking steps with play/pause/reset controls
 */
const CookingTimer = React.forwardRef<HTMLDivElement, CookingTimerProps>(
  (
    {
      className,
      state = 'idle',
      duration,
      label,
      isRunning: _isRunning = false,
      isPaused: _isPaused = false,
      onComplete,
      onStart,
      onPause,
      onReset,
      ...props
    },
    ref
  ) => {
    const [timeLeft, setTimeLeft] = React.useState(duration);
    const [timerState, setTimerState] = React.useState<
      'idle' | 'running' | 'paused' | 'completed' | 'expired'
    >(state ?? 'idle');
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      if (timerState === 'running' && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setTimerState('completed');
              onComplete?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [timerState, timeLeft, onComplete]);

    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
      setTimerState('running');
      onStart?.();
    };

    const handlePause = () => {
      setTimerState('paused');
      onPause?.();
    };

    const handleReset = () => {
      setTimerState('idle');
      setTimeLeft(duration);
      onReset?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          cookingTimerVariants({ state: timerState }),
          'flex items-center justify-between rounded-lg p-3',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg font-medium">
              {formatTime(timeLeft)}
            </span>
          </div>
          {label && <span className="text-sm font-medium">{label}</span>}
        </div>

        <div className="flex items-center gap-1">
          {timerState === 'idle' || timerState === 'paused' ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleStart}
              className="h-8 w-8 p-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePause}
              className="h-8 w-8 p-0"
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
);

CookingTimer.displayName = 'CookingTimer';

export {
  Stepper,
  StepperItem,
  StepIndicator,
  StepConnector,
  StepHeader,
  StepContent,
  StepControls,
  StepProgress,
  RecipeStepper,
  CookingStepper,
  CookingTimer,
};

export type {
  StepperProps,
  StepperItemProps,
  StepIndicatorProps,
  StepConnectorProps,
  StepHeaderProps,
  StepContentProps,
  StepControlsProps,
  StepProgressProps,
  RecipeStepperProps,
  CookingStepperProps,
  CookingTimerProps,
};
