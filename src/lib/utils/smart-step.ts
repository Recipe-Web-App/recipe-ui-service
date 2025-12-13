/**
 * Smart Step Utility
 *
 * Provides intelligent step calculation for numeric inputs based on the current value.
 * Allows for finer control at smaller values and coarser control at larger values.
 */

/**
 * Configuration for smart stepping behavior
 */
export interface SmartStepConfig {
  /** Step value for small values (value < smallThreshold) */
  smallStep: number;
  /** Step value for medium values (smallThreshold <= value < largeThreshold) */
  mediumStep: number;
  /** Step value for large values (value >= largeThreshold) */
  largeStep: number;
  /** Threshold between small and medium (default: 10) */
  smallThreshold: number;
  /** Threshold between medium and large (default: 100) */
  largeThreshold: number;
}

/**
 * Default smart step configuration
 * - 0.25 for values < 10
 * - 0.5 for values 10-100
 * - 1 for values > 100
 */
export const DEFAULT_SMART_STEP_CONFIG: SmartStepConfig = {
  smallStep: 0.25,
  mediumStep: 0.5,
  largeStep: 1,
  smallThreshold: 10,
  largeThreshold: 100,
};

/**
 * Gets the appropriate step value based on the current value
 *
 * @param value - The current numeric value
 * @param config - Optional custom configuration
 * @returns The step value to use for increment/decrement
 */
export function getSmartStep(
  value: number,
  config: SmartStepConfig = DEFAULT_SMART_STEP_CONFIG
): number {
  const { smallStep, mediumStep, largeStep, smallThreshold, largeThreshold } =
    config;

  if (value < smallThreshold) {
    return smallStep;
  }

  if (value < largeThreshold) {
    return mediumStep;
  }

  return largeStep;
}

/**
 * Rounds a number to a specified precision to avoid floating-point errors
 *
 * @param value - The number to round
 * @param precision - The number of decimal places (default: 2)
 * @returns The rounded number
 *
 * @example
 * roundToPrecision(0.1 + 0.2, 2) // Returns 0.3, not 0.30000000000000004
 */
export function roundToPrecision(value: number, precision: number = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

/**
 * Snaps a value to the nearest step multiple (rounding up for increment, down for decrement)
 *
 * @param value - The current value
 * @param step - The step size to snap to
 * @param direction - 'up' to snap to next step, 'down' to snap to previous step
 * @param precision - Decimal precision (default: 2)
 * @returns The snapped value
 *
 * @example
 * snapToStep(0.01, 0.25, 'up', 2)   // Returns 0.25
 * snapToStep(0.26, 0.25, 'up', 2)   // Returns 0.5
 * snapToStep(0.26, 0.25, 'down', 2) // Returns 0.25
 */
export function snapToStep(
  value: number,
  step: number,
  direction: 'up' | 'down',
  precision: number = 2
): number {
  if (direction === 'up') {
    // Snap up: ceil to next step multiple
    const snapped = Math.ceil(value / step) * step;
    // If already on a step, go to next one
    if (
      roundToPrecision(snapped, precision) ===
      roundToPrecision(value, precision)
    ) {
      return roundToPrecision(snapped + step, precision);
    }
    return roundToPrecision(snapped, precision);
  } else {
    // Snap down: floor to previous step multiple
    const snapped = Math.floor(value / step) * step;
    // If already on a step, go to previous one
    if (
      roundToPrecision(snapped, precision) ===
      roundToPrecision(value, precision)
    ) {
      return roundToPrecision(snapped - step, precision);
    }
    return roundToPrecision(snapped, precision);
  }
}

/**
 * Increments a value using smart stepping with snap-to-step behavior
 *
 * When the current value is not on a step boundary (e.g., 0.01 with step 0.25),
 * the value snaps up to the next step multiple (0.25) instead of just adding the step.
 *
 * @param value - The current value
 * @param max - Maximum allowed value
 * @param config - Optional custom configuration
 * @param precision - Decimal precision (default: 2)
 * @returns The new incremented value, snapped to step boundary
 *
 * @example
 * incrementValue(0.01, 100)  // Returns 0.25 (snaps to step)
 * incrementValue(0.25, 100)  // Returns 0.5 (already on step, goes to next)
 * incrementValue(0.26, 100)  // Returns 0.5 (snaps to next step)
 */
export function incrementValue(
  value: number,
  max: number,
  config: SmartStepConfig = DEFAULT_SMART_STEP_CONFIG,
  precision: number = 2
): number {
  const step = getSmartStep(value, config);
  const newValue = snapToStep(value, step, 'up', precision);
  return Math.min(newValue, max);
}

/**
 * Decrements a value using smart stepping with snap-to-step behavior
 *
 * When the current value is not on a step boundary (e.g., 0.26 with step 0.25),
 * the value snaps down to the previous step multiple (0.25) instead of just subtracting the step.
 *
 * @param value - The current value
 * @param min - Minimum allowed value
 * @param config - Optional custom configuration
 * @param precision - Decimal precision (default: 2)
 * @returns The new decremented value, snapped to step boundary
 *
 * @example
 * decrementValue(0.26, 0.01)  // Returns 0.25 (snaps to step)
 * decrementValue(0.25, 0.01)  // Returns 0 (already on step, goes to previous)
 * decrementValue(0.51, 0.01)  // Returns 0.5 (snaps to previous step)
 */
export function decrementValue(
  value: number,
  min: number,
  config: SmartStepConfig = DEFAULT_SMART_STEP_CONFIG,
  precision: number = 2
): number {
  const step = getSmartStep(value, config);
  const newValue = snapToStep(value, step, 'down', precision);
  return Math.max(newValue, min);
}
