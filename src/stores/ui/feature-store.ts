import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FeatureStoreState,
  FeatureFlag,
  ExperimentState,
} from '@/types/ui/features';

// Simple hash function for consistent user bucketing
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate a consistent user ID for rollout calculations
const getUserId = (): string => {
  if (typeof window === 'undefined') return 'server-user';

  let userId = localStorage.getItem('feature-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('feature-user-id', userId);
  }
  return userId;
};

export const useFeatureStore = create<FeatureStoreState>()(
  persist(
    (set, get) => ({
      features: {},
      userSegment: 'default',
      experiments: {},
      overrides: {},
      developmentMode: process.env.NODE_ENV === 'development',

      setFeatures: (features: Record<string, FeatureFlag>) => {
        set({ features });
      },

      updateFeature: (key: string, feature: FeatureFlag) => {
        set(state => ({
          features: { ...state.features, [key]: feature },
        }));
      },

      removeFeature: (key: string) => {
        set(state => {
          const newFeatures = { ...state.features };
          // eslint-disable-next-line security/detect-object-injection
          delete newFeatures[key];
          return { features: newFeatures };
        });
      },

      isFeatureEnabled: (key: string) => {
        const state = get();

        // Development mode overrides
        if (state.developmentMode && state.hasOverride(key)) {
          // eslint-disable-next-line security/detect-object-injection
          return state.overrides[key];
        }

        // eslint-disable-next-line security/detect-object-injection
        const feature = state.features[key];
        if (!feature) return false;

        // Check if feature is expired
        if (feature.expiresAt && Date.now() > feature.expiresAt) {
          return false;
        }

        // Check if feature is enabled
        if (!feature.enabled) return false;

        // Check user segments
        if (feature.userSegments && feature.userSegments.length > 0) {
          if (!state.isInSegment(feature.userSegments)) {
            return false;
          }
        }

        // Check rollout percentage
        if (feature.rolloutPercentage !== undefined) {
          return state.isInRollout(feature);
        }

        return true;
      },

      getFeatureVariant: (key: string) => {
        // eslint-disable-next-line security/detect-object-injection
        const feature = get().features[key];
        if (!feature || !get().isFeatureEnabled(key)) return undefined;

        return feature.variant;
      },

      getFeature: (key: string) => {
        // eslint-disable-next-line security/detect-object-injection
        return get().features[key];
      },

      setOverride: (key: string, enabled: boolean) => {
        set(state => ({
          overrides: { ...state.overrides, [key]: enabled },
        }));
      },

      removeOverride: (key: string) => {
        set(state => {
          const newOverrides = { ...state.overrides };
          // eslint-disable-next-line security/detect-object-injection
          delete newOverrides[key];
          return { overrides: newOverrides };
        });
      },

      clearOverrides: () => {
        set({ overrides: {} });
      },

      hasOverride: (key: string) => {
        return key in get().overrides;
      },

      setUserSegment: (segment: string) => {
        set({ userSegment: segment });
      },

      isInSegment: (segments: string[]) => {
        const userSegment = get().userSegment;
        return segments.includes(userSegment) || segments.includes('all');
      },

      joinExperiment: (
        experimentId: string,
        variant: string,
        metadata?: Record<string, unknown>
      ) => {
        const experiment: ExperimentState = {
          id: experimentId,
          name: experimentId,
          variant,
          startedAt: Date.now(),
          metadata,
        };

        set(state => ({
          experiments: { ...state.experiments, [experimentId]: experiment },
        }));
      },

      leaveExperiment: (experimentId: string) => {
        set(state => {
          const newExperiments = { ...state.experiments };
          // eslint-disable-next-line security/detect-object-injection
          delete newExperiments[experimentId];
          return { experiments: newExperiments };
        });
      },

      getExperimentVariant: (experimentId: string) => {
        // eslint-disable-next-line security/detect-object-injection
        const experiment = get().experiments[experimentId];
        return experiment?.variant;
      },

      isInExperiment: (experimentId: string) => {
        return experimentId in get().experiments;
      },

      setDevelopmentMode: (enabled: boolean) => {
        set({ developmentMode: enabled });
      },

      getAllEnabledFeatures: () => {
        const state = get();
        return Object.keys(state.features).filter(key =>
          state.isFeatureEnabled(key)
        );
      },

      getAllDisabledFeatures: () => {
        const state = get();
        return Object.keys(state.features).filter(
          key => !state.isFeatureEnabled(key)
        );
      },

      getFeatureCount: () => {
        return Object.keys(get().features).length;
      },

      getActiveExperiments: () => {
        return Object.values(get().experiments);
      },

      isInRollout: (feature: FeatureFlag) => {
        if (feature.rolloutPercentage === undefined) return true;
        if (feature.rolloutPercentage >= 100) return true;
        if (feature.rolloutPercentage <= 0) return false;

        const userId = getUserId();
        return get().calculateRolloutEligibility(
          feature.rolloutPercentage,
          userId
        );
      },

      calculateRolloutEligibility: (
        rolloutPercentage: number,
        userId?: string
      ) => {
        if (rolloutPercentage >= 100) return true;
        if (rolloutPercentage <= 0) return false;

        const id = userId ?? getUserId();
        const hash = hashString(id);
        const bucket = hash % 100;

        return bucket < rolloutPercentage;
      },
    }),
    {
      name: 'feature-storage',
      partialize: state => ({
        userSegment: state.userSegment,
        experiments: state.experiments,
        overrides: state.overrides,
        developmentMode: state.developmentMode,
      }),
    }
  )
);
