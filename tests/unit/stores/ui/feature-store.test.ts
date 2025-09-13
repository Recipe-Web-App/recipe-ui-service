import { act } from '@testing-library/react';
import { useFeatureStore } from '@/stores/ui/feature-store';
import type { FeatureFlag } from '@/types/ui/features';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn().mockImplementation((key: string) => {
    if (key === 'feature-user-id') {
      return 'test-user-123'; // Consistent user ID for testing
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useFeatureStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useFeatureStore.setState({
      features: {},
      userSegment: 'default',
      experiments: {},
      overrides: {},
      developmentMode: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useFeatureStore.getState();

      expect(state.features).toEqual({});
      expect(state.userSegment).toBe('default');
      expect(state.experiments).toEqual({});
      expect(state.overrides).toEqual({});
      expect(state.developmentMode).toBe(false);
    });
  });

  describe('feature management', () => {
    const mockFeature: FeatureFlag = {
      key: 'test-feature',
      enabled: true,
      rolloutPercentage: 50,
      userSegments: ['default'],
    };

    describe('setFeatures', () => {
      it('should set multiple features', () => {
        const features = {
          'feature-1': mockFeature,
          'feature-2': { ...mockFeature, key: 'feature-2', enabled: false },
        };

        act(() => {
          useFeatureStore.getState().setFeatures(features);
        });

        expect(useFeatureStore.getState().features).toEqual(features);
      });
    });

    describe('updateFeature', () => {
      it('should update a single feature', () => {
        act(() => {
          useFeatureStore.getState().updateFeature('test-feature', mockFeature);
        });

        expect(useFeatureStore.getState().features['test-feature']).toEqual(
          mockFeature
        );
      });

      it('should overwrite existing feature', () => {
        const initialFeature = { key: 'test-feature', enabled: false };
        const updatedFeature = {
          key: 'test-feature',
          enabled: true,
          rolloutPercentage: 100,
        };

        act(() => {
          useFeatureStore
            .getState()
            .updateFeature('test-feature', initialFeature);
        });

        act(() => {
          useFeatureStore
            .getState()
            .updateFeature('test-feature', updatedFeature);
        });

        expect(useFeatureStore.getState().features['test-feature']).toEqual(
          updatedFeature
        );
      });
    });

    describe('removeFeature', () => {
      it('should remove a feature', () => {
        act(() => {
          useFeatureStore.getState().updateFeature('test-feature', mockFeature);
        });

        expect(
          useFeatureStore.getState().features['test-feature']
        ).toBeDefined();

        act(() => {
          useFeatureStore.getState().removeFeature('test-feature');
        });

        expect(
          useFeatureStore.getState().features['test-feature']
        ).toBeUndefined();
      });

      it('should not affect other features', () => {
        act(() => {
          useFeatureStore.getState().updateFeature('feature-1', mockFeature);
          useFeatureStore.getState().updateFeature('feature-2', mockFeature);
        });

        act(() => {
          useFeatureStore.getState().removeFeature('feature-1');
        });

        expect(
          useFeatureStore.getState().features['feature-1']
        ).toBeUndefined();
        expect(useFeatureStore.getState().features['feature-2']).toBeDefined();
      });
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return false for non-existent feature', () => {
      expect(useFeatureStore.getState().isFeatureEnabled('non-existent')).toBe(
        false
      );
    });

    it('should return false for disabled feature', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('disabled-feature', {
          key: 'disabled-feature',
          enabled: false,
        });
      });

      expect(
        useFeatureStore.getState().isFeatureEnabled('disabled-feature')
      ).toBe(false);
    });

    it('should return true for enabled feature without constraints', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('enabled-feature', {
          key: 'enabled-feature',
          enabled: true,
        });
      });

      expect(
        useFeatureStore.getState().isFeatureEnabled('enabled-feature')
      ).toBe(true);
    });

    it('should return false for expired feature', () => {
      const expiredTime = Date.now() - 1000; // 1 second ago

      act(() => {
        useFeatureStore.getState().updateFeature('expired-feature', {
          key: 'expired-feature',
          enabled: true,
          expiresAt: expiredTime,
        });
      });

      expect(
        useFeatureStore.getState().isFeatureEnabled('expired-feature')
      ).toBe(false);
    });

    it('should respect development mode overrides', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('test-feature', {
          key: 'test-feature',
          enabled: false,
        });
        useFeatureStore.setState({
          developmentMode: true,
          overrides: { 'test-feature': true },
        });
      });

      expect(useFeatureStore.getState().isFeatureEnabled('test-feature')).toBe(
        true
      );
    });
  });

  describe('user segments', () => {
    it('should handle user segment restrictions', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('segment-feature', {
          key: 'segment-feature',
          enabled: true,
          userSegments: ['premium'],
        });
        useFeatureStore.setState({ userSegment: 'default' });
      });

      // Should be false since user is not in premium segment
      expect(
        useFeatureStore.getState().isFeatureEnabled('segment-feature')
      ).toBe(false);
    });
  });

  describe('utility methods', () => {
    describe('features object access', () => {
      it('should allow direct access to features', () => {
        const testFeature = {
          key: 'test-feature',
          enabled: true,
          rolloutPercentage: 50,
        };

        act(() => {
          useFeatureStore.getState().updateFeature('test-feature', testFeature);
        });

        const features = useFeatureStore.getState().features;
        expect(features['test-feature']).toEqual(testFeature);
      });

      it('should return undefined for non-existent feature', () => {
        const features = useFeatureStore.getState().features;
        expect(features['non-existent']).toBeUndefined();
      });
    });

    describe('override access', () => {
      it('should allow access to override state', () => {
        act(() => {
          useFeatureStore.setState({
            overrides: { 'test-feature': true },
          });
        });

        const overrides = useFeatureStore.getState().overrides;
        expect(overrides['test-feature']).toBe(true);
      });

      it('should return undefined for non-existent override', () => {
        const overrides = useFeatureStore.getState().overrides;
        expect(overrides['non-existent']).toBeUndefined();
      });
    });
  });

  describe('localStorage interaction', () => {
    it('should handle localStorage operations safely', () => {
      // Just verify the store doesn't crash when localStorage is available
      expect(() => {
        useFeatureStore.getState().isFeatureEnabled('test');
      }).not.toThrow();
    });
  });

  describe('overrides management', () => {
    it('should set override', () => {
      act(() => {
        useFeatureStore.getState().setOverride('test-feature', true);
      });

      expect(useFeatureStore.getState().overrides['test-feature']).toBe(true);
    });

    it('should remove override', () => {
      act(() => {
        useFeatureStore.getState().setOverride('test-feature', true);
        useFeatureStore.getState().removeOverride('test-feature');
      });

      expect(
        useFeatureStore.getState().overrides['test-feature']
      ).toBeUndefined();
    });

    it('should clear all overrides', () => {
      act(() => {
        useFeatureStore.getState().setOverride('feature-1', true);
        useFeatureStore.getState().setOverride('feature-2', false);
        useFeatureStore.getState().clearOverrides();
      });

      expect(useFeatureStore.getState().overrides).toEqual({});
    });

    it('should check if has override', () => {
      act(() => {
        useFeatureStore.getState().setOverride('test-feature', true);
      });

      expect(useFeatureStore.getState().hasOverride('test-feature')).toBe(true);
      expect(useFeatureStore.getState().hasOverride('non-existent')).toBe(
        false
      );
    });
  });

  describe('user segments', () => {
    it('should set user segment', () => {
      act(() => {
        useFeatureStore.getState().setUserSegment('premium');
      });

      expect(useFeatureStore.getState().userSegment).toBe('premium');
    });

    it('should check if user is in segment', () => {
      act(() => {
        useFeatureStore.setState({ userSegment: 'premium' });
      });

      expect(
        useFeatureStore.getState().isInSegment(['premium', 'enterprise'])
      ).toBe(true);
      expect(
        useFeatureStore.getState().isInSegment(['basic', 'standard'])
      ).toBe(false);
    });

    it('should include user in all segment', () => {
      act(() => {
        useFeatureStore.setState({ userSegment: 'basic' });
      });

      expect(useFeatureStore.getState().isInSegment(['all'])).toBe(true);
    });
  });

  describe('experiments', () => {
    it('should join experiment', () => {
      const metadata = { source: 'web' };

      act(() => {
        useFeatureStore
          .getState()
          .joinExperiment('test-experiment', 'variant-a', metadata);
      });

      const experiments = useFeatureStore.getState().experiments;
      expect(experiments['test-experiment']).toBeDefined();
      expect(experiments['test-experiment'].variant).toBe('variant-a');
      expect(experiments['test-experiment'].metadata).toEqual(metadata);
      expect(typeof experiments['test-experiment'].startedAt).toBe('number');
    });

    it('should leave experiment', () => {
      act(() => {
        useFeatureStore
          .getState()
          .joinExperiment('test-experiment', 'variant-a');
        useFeatureStore.getState().leaveExperiment('test-experiment');
      });

      expect(
        useFeatureStore.getState().experiments['test-experiment']
      ).toBeUndefined();
    });

    it('should get experiment variant', () => {
      act(() => {
        useFeatureStore
          .getState()
          .joinExperiment('test-experiment', 'variant-b');
      });

      expect(
        useFeatureStore.getState().getExperimentVariant('test-experiment')
      ).toBe('variant-b');
      expect(
        useFeatureStore.getState().getExperimentVariant('non-existent')
      ).toBeUndefined();
    });

    it('should check if in experiment', () => {
      act(() => {
        useFeatureStore
          .getState()
          .joinExperiment('test-experiment', 'variant-a');
      });

      expect(useFeatureStore.getState().isInExperiment('test-experiment')).toBe(
        true
      );
      expect(useFeatureStore.getState().isInExperiment('non-existent')).toBe(
        false
      );
    });

    it('should get active experiments', () => {
      act(() => {
        useFeatureStore.getState().joinExperiment('exp-1', 'variant-a');
        useFeatureStore.getState().joinExperiment('exp-2', 'variant-b');
      });

      const activeExperiments = useFeatureStore
        .getState()
        .getActiveExperiments();
      expect(activeExperiments).toHaveLength(2);
      expect(activeExperiments.map(exp => exp.id)).toContain('exp-1');
      expect(activeExperiments.map(exp => exp.id)).toContain('exp-2');
    });
  });

  describe('development mode', () => {
    it('should set development mode', () => {
      act(() => {
        useFeatureStore.getState().setDevelopmentMode(true);
      });

      expect(useFeatureStore.getState().developmentMode).toBe(true);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      act(() => {
        useFeatureStore.getState().setFeatures({
          'enabled-feature': { key: 'enabled-feature', enabled: true },
          'disabled-feature': { key: 'disabled-feature', enabled: false },
          'segment-feature': {
            key: 'segment-feature',
            enabled: true,
            userSegments: ['premium'],
          },
        });
        useFeatureStore.setState({ userSegment: 'default' });
      });
    });

    it('should get all enabled features', () => {
      const enabledFeatures = useFeatureStore
        .getState()
        .getAllEnabledFeatures();
      expect(enabledFeatures).toContain('enabled-feature');
      expect(enabledFeatures).not.toContain('disabled-feature');
      expect(enabledFeatures).not.toContain('segment-feature'); // User not in premium segment
    });

    it('should get all disabled features', () => {
      const disabledFeatures = useFeatureStore
        .getState()
        .getAllDisabledFeatures();
      expect(disabledFeatures).toContain('disabled-feature');
      expect(disabledFeatures).toContain('segment-feature'); // User not in premium segment
      expect(disabledFeatures).not.toContain('enabled-feature');
    });

    it('should get feature count', () => {
      expect(useFeatureStore.getState().getFeatureCount()).toBe(3);
    });

    it('should get feature by key', () => {
      const feature = useFeatureStore.getState().getFeature('enabled-feature');
      expect(feature).toBeDefined();
      expect(feature?.enabled).toBe(true);
    });

    it('should get feature variant', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('variant-feature', {
          key: 'variant-feature',
          enabled: true,
          variant: 'blue-button',
        });
      });

      expect(
        useFeatureStore.getState().getFeatureVariant('variant-feature')
      ).toBe('blue-button');
      expect(
        useFeatureStore.getState().getFeatureVariant('disabled-feature')
      ).toBeUndefined();
    });
  });

  describe('rollout functionality', () => {
    it('should handle rollout percentage', () => {
      const rolloutFeature: FeatureFlag = {
        key: 'rollout-feature',
        enabled: true,
        rolloutPercentage: 50,
      };

      act(() => {
        useFeatureStore
          .getState()
          .updateFeature('rollout-feature', rolloutFeature);
      });

      // Should return a boolean result based on rollout percentage
      const result = useFeatureStore
        .getState()
        .isFeatureEnabled('rollout-feature');
      expect(typeof result).toBe('boolean');
    });

    it('should handle 100% rollout', () => {
      const fullRolloutFeature: FeatureFlag = {
        key: 'full-rollout',
        enabled: true,
        rolloutPercentage: 100,
      };

      act(() => {
        useFeatureStore
          .getState()
          .updateFeature('full-rollout', fullRolloutFeature);
      });

      expect(useFeatureStore.getState().isFeatureEnabled('full-rollout')).toBe(
        true
      );
    });

    it('should handle 0% rollout', () => {
      const noRolloutFeature: FeatureFlag = {
        key: 'no-rollout',
        enabled: true,
        rolloutPercentage: 0,
      };

      act(() => {
        useFeatureStore
          .getState()
          .updateFeature('no-rollout', noRolloutFeature);
      });

      expect(useFeatureStore.getState().isFeatureEnabled('no-rollout')).toBe(
        false
      );
    });

    it('should calculate rollout eligibility', () => {
      const eligibility100 = useFeatureStore
        .getState()
        .calculateRolloutEligibility(100, 'test-user');
      expect(eligibility100).toBe(true);

      const eligibility0 = useFeatureStore
        .getState()
        .calculateRolloutEligibility(0, 'test-user');
      expect(eligibility0).toBe(false);

      const eligibility50 = useFeatureStore
        .getState()
        .calculateRolloutEligibility(50, 'test-user');
      expect(typeof eligibility50).toBe('boolean');
    });

    it('should check if feature is in rollout', () => {
      const rolloutFeature: FeatureFlag = {
        key: 'rollout-test',
        enabled: true,
        rolloutPercentage: 75,
      };

      const isInRollout = useFeatureStore
        .getState()
        .isInRollout(rolloutFeature);
      expect(typeof isInRollout).toBe('boolean');
    });

    it('should handle undefined rollout percentage', () => {
      const noRolloutFeature: FeatureFlag = {
        key: 'no-rollout-defined',
        enabled: true,
      };

      expect(useFeatureStore.getState().isInRollout(noRolloutFeature)).toBe(
        true
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complex feature configuration', () => {
      const complexFeature: FeatureFlag = {
        key: 'complex-feature',
        enabled: true,
        rolloutPercentage: 75,
        userSegments: ['default', 'premium'],
        variant: 'control',
        expiresAt: Date.now() + 60000, // 1 minute from now
      };

      act(() => {
        useFeatureStore
          .getState()
          .updateFeature('complex-feature', complexFeature);
        useFeatureStore.setState({ userSegment: 'default' });
      });

      // Feature should exist
      expect(
        useFeatureStore.getState().getFeature?.('complex-feature')
      ).toEqual(complexFeature);
    });

    it('should handle feature removal and cleanup', () => {
      act(() => {
        useFeatureStore.getState().setFeatures({
          'feature-1': { key: 'feature-1', enabled: true },
          'feature-2': { key: 'feature-2', enabled: false },
          'feature-3': { key: 'feature-3', enabled: true },
        });
      });

      expect(Object.keys(useFeatureStore.getState().features)).toHaveLength(3);

      act(() => {
        useFeatureStore.getState().removeFeature('feature-2');
      });

      const remainingFeatures = Object.keys(
        useFeatureStore.getState().features
      );
      expect(remainingFeatures).toHaveLength(2);
      expect(remainingFeatures).toContain('feature-1');
      expect(remainingFeatures).toContain('feature-3');
      expect(remainingFeatures).not.toContain('feature-2');
    });

    it('should handle development mode behavior', () => {
      act(() => {
        useFeatureStore
          .getState()
          .updateFeature('dev-feature', { key: 'dev-feature', enabled: false });
        useFeatureStore.setState({
          developmentMode: true,
          overrides: { 'dev-feature': true },
        });
      });

      // Should respect override in development mode
      expect(useFeatureStore.getState().isFeatureEnabled('dev-feature')).toBe(
        true
      );

      // Turn off development mode
      act(() => {
        useFeatureStore.setState({ developmentMode: false });
      });

      // Should use actual feature state
      expect(useFeatureStore.getState().isFeatureEnabled('dev-feature')).toBe(
        false
      );
    });

    it('should handle user segment filtering correctly', () => {
      act(() => {
        useFeatureStore.getState().updateFeature('premium-feature', {
          key: 'premium-feature',
          enabled: true,
          userSegments: ['premium'],
        });
        useFeatureStore.setState({ userSegment: 'premium' });
      });

      // Should be enabled for premium users
      expect(
        useFeatureStore.getState().isFeatureEnabled('premium-feature')
      ).toBe(true);

      act(() => {
        useFeatureStore.setState({ userSegment: 'default' });
      });

      // Should be disabled for default users
      expect(
        useFeatureStore.getState().isFeatureEnabled('premium-feature')
      ).toBe(false);
    });
  });
});
