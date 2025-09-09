/**
 * Individual health check item schema.
 */
export interface HealthCheckItem {
  /** Component health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Component response time in milliseconds */
  response_time_ms?: number;
  /** Status message */
  message: string;
}

/**
 * Comprehensive health check response schema.
 */
export interface HealthCheckResponse {
  /** Overall service health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Health check timestamp */
  timestamp: string;
  /** Service version */
  version: string;
  /** Service uptime in seconds */
  uptime_seconds?: number;
  /** Health check details for each component */
  checks: {
    /** Database health check */
    database?: HealthCheckItem;
    /** Cache health check */
    cache?: HealthCheckItem;
    /** External APIs health checks */
    external_apis?: {
      /** Spoonacular API health check */
      spoonacular?: HealthCheckItem;
    };
  };
  /** Database monitoring status */
  database_monitoring?: {
    /** Whether monitoring is enabled */
    enabled?: boolean;
    /** Last monitoring check timestamp */
    last_check?: string;
  };
  /** Health check response time in milliseconds */
  response_time_ms?: number;
}
