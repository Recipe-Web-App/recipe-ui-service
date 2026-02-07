/**
 * Individual health check item schema.
 */
export interface HealthCheckItem {
  /** Component health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Component response time in milliseconds */
  responseTimeMs?: number;
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
  uptimeSeconds?: number;
  /** Health check details for each component */
  checks: {
    /** Database health check */
    database?: HealthCheckItem;
    /** Cache health check */
    cache?: HealthCheckItem;
    /** External APIs health checks */
    externalApis?: {
      /** Spoonacular API health check */
      spoonacular?: HealthCheckItem;
    };
  };
  /** Database monitoring status */
  databaseMonitoring?: {
    /** Whether monitoring is enabled */
    enabled?: boolean;
    /** Last monitoring check timestamp */
    lastCheck?: string;
  };
  /** Health check response time in milliseconds */
  responseTimeMs?: number;
}
