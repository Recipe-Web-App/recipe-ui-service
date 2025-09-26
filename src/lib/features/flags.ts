/**
 * Feature flags configuration for the application
 * Controls visibility and functionality of various features
 */

/**
 * Environment-based feature flag values
 * Only includes flags that are currently in use - add more as needed
 */
const getEnvironmentFlags = () => ({
  // Development Features
  SHOW_COMPONENTS_DEMO:
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_SHOW_COMPONENTS === 'true',

  // Recipe Features
  ENABLE_RECIPE_CREATION:
    process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION !== 'false', // Default to true

  ENABLE_RECIPE_IMPORT: process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT === 'true',

  // Meal Plan Features
  ENABLE_MEAL_PLANNING:
    process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING !== 'false', // Default to true

  ENABLE_GROCERY_LISTS: process.env.NEXT_PUBLIC_ENABLE_GROCERY_LISTS === 'true',

  // User Features
  ENABLE_USER_PROFILES:
    process.env.NEXT_PUBLIC_ENABLE_USER_PROFILES !== 'false', // Default to true

  ENABLE_SOCIAL_FEATURES:
    process.env.NEXT_PUBLIC_ENABLE_SOCIAL_FEATURES === 'true',

  // Analytics
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
});

/**
 * Runtime feature flag overrides
 * Can be modified during runtime for testing or gradual rollouts
 */
let runtimeOverrides: Partial<FeatureFlags> = {};

/**
 * All available feature flags
 */
export type FeatureFlags = ReturnType<typeof getEnvironmentFlags>;

/**
 * Feature flag keys for type safety
 */
export type FeatureFlagKey = keyof FeatureFlags;

/**
 * Get current feature flags with runtime overrides applied
 */
export const getFeatureFlags = (): FeatureFlags => {
  const environmentFlags = getEnvironmentFlags();
  return {
    ...environmentFlags,
    ...runtimeOverrides,
  };
};

/**
 * Check if a specific feature flag is enabled
 */
export const isFeatureEnabled = (flagKey: FeatureFlagKey): boolean => {
  const flags = getFeatureFlags();
  // ESLint disable: dynamic key access is safe here with FeatureFlagKey constraint
  // eslint-disable-next-line security/detect-object-injection
  return Boolean(flags[flagKey]);
};

/**
 * Check multiple feature flags (all must be enabled)
 */
export const areAllFeaturesEnabled = (
  ...flagKeys: FeatureFlagKey[]
): boolean => {
  return flagKeys.every(key => isFeatureEnabled(key));
};

/**
 * Check multiple feature flags (any can be enabled)
 */
export const isAnyFeatureEnabled = (...flagKeys: FeatureFlagKey[]): boolean => {
  return flagKeys.some(key => isFeatureEnabled(key));
};

/**
 * Set runtime override for a feature flag
 * Useful for testing or gradual rollouts
 */
export const setFeatureFlagOverride = (
  flagKey: FeatureFlagKey,
  value: boolean
): void => {
  runtimeOverrides = {
    ...runtimeOverrides,
    [flagKey]: value,
  };
};

/**
 * Clear runtime override for a feature flag
 */
export const clearFeatureFlagOverride = (flagKey: FeatureFlagKey): void => {
  // ESLint disable: unused destructured variable is intentional pattern for omitting property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [flagKey]: _omitted, ...rest } = runtimeOverrides;
  runtimeOverrides = rest;
};

/**
 * Clear all runtime overrides
 */
export const clearAllFeatureFlagOverrides = (): void => {
  runtimeOverrides = {};
};

/**
 * Get runtime overrides
 */
export const getRuntimeOverrides = (): Partial<FeatureFlags> => {
  return { ...runtimeOverrides };
};

/**
 * Feature flag context for React components
 */
export interface FeatureFlagContext {
  flags: FeatureFlags;
  isEnabled: (flagKey: FeatureFlagKey) => boolean;
  areAllEnabled: (...flagKeys: FeatureFlagKey[]) => boolean;
  isAnyEnabled: (...flagKeys: FeatureFlagKey[]) => boolean;
}

/**
 * Create feature flag context
 */
export const createFeatureFlagContext = (): FeatureFlagContext => ({
  flags: getFeatureFlags(),
  isEnabled: isFeatureEnabled,
  areAllEnabled: areAllFeaturesEnabled,
  isAnyEnabled: isAnyFeatureEnabled,
});

/**
 * Feature flag groups for easier management
 */
export const FeatureFlagGroups = {
  DEVELOPMENT: ['SHOW_COMPONENTS_DEMO'] as const,

  RECIPES: ['ENABLE_RECIPE_CREATION', 'ENABLE_RECIPE_IMPORT'] as const,

  MEAL_PLANNING: ['ENABLE_MEAL_PLANNING', 'ENABLE_GROCERY_LISTS'] as const,

  SOCIAL: ['ENABLE_USER_PROFILES', 'ENABLE_SOCIAL_FEATURES'] as const,

  PERFORMANCE: ['ENABLE_ANALYTICS'] as const,
} as const;

/**
 * Check if all flags in a group are enabled
 */
export const isFeatureGroupEnabled = (
  group: keyof typeof FeatureFlagGroups
): boolean => {
  // ESLint disable: dynamic object access is safe here with type-constrained key
  // eslint-disable-next-line security/detect-object-injection
  const flagKeys = FeatureFlagGroups[group];
  return areAllFeaturesEnabled(...flagKeys);
};

/**
 * Check if any flag in a group is enabled
 */
export const isAnyFeatureInGroupEnabled = (
  group: keyof typeof FeatureFlagGroups
): boolean => {
  // ESLint disable: dynamic object access is safe here with type-constrained key
  // eslint-disable-next-line security/detect-object-injection
  const flagKeys = FeatureFlagGroups[group];
  return isAnyFeatureEnabled(...flagKeys);
};

/**
 * Get enabled flags in a group
 */
export const getEnabledFlagsInGroup = (
  group: keyof typeof FeatureFlagGroups
): FeatureFlagKey[] => {
  // ESLint disable: dynamic object access is safe here with type-constrained key
  // eslint-disable-next-line security/detect-object-injection
  const flagKeys = FeatureFlagGroups[group];
  return flagKeys.filter(key => isFeatureEnabled(key));
};

/**
 * Default export with the most commonly used functions
 */
export const featureFlags = {
  getAll: getFeatureFlags,
  isEnabled: isFeatureEnabled,
  areAllEnabled: areAllFeaturesEnabled,
  isAnyEnabled: isAnyFeatureEnabled,
  setOverride: setFeatureFlagOverride,
  clearOverride: clearFeatureFlagOverride,
  clearAllOverrides: clearAllFeatureFlagOverrides,
  isGroupEnabled: isFeatureGroupEnabled,
  isAnyInGroupEnabled: isAnyFeatureInGroupEnabled,
  getEnabledInGroup: getEnabledFlagsInGroup,
} as const;
