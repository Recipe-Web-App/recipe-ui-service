// Feature Flags Types
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  variant?: string;
  rolloutPercentage?: number;
  userSegments?: string[];
  metadata?: Record<string, unknown>;
  expiresAt?: number;
}

export interface ExperimentState {
  id: string;
  name: string;
  variant: string;
  startedAt: number;
  metadata?: Record<string, unknown>;
}

export interface FeatureState {
  features: Record<string, FeatureFlag>;
  userSegment: string;
  experiments: Record<string, ExperimentState>;
  overrides: Record<string, boolean>;
  developmentMode: boolean;
}

// Store interface with all actions
export interface FeatureStoreState extends FeatureState {
  // Feature management actions
  setFeatures: (features: Record<string, FeatureFlag>) => void;
  updateFeature: (key: string, feature: FeatureFlag) => void;
  removeFeature: (key: string) => void;

  // Feature checking methods
  isFeatureEnabled: (key: string) => boolean;
  getFeatureVariant: (key: string) => string | undefined;
  getFeature: (key: string) => FeatureFlag | undefined;

  // Override management
  setOverride: (key: string, enabled: boolean) => void;
  removeOverride: (key: string) => void;
  clearOverrides: () => void;
  hasOverride: (key: string) => boolean;

  // User segment management
  setUserSegment: (segment: string) => void;
  isInSegment: (segments: string[]) => boolean;

  // Experiment management
  joinExperiment: (
    experimentId: string,
    variant: string,
    metadata?: Record<string, unknown>
  ) => void;
  leaveExperiment: (experimentId: string) => void;
  getExperimentVariant: (experimentId: string) => string | undefined;
  isInExperiment: (experimentId: string) => boolean;

  // Development mode
  setDevelopmentMode: (enabled: boolean) => void;

  // Utility methods
  getAllEnabledFeatures: () => string[];
  getAllDisabledFeatures: () => string[];
  getFeatureCount: () => number;
  getActiveExperiments: () => ExperimentState[];

  // Rollout management
  isInRollout: (feature: FeatureFlag) => boolean;
  calculateRolloutEligibility: (
    rolloutPercentage: number,
    userId?: string
  ) => boolean;
}
