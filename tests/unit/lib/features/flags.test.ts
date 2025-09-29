/**
 * @jest-environment node
 */
import {
  getFeatureFlags,
  isFeatureEnabled,
  areAllFeaturesEnabled,
  isAnyFeatureEnabled,
  setFeatureFlagOverride,
  clearFeatureFlagOverride,
  clearAllFeatureFlagOverrides,
  getRuntimeOverrides,
  createFeatureFlagContext,
  isFeatureGroupEnabled,
  isAnyFeatureInGroupEnabled,
  getEnabledFlagsInGroup,
  featureFlags,
  type FeatureFlagKey,
} from '@/lib/features/flags';

describe('Feature Flags', () => {
  // Save original env
  const originalEnv = process.env;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Reset environment for each test
    process.env = { ...originalEnv };
    // Clear any runtime overrides
    clearAllFeatureFlagOverrides();
  });

  afterEach(() => {
    // Restore NODE_ENV specifically
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true,
      writable: true,
      enumerable: true,
    });
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe('getFeatureFlags', () => {
    it('should return all feature flags with default values', () => {
      const flags = getFeatureFlags();

      expect(flags).toHaveProperty('SHOW_COMPONENTS_DEMO');
      expect(flags).toHaveProperty('ENABLE_RECIPE_CREATION');
      expect(flags).toHaveProperty('ENABLE_RECIPE_IMPORT');
      expect(flags).toHaveProperty('ENABLE_MEAL_PLANNING');
      expect(flags).toHaveProperty('ENABLE_GROCERY_LISTS');
      expect(flags).toHaveProperty('ENABLE_USER_PROFILES');
      expect(flags).toHaveProperty('ENABLE_SOCIAL_FEATURES');
      expect(flags).toHaveProperty('ENABLE_ANALYTICS');
    });

    it('should respect environment variables', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
        writable: true,
        enumerable: true,
      });
      process.env.NEXT_PUBLIC_SHOW_COMPONENTS = 'true';
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'true';
      process.env.NEXT_PUBLIC_ENABLE_GROCERY_LISTS = 'true';
      process.env.NEXT_PUBLIC_ENABLE_SOCIAL_FEATURES = 'true';
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';

      const flags = getFeatureFlags();

      expect(flags.SHOW_COMPONENTS_DEMO).toBe(true);
      expect(flags.ENABLE_RECIPE_IMPORT).toBe(true);
      expect(flags.ENABLE_GROCERY_LISTS).toBe(true);
      expect(flags.ENABLE_SOCIAL_FEATURES).toBe(true);
      expect(flags.ENABLE_ANALYTICS).toBe(true);
    });

    it('should use default values when environment variables are not set', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
        writable: true,
        enumerable: true,
      });
      delete process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION;
      delete process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING;
      delete process.env.NEXT_PUBLIC_ENABLE_USER_PROFILES;

      const flags = getFeatureFlags();

      // These default to true
      expect(flags.ENABLE_RECIPE_CREATION).toBe(true);
      expect(flags.ENABLE_MEAL_PLANNING).toBe(true);
      expect(flags.ENABLE_USER_PROFILES).toBe(true);

      // These default to false
      expect(flags.ENABLE_RECIPE_IMPORT).toBe(false);
      expect(flags.ENABLE_GROCERY_LISTS).toBe(false);
      expect(flags.ENABLE_SOCIAL_FEATURES).toBe(false);
      expect(flags.ENABLE_ANALYTICS).toBe(false);
    });

    it('should disable default-true flags when explicitly set to false', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'false';
      process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING = 'false';
      process.env.NEXT_PUBLIC_ENABLE_USER_PROFILES = 'false';

      const flags = getFeatureFlags();

      expect(flags.ENABLE_RECIPE_CREATION).toBe(false);
      expect(flags.ENABLE_MEAL_PLANNING).toBe(false);
      expect(flags.ENABLE_USER_PROFILES).toBe(false);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled features', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
        writable: true,
        enumerable: true,
      });

      expect(isFeatureEnabled('SHOW_COMPONENTS_DEMO')).toBe(true);
    });

    it('should return false for disabled features', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
        writable: true,
        enumerable: true,
      });
      delete process.env.NEXT_PUBLIC_SHOW_COMPONENTS;

      expect(isFeatureEnabled('SHOW_COMPONENTS_DEMO')).toBe(false);
    });

    it('should respect runtime overrides', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        configurable: true,
        writable: true,
        enumerable: true,
      });

      expect(isFeatureEnabled('SHOW_COMPONENTS_DEMO')).toBe(false);

      setFeatureFlagOverride('SHOW_COMPONENTS_DEMO', true);
      expect(isFeatureEnabled('SHOW_COMPONENTS_DEMO')).toBe(true);
    });
  });

  describe('areAllFeaturesEnabled', () => {
    it('should return true when all features are enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
      process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING = 'true';

      expect(
        areAllFeaturesEnabled('ENABLE_RECIPE_CREATION', 'ENABLE_MEAL_PLANNING')
      ).toBe(true);
    });

    it('should return false when any feature is disabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
      process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING = 'false';

      expect(
        areAllFeaturesEnabled('ENABLE_RECIPE_CREATION', 'ENABLE_MEAL_PLANNING')
      ).toBe(false);
    });

    it('should return true for empty array', () => {
      expect(areAllFeaturesEnabled()).toBe(true);
    });
  });

  describe('isAnyFeatureEnabled', () => {
    it('should return true when any feature is enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

      expect(
        isAnyFeatureEnabled('ENABLE_RECIPE_CREATION', 'ENABLE_RECIPE_IMPORT')
      ).toBe(true);
    });

    it('should return false when all features are disabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';
      process.env.NEXT_PUBLIC_ENABLE_GROCERY_LISTS = 'false';

      expect(
        isAnyFeatureEnabled('ENABLE_RECIPE_IMPORT', 'ENABLE_GROCERY_LISTS')
      ).toBe(false);
    });

    it('should return false for empty array', () => {
      expect(isAnyFeatureEnabled()).toBe(false);
    });
  });

  describe('Runtime Overrides', () => {
    it('should set and get runtime overrides', () => {
      setFeatureFlagOverride('ENABLE_ANALYTICS', true);

      const overrides = getRuntimeOverrides();
      expect(overrides).toEqual({ ENABLE_ANALYTICS: true });
    });

    it('should override environment values', () => {
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'false';

      expect(isFeatureEnabled('ENABLE_ANALYTICS')).toBe(false);

      setFeatureFlagOverride('ENABLE_ANALYTICS', true);
      expect(isFeatureEnabled('ENABLE_ANALYTICS')).toBe(true);
    });

    it('should clear specific override', () => {
      setFeatureFlagOverride('ENABLE_ANALYTICS', true);
      setFeatureFlagOverride('ENABLE_RECIPE_IMPORT', true);

      clearFeatureFlagOverride('ENABLE_ANALYTICS');

      const overrides = getRuntimeOverrides();
      expect(overrides).toEqual({ ENABLE_RECIPE_IMPORT: true });
    });

    it('should clear all overrides', () => {
      setFeatureFlagOverride('ENABLE_ANALYTICS', true);
      setFeatureFlagOverride('ENABLE_RECIPE_IMPORT', true);

      clearAllFeatureFlagOverrides();

      const overrides = getRuntimeOverrides();
      expect(overrides).toEqual({});
    });

    it('should handle multiple override operations', () => {
      setFeatureFlagOverride('ENABLE_ANALYTICS', true);
      setFeatureFlagOverride('ENABLE_ANALYTICS', false);

      expect(isFeatureEnabled('ENABLE_ANALYTICS')).toBe(false);
    });
  });

  describe('createFeatureFlagContext', () => {
    it('should create a context with all necessary methods', () => {
      const context = createFeatureFlagContext();

      expect(context).toHaveProperty('flags');
      expect(context).toHaveProperty('isEnabled');
      expect(context).toHaveProperty('areAllEnabled');
      expect(context).toHaveProperty('isAnyEnabled');
    });

    it('should provide working methods in context', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

      const context = createFeatureFlagContext();

      expect(context.isEnabled('ENABLE_RECIPE_CREATION')).toBe(true);
      expect(context.isEnabled('ENABLE_RECIPE_IMPORT')).toBe(false);

      expect(
        context.areAllEnabled('ENABLE_RECIPE_CREATION', 'ENABLE_MEAL_PLANNING')
      ).toBe(true);

      expect(
        context.isAnyEnabled('ENABLE_RECIPE_IMPORT', 'ENABLE_RECIPE_CREATION')
      ).toBe(true);
    });
  });

  describe('Feature Flag Groups', () => {
    describe('isFeatureGroupEnabled', () => {
      it('should return true when all flags in group are enabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'true';

        expect(isFeatureGroupEnabled('RECIPES')).toBe(true);
      });

      it('should return false when any flag in group is disabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

        expect(isFeatureGroupEnabled('RECIPES')).toBe(false);
      });

      it('should work with DEVELOPMENT group', () => {
        Object.defineProperty(process.env, 'NODE_ENV', {
          value: 'development',
          configurable: true,
          writable: true,
          enumerable: true,
        });
        expect(isFeatureGroupEnabled('DEVELOPMENT')).toBe(true);

        Object.defineProperty(process.env, 'NODE_ENV', {
          value: 'production',
          configurable: true,
          writable: true,
          enumerable: true,
        });
        delete process.env.NEXT_PUBLIC_SHOW_COMPONENTS;
        expect(isFeatureGroupEnabled('DEVELOPMENT')).toBe(false);
      });
    });

    describe('isAnyFeatureInGroupEnabled', () => {
      it('should return true when any flag in group is enabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

        expect(isAnyFeatureInGroupEnabled('RECIPES')).toBe(true);
      });

      it('should return false when all flags in group are disabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'false';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

        expect(isAnyFeatureInGroupEnabled('RECIPES')).toBe(false);
      });
    });

    describe('getEnabledFlagsInGroup', () => {
      it('should return only enabled flags in group', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

        const enabledFlags = getEnabledFlagsInGroup('RECIPES');
        expect(enabledFlags).toEqual(['ENABLE_RECIPE_CREATION']);
      });

      it('should return empty array when no flags are enabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'false';
        process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = 'false';

        const enabledFlags = getEnabledFlagsInGroup('RECIPES');
        expect(enabledFlags).toEqual([]);
      });

      it('should return all flags when all are enabled', () => {
        process.env.NEXT_PUBLIC_ENABLE_MEAL_PLANNING = 'true';
        process.env.NEXT_PUBLIC_ENABLE_GROCERY_LISTS = 'true';

        const enabledFlags = getEnabledFlagsInGroup('MEAL_PLANNING');
        expect(enabledFlags).toEqual([
          'ENABLE_MEAL_PLANNING',
          'ENABLE_GROCERY_LISTS',
        ]);
      });
    });
  });

  describe('featureFlags default export', () => {
    it('should provide all necessary methods', () => {
      expect(featureFlags).toHaveProperty('getAll');
      expect(featureFlags).toHaveProperty('isEnabled');
      expect(featureFlags).toHaveProperty('areAllEnabled');
      expect(featureFlags).toHaveProperty('isAnyEnabled');
      expect(featureFlags).toHaveProperty('setOverride');
      expect(featureFlags).toHaveProperty('clearOverride');
      expect(featureFlags).toHaveProperty('clearAllOverrides');
      expect(featureFlags).toHaveProperty('isGroupEnabled');
      expect(featureFlags).toHaveProperty('isAnyInGroupEnabled');
      expect(featureFlags).toHaveProperty('getEnabledInGroup');
    });

    it('should have working methods', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';

      const flags = featureFlags.getAll();
      expect(flags.ENABLE_RECIPE_CREATION).toBe(true);

      expect(featureFlags.isEnabled('ENABLE_RECIPE_CREATION')).toBe(true);

      featureFlags.setOverride('ENABLE_ANALYTICS', true);
      expect(featureFlags.isEnabled('ENABLE_ANALYTICS')).toBe(true);

      featureFlags.clearOverride('ENABLE_ANALYTICS');
      expect(featureFlags.isEnabled('ENABLE_ANALYTICS')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined environment variables', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: undefined,
        configurable: true,
        writable: true,
        enumerable: true,
      });
      delete process.env.NEXT_PUBLIC_SHOW_COMPONENTS;

      const flags = getFeatureFlags();
      expect(flags.SHOW_COMPONENTS_DEMO).toBe(false);
    });

    it('should handle non-boolean environment variable values', () => {
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'yes';
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_IMPORT = '1';
      process.env.NEXT_PUBLIC_ENABLE_GROCERY_LISTS = 'TRUE';

      const flags = getFeatureFlags();

      // Only 'true' (lowercase) should be considered true
      expect(flags.ENABLE_ANALYTICS).toBe(false);
      expect(flags.ENABLE_RECIPE_IMPORT).toBe(false);
      expect(flags.ENABLE_GROCERY_LISTS).toBe(false);
    });

    it('should maintain type safety with FeatureFlagKey', () => {
      // This is more of a compile-time check, but we can test runtime behavior
      const validKey: FeatureFlagKey = 'ENABLE_RECIPE_CREATION';
      expect(() => isFeatureEnabled(validKey)).not.toThrow();
    });

    it('should return consistent values across multiple calls', () => {
      process.env.NEXT_PUBLIC_ENABLE_RECIPE_CREATION = 'true';

      const firstCall = isFeatureEnabled('ENABLE_RECIPE_CREATION');
      const secondCall = isFeatureEnabled('ENABLE_RECIPE_CREATION');
      const thirdCall = isFeatureEnabled('ENABLE_RECIPE_CREATION');

      expect(firstCall).toBe(secondCall);
      expect(secondCall).toBe(thirdCall);
    });

    it('should properly handle feature flag groups with single item', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        configurable: true,
        writable: true,
        enumerable: true,
      });

      expect(isFeatureGroupEnabled('DEVELOPMENT')).toBe(true);
      expect(isAnyFeatureInGroupEnabled('DEVELOPMENT')).toBe(true);
      expect(getEnabledFlagsInGroup('DEVELOPMENT')).toEqual([
        'SHOW_COMPONENTS_DEMO',
      ]);
    });

    it('should properly handle performance group', () => {
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS = 'true';

      expect(isFeatureGroupEnabled('PERFORMANCE')).toBe(true);
      expect(getEnabledFlagsInGroup('PERFORMANCE')).toEqual([
        'ENABLE_ANALYTICS',
      ]);
    });
  });
});
