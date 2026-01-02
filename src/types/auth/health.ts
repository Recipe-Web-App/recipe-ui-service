export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  last_checked: string;
  response_time?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version?: string;
  uptime?: string;
  components?: {
    redis?: ComponentHealth;
    postgres?: ComponentHealth;
    mysql?: ComponentHealth;
    configuration?: ComponentHealth;
  };
  details?: Record<string, unknown>;
}

export interface ReadinessResponse {
  ready: boolean;
  timestamp: string;
  components?: {
    redis?: ComponentHealth;
    postgres?: ComponentHealth;
    mysql?: ComponentHealth;
  };
}

export interface LivenessResponse {
  status: 'alive';
  timestamp: string;
  uptime: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
}
