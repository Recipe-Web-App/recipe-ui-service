export enum RecipeManagementHealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  DEGRADED = 'DEGRADED',
  WARNING = 'WARNING',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  UNKNOWN = 'UNKNOWN',
}

export interface RecipeManagementHealthComponentDetails {
  status: RecipeManagementHealthStatus;
  details?: Record<string, unknown>;
}

export interface RecipeManagementHealthResponse {
  status: RecipeManagementHealthStatus;
  components?: Record<string, RecipeManagementHealthComponentDetails>;
  groups?: {
    liveness?: {
      status: string;
      components?: Record<string, unknown>;
    };
    readiness?: {
      status: string;
      components?: Record<string, unknown>;
    };
  };
}

export interface RecipeManagementInfoResponse {
  app?: {
    name?: string;
    version?: string;
    description?: string;
  };
  build?: {
    version?: string;
    time?: string;
    artifact?: string;
    name?: string;
    group?: string;
  };
  java?: {
    version?: string;
    vendor?: string;
  };
  os?: {
    name?: string;
    version?: string;
    arch?: string;
  };
}

export interface RecipeManagementMetricsResponse {
  names: string[];
}

export interface RecipeManagementMetricMeasurement {
  statistic: string;
  value: number;
}

export interface RecipeManagementMetricTag {
  tag: string;
  values: string[];
}

export interface RecipeManagementMetricResponse {
  name: string;
  description?: string;
  baseUnit?: string;
  measurements: RecipeManagementMetricMeasurement[];
  availableTags?: RecipeManagementMetricTag[];
}

export interface RecipeManagementPropertySource {
  name: string;
  properties: Record<
    string,
    {
      value: string;
      origin?: string;
      sensitive?: boolean;
    }
  >;
}

export interface RecipeManagementEnvironmentResponse {
  activeProfiles: string[];
  propertySources: RecipeManagementPropertySource[];
}

export interface RecipeManagementPropertyResponse {
  property?: {
    source: string;
    value: string;
  };
  activeProfiles?: string[];
  propertySources?: string[];
}

export interface RecipeManagementConfigPropsBean {
  prefix: string;
  properties: Record<string, unknown>;
}

export interface RecipeManagementConfigPropsContext {
  beans: Record<string, RecipeManagementConfigPropsBean>;
  parentId?: string | null;
}

export interface RecipeManagementConfigPropsResponse {
  contexts: Record<string, RecipeManagementConfigPropsContext>;
}
