'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderLabelVariants,
  sliderValueVariants,
  sliderTickVariants,
  sliderStepLabelVariants,
} from '@/lib/ui/slider-variants';

/**
 * Base Slider component props interface
 */
export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants>,
    VariantProps<typeof sliderTrackVariants>,
    VariantProps<typeof sliderRangeVariants> {
  // Core slider props
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;

  // Styling variants
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  gradient?: boolean;

  // Display options
  label?: string;
  showValue?: boolean;
  valuePosition?: 'tooltip' | 'inline' | 'bottom' | 'floating';
  showTicks?: boolean;
  tickPosition?: 'above' | 'below' | 'center';
  showStepLabels?: boolean;
  stepLabels?: string[];
  formatValue?: (value: number) => string;

  // Interactive options
  interactive?: boolean;
  inverted?: boolean;

  // Recipe-specific props
  unit?: string;
  precision?: number;
}

/**
 * Core Slider component
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      size = 'default',
      variant = 'default',
      gradient = false,
      label,
      showValue = false,
      valuePosition = 'inline',
      showTicks = false,
      tickPosition = 'below',
      showStepLabels = false,
      stepLabels,
      formatValue,
      unit,
      precision = 0,
      interactive = true,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      inverted = false,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? value ?? [min]
    );

    const currentValue = React.useMemo(
      () => value ?? internalValue,
      [value, internalValue]
    );

    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        // Always update internal state for smooth visual feedback
        setInternalValue(newValue);

        // For uncontrolled components, call onChange immediately
        // For controlled components, skip during drag (let onValueCommit handle it)
        if (!value && onValueChange) {
          onValueChange(newValue);
        }
      },
      [onValueChange, value]
    );

    const handleValueCommit = React.useCallback(
      (newValue: number[]) => {
        // For controlled components, update parent state on mouse release
        if (value && onValueChange) {
          onValueChange(newValue);
        }
      },
      [onValueChange, value]
    );

    const formatDisplayValue = React.useCallback(
      (val: number) => {
        const formatted = formatValue
          ? formatValue(val)
          : val.toFixed(precision);
        return unit ? `${formatted}${unit}` : formatted;
      },
      [formatValue, unit, precision]
    );

    // Generate tick marks
    const ticks = React.useMemo(() => {
      if (!showTicks && !showStepLabels) return [];
      const numTicks = Math.floor((max - min) / step) + 1;
      return Array.from({ length: numTicks }, (_, i) => min + i * step);
    }, [showTicks, showStepLabels, min, max, step]);

    // Generate step labels
    const displayStepLabels = React.useMemo(() => {
      if (!showStepLabels) return [];
      if (stepLabels) return stepLabels;
      return ticks.map(tick => formatDisplayValue(tick));
    }, [showStepLabels, stepLabels, ticks, formatDisplayValue]);

    return (
      <div
        className={cn(
          'space-y-2',
          orientation === 'vertical' ? 'flex flex-col items-center' : ''
        )}
      >
        {/* Label */}
        {label && (
          <label
            className={cn(
              sliderLabelVariants({
                size,
                position: orientation === 'vertical' ? 'left' : 'top',
              })
            )}
          >
            {label}
          </label>
        )}

        {/* Inline value display (outside of label) */}
        {showValue && valuePosition === 'inline' && !label && (
          <div
            className={cn(
              sliderValueVariants({
                position: 'inline',
                variant,
                size,
              })
            )}
          >
            {internalValue.map(val => formatDisplayValue(val)).join(' - ')}
          </div>
        )}

        {/* Inline value display with label */}
        {showValue && valuePosition === 'inline' && label && (
          <div className="flex items-center justify-between">
            <span />
            <span
              className={cn(
                sliderValueVariants({
                  position: 'inline',
                  variant,
                  size,
                })
              )}
            >
              {internalValue.map(val => formatDisplayValue(val)).join(' - ')}
            </span>
          </div>
        )}

        {/* Slider Container */}
        <div className="relative">
          <SliderPrimitive.Root
            ref={ref}
            className={cn(
              sliderVariants({
                orientation,
                size,
                disabled,
              }),
              className
            )}
            orientation={orientation}
            value={value ? internalValue : currentValue}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            inverted={inverted}
            aria-disabled={disabled ? 'true' : 'false'}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            {...props}
          >
            {/* Track */}
            <SliderPrimitive.Track
              className={cn(
                sliderTrackVariants({
                  orientation,
                  size,
                  variant,
                })
              )}
            >
              {/* Range (filled portion) */}
              <SliderPrimitive.Range
                className={cn(
                  sliderRangeVariants({
                    orientation,
                    variant,
                    gradient,
                  })
                )}
              />
            </SliderPrimitive.Track>

            {/* Thumbs */}
            {internalValue.map((_, index) => (
              <SliderPrimitive.Thumb
                key={`thumb-${index}`}
                className={cn(
                  sliderThumbVariants({
                    size,
                    variant,
                    interactive,
                  })
                )}
                aria-label={
                  ariaLabel || ariaLabelledby
                    ? undefined
                    : `Slider thumb ${index + 1}`
                }
              >
                {/* Tooltip value */}
                {showValue && valuePosition === 'tooltip' && (
                  <div
                    className={cn(
                      sliderValueVariants({
                        position: 'tooltip',
                        variant,
                        size,
                      })
                    )}
                  >
                    {}
                    {formatDisplayValue(internalValue.at(index) ?? 0)}
                  </div>
                )}
                {showValue && valuePosition === 'floating' && (
                  <div
                    className={cn(
                      sliderValueVariants({
                        position: 'floating',
                        variant,
                        size,
                      })
                    )}
                  >
                    {}
                    {formatDisplayValue(internalValue.at(index) ?? 0)}
                  </div>
                )}
              </SliderPrimitive.Thumb>
            ))}

            {/* Tick marks */}
            {showTicks &&
              ticks.map((tick, index) => {
                const percentage = ((tick - min) / (max - min)) * 100;
                return (
                  <div
                    key={`tick-${tick}-${index}`}
                    className={cn(
                      sliderTickVariants({
                        orientation,
                        size,
                        position: tickPosition,
                      })
                    )}
                    style={{
                      [orientation === 'horizontal' ? 'left' : 'bottom']:
                        `${percentage}%`,
                    }}
                  />
                );
              })}

            {/* Step labels */}
            {showStepLabels &&
              displayStepLabels.map((label, index) => {
                if (index >= ticks.length) return null;
                /* eslint-disable-next-line security/detect-object-injection */
                const tick = ticks[index];
                if (tick === undefined) return null;
                const percentage = ((tick - min) / (max - min)) * 100;
                return (
                  <div
                    key={`step-label-${label}-${index}`}
                    className={cn(
                      sliderStepLabelVariants({
                        orientation,
                        position: tickPosition === 'above' ? 'above' : 'below',
                      })
                    )}
                    style={{
                      [orientation === 'horizontal' ? 'left' : 'bottom']:
                        `${percentage}%`,
                    }}
                  >
                    {label}
                  </div>
                );
              })}
          </SliderPrimitive.Root>
        </div>

        {/* Bottom value display */}
        {showValue && valuePosition === 'bottom' && (
          <div
            className={cn(
              sliderValueVariants({
                position: 'bottom',
                variant,
                size,
              })
            )}
          >
            {internalValue.map(val => formatDisplayValue(val)).join(' - ')}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

/**
 * Range Slider component for selecting a range of values
 */
export interface RangeSliderProps
  extends Omit<SliderProps, 'value' | 'defaultValue' | 'onValueChange'> {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  minDistance?: number;
}

const RangeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(
  (
    {
      value,
      defaultValue = [25, 75],
      onValueChange,
      minDistance = 1,
      min = 0,
      max = 100,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] =
      React.useState<[number, number]>(defaultValue);

    const currentValue = value ?? internalValue;
    const isControlled = value !== undefined;

    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        const [newMin, newMax] = newValue as [number, number];

        // Ensure minimum distance between values
        let adjustedMin = newMin;
        let adjustedMax = newMax;

        if (newMax - newMin < minDistance) {
          if (newValue.length === 2) {
            // Determine which thumb was moved
            const [oldMin, oldMax] = currentValue;
            if (Math.abs(newMin - oldMin) > Math.abs(newMax - oldMax)) {
              // Min thumb was moved
              adjustedMax = Math.min(max, newMin + minDistance);
            } else {
              // Max thumb was moved
              adjustedMin = Math.max(min, newMax - minDistance);
            }
          }
        }

        const finalValue: [number, number] = [adjustedMin, adjustedMax];

        if (!isControlled) {
          setInternalValue(finalValue);
        }
        onValueChange?.(finalValue);
      },
      [isControlled, onValueChange, minDistance, currentValue, min, max]
    );

    return (
      <Slider
        ref={ref}
        value={currentValue}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        {...props}
      />
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

/**
 * Recipe-specific sliders
 */

/**
 * Temperature Slider for cooking temperatures
 */
export interface TemperatureSliderProps
  extends Omit<SliderProps, 'min' | 'max' | 'step' | 'unit'> {
  temperatureUnit?: 'C' | 'F';
  min?: number;
  max?: number;
}

const TemperatureSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  TemperatureSliderProps
>(
  (
    {
      temperatureUnit = 'C',
      min = temperatureUnit === 'C' ? 50 : 120,
      max = temperatureUnit === 'C' ? 250 : 480,
      variant = 'warning',
      ...props
    },
    ref
  ) => {
    const step = 1;
    return (
      <Slider
        ref={ref}
        min={min}
        max={max}
        step={step}
        unit={`°${temperatureUnit}`}
        variant={variant}
        {...props}
      />
    );
  }
);

TemperatureSlider.displayName = 'TemperatureSlider';

/**
 * Time Slider for cooking times
 */
export interface TimeSliderProps
  extends Omit<SliderProps, 'min' | 'max' | 'step' | 'formatValue'> {
  timeUnit?: 'minutes' | 'hours';
  maxTime?: number;
}

const TimeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  TimeSliderProps
>(
  (
    {
      timeUnit = 'minutes',
      maxTime = timeUnit === 'minutes' ? 180 : 8,
      variant = 'info',
      ...props
    },
    ref
  ) => {
    const step = timeUnit === 'minutes' ? 1 : 0.1;
    const formatTimeValue = React.useCallback(
      (value: number) => {
        if (timeUnit === 'hours') {
          const hours = Math.floor(value);
          const minutes = Math.round((value - hours) * 60);
          if (minutes === 0) {
            return `${hours}h`;
          }
          return `${hours}h ${minutes}m`;
        }
        return `${value}min`;
      },
      [timeUnit]
    );

    return (
      <Slider
        ref={ref}
        min={0}
        max={maxTime}
        step={step}
        formatValue={formatTimeValue}
        variant={variant}
        precision={timeUnit === 'hours' ? 1 : 0}
        {...props}
      />
    );
  }
);

TimeSlider.displayName = 'TimeSlider';

/**
 * Serving Size Slider for recipe portions
 */
export interface ServingSizeSliderProps
  extends Omit<SliderProps, 'min' | 'max' | 'step' | 'unit'> {
  maxServings?: number;
}

const ServingSizeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  ServingSizeSliderProps
>(({ maxServings = 12, variant = 'success', ...props }, ref) => {
  const step = 1;
  const formatServingValue = React.useCallback((value: number) => {
    return value === 1 ? '1 serving' : `${value} servings`;
  }, []);

  return (
    <Slider
      ref={ref}
      min={1}
      max={maxServings}
      step={step}
      formatValue={formatServingValue}
      variant={variant}
      {...props}
    />
  );
});

ServingSizeSlider.displayName = 'ServingSizeSlider';

/**
 * Difficulty Slider for recipe complexity
 */
export interface DifficultySliderProps
  extends Omit<
    SliderProps,
    'min' | 'max' | 'step' | 'formatValue' | 'stepLabels'
  > {
  showLabels?: boolean;
}

const DifficultySlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  DifficultySliderProps
>(({ showLabels = true, variant = 'warning', ...props }, ref) => {
  const difficultyLabels = React.useMemo(
    () => ['Easy', 'Medium', 'Hard', 'Expert'],
    []
  );

  const formatDifficultyValue = React.useCallback(
    (value: number) => {
      return difficultyLabels[value - 1] ?? 'Easy';
    },
    [difficultyLabels]
  );

  return (
    <Slider
      ref={ref}
      min={1}
      max={4}
      step={1}
      formatValue={formatDifficultyValue}
      stepLabels={showLabels ? difficultyLabels : undefined}
      showStepLabels={showLabels}
      showTicks={showLabels}
      variant={variant}
      {...props}
    />
  );
});

DifficultySlider.displayName = 'DifficultySlider';

export {
  Slider,
  RangeSlider,
  TemperatureSlider,
  TimeSlider,
  ServingSizeSlider,
  DifficultySlider,
};
