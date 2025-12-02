import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  progressVariants,
  progressBarVariants,
  progressLabelVariants,
  cookingStepVariants,
  stepIndicatorVariants,
  uploadProgressVariants,
  timerProgressVariants,
} from '@/lib/ui/progress-variants';

/**
 * Progress root component props interface
 */
export interface ProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  barVariant?: VariantProps<typeof progressBarVariants>['variant'];
  barAnimation?: VariantProps<typeof progressBarVariants>['animation'];
  barState?: VariantProps<typeof progressBarVariants>['state'];
}

/**
 * Progress root component
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size,
      variant,
      showLabel = false,
      label,
      showPercentage = false,
      barVariant = 'default',
      barAnimation = 'none',
      barState = 'active',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayLabel = label ?? `${Math.round(percentage)}%`;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || showPercentage) && (
          <div
            className={cn(progressLabelVariants({ position: 'side', size }))}
          >
            {showLabel && <span>{displayLabel}</span>}
            {showPercentage && <span>{Math.round(percentage)}%</span>}
          </div>
        )}
        <div className={cn(progressVariants({ size, variant }))}>
          <div
            className={cn(
              progressBarVariants({
                variant: barVariant,
                animation: barAnimation,
                state: barState,
              })
            )}
            style={
              { '--progress-width': `${percentage}%` } as React.CSSProperties
            }
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

/**
 * Cooking step component props interface
 */
export interface CookingStepProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cookingStepVariants> {
  stepNumber: number;
  title: string;
  description?: string;
  duration?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  isSkipped?: boolean;
  icon?: React.ReactNode;
  onStepClick?: () => void;
}

/**
 * Cooking step component for multi-step cooking progress
 */
const CookingStep = React.forwardRef<HTMLDivElement, CookingStepProps>(
  (
    {
      className,
      stepNumber,
      title,
      description,
      duration,
      isActive = false,
      isCompleted = false,
      isSkipped = false,
      icon,
      size,
      onStepClick,
      ...props
    },
    ref
  ) => {
    const getState = () => {
      if (isSkipped) return 'skipped';
      if (isCompleted) return 'completed';
      if (isActive) return 'active';
      return 'pending';
    };

    const getIndicatorContent = () => {
      if (isCompleted) {
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
      if (isSkipped) {
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      }
      return stepNumber;
    };

    return (
      <div
        ref={ref}
        className={cn(
          cookingStepVariants({ state: getState(), size }),
          onStepClick &&
            'cursor-pointer hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
          className
        )}
        onClick={onStepClick}
        onKeyDown={
          onStepClick
            ? e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onStepClick();
                }
              }
            : undefined
        }
        tabIndex={onStepClick ? 0 : undefined}
        role={onStepClick ? 'button' : undefined}
        {...props}
      >
        <div className={cn(stepIndicatorVariants({ state: getState(), size }))}>
          {icon ?? getIndicatorContent()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="truncate font-medium">{title}</h4>
            {duration && (
              <span className="text-text-tertiary ml-2 text-xs">
                {duration}
              </span>
            )}
          </div>
          {description && (
            <p className="text-text-secondary mt-1 text-sm">{description}</p>
          )}
        </div>
      </div>
    );
  }
);
CookingStep.displayName = 'CookingStep';

/**
 * Cooking progress component props interface
 */
export interface CookingProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    duration?: string;
    isCompleted?: boolean;
    isSkipped?: boolean;
  }>;
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  size?: VariantProps<typeof cookingStepVariants>['size'];
}

/**
 * Cooking progress component for tracking recipe preparation
 */
const CookingProgress = React.forwardRef<HTMLDivElement, CookingProgressProps>(
  (
    { className, steps, currentStep, onStepClick, size = 'default', ...props },
    ref
  ) => {
    const completedSteps = steps.filter(step => step.isCompleted).length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Cooking Progress</h3>
            <span className="text-text-secondary text-sm">
              {completedSteps} of {totalSteps} steps
            </span>
          </div>
          <Progress
            value={progressPercentage}
            barVariant="cooking"
            showPercentage
            size="lg"
          />
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <CookingStep
              key={step.id}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              duration={step.duration}
              isActive={index === currentStep}
              isCompleted={step.isCompleted}
              isSkipped={step.isSkipped}
              size={size}
              onStepClick={onStepClick ? () => onStepClick(index) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }
);
CookingProgress.displayName = 'CookingProgress';

/**
 * Upload progress component props interface
 */
export interface UploadProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof uploadProgressVariants> {
  fileName: string;
  fileSize?: string;
  progress: number;
  state?: 'uploading' | 'completed' | 'error' | 'paused';
  speed?: string;
  timeRemaining?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  showDetails?: boolean;
}

/**
 * Upload progress component for file uploads
 */
const UploadProgress = React.forwardRef<HTMLDivElement, UploadProgressProps>(
  (
    {
      className,
      fileName,
      fileSize,
      progress,
      state = 'uploading',
      speed,
      timeRemaining,
      variant,
      onCancel,
      onRetry,
      onPause,
      onResume,
      showDetails = true,
      ...props
    },
    ref
  ) => {
    const getBarVariant = () => {
      switch (state) {
        case 'completed':
          return 'success';
        case 'error':
          return 'error';
        case 'paused':
          return 'warning';
        default:
          return 'upload';
      }
    };

    const getBarAnimation = () => {
      return state === 'uploading' ? 'shimmer' : 'none';
    };

    const getStateIcon = () => {
      switch (state) {
        case 'completed':
          return (
            <svg
              className="text-success h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'error':
          return (
            <svg
              className="text-error h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'paused':
          return (
            <svg
              className="text-warning h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return (
            <svg
              className="text-info h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          );
      }
    };

    return (
      <div
        ref={ref}
        className={cn(uploadProgressVariants({ state, variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{getStateIcon()}</div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-text-primary truncate font-medium">
                {fileName}
              </h4>
              {fileSize && (
                <span className="text-text-tertiary ml-2 text-sm">
                  {fileSize}
                </span>
              )}
            </div>
            <Progress
              value={progress}
              barVariant={getBarVariant()}
              barAnimation={getBarAnimation()}
              showPercentage
              size="sm"
            />
            {showDetails && (
              <div className="text-text-tertiary mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  {speed && <span>Speed: {speed}</span>}
                  {timeRemaining && (
                    <span>Time remaining: {timeRemaining}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {state === 'uploading' && onPause && (
                    <button
                      onClick={onPause}
                      className="text-warning hover:text-warning/80"
                    >
                      Pause
                    </button>
                  )}
                  {state === 'paused' && onResume && (
                    <button
                      onClick={onResume}
                      className="text-info hover:text-info/80"
                    >
                      Resume
                    </button>
                  )}
                  {state === 'error' && onRetry && (
                    <button
                      onClick={onRetry}
                      className="text-info hover:text-info/80"
                    >
                      Retry
                    </button>
                  )}
                  {onCancel && state !== 'completed' && (
                    <button
                      onClick={onCancel}
                      className="text-error hover:text-error/80"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
UploadProgress.displayName = 'UploadProgress';

/**
 * Timer progress component props interface
 */
export interface TimerProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timerProgressVariants> {
  totalTime: number; // in seconds
  remainingTime: number; // in seconds
  isRunning?: boolean;
  isPaused?: boolean;
  onComplete?: () => void;
  showMinutes?: boolean;
  label?: string;
}

/**
 * Timer progress component for cooking timers
 */
const TimerProgress = React.forwardRef<HTMLDivElement, TimerProgressProps>(
  (
    {
      className,
      totalTime,
      remainingTime,
      isRunning = false,
      isPaused = false,
      onComplete,
      showMinutes = true,
      label,
      size,
      ...props
    },
    ref
  ) => {
    const percentage = ((totalTime - remainingTime) / totalTime) * 100;
    const isWarning = remainingTime <= 30 && remainingTime > 0;
    const isCompleted = remainingTime <= 0;

    const getState = () => {
      if (isCompleted) return 'completed';
      if (isWarning) return 'warning';
      if (isPaused) return 'paused';
      return 'running';
    };

    const formatTime = (seconds: number) => {
      if (showMinutes) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
      return seconds.toString();
    };

    React.useEffect(() => {
      if (isCompleted && onComplete) {
        onComplete();
      }
    }, [isCompleted, onComplete]);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center', className)}
        {...props}
      >
        {label && (
          <div
            className={cn(progressLabelVariants({ position: 'above', size }))}
          >
            {label}
          </div>
        )}
        <div className={cn(timerProgressVariants({ state: getState(), size }))}>
          <div className="text-center">
            <div className="font-bold">{formatTime(remainingTime)}</div>
            {showMinutes && (
              <div className="text-xs opacity-75">
                {remainingTime <= 0
                  ? 'Done!'
                  : isRunning
                    ? 'remaining'
                    : 'paused'}
              </div>
            )}
          </div>
          <svg
            className="absolute inset-0 -rotate-90"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              opacity="0.2"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${percentage * 2.89} 289`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>
      </div>
    );
  }
);
TimerProgress.displayName = 'TimerProgress';

export {
  Progress,
  CookingStep,
  CookingProgress,
  UploadProgress,
  TimerProgress,
};
