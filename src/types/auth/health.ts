export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks?: {
    redis?: 'up' | 'down';
  };
  version?: string;
}

export interface ReadinessResponse {
  ready: boolean;
  timestamp: string;
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
