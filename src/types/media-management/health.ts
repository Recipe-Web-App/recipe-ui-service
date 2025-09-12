/**
 * Health check types for Media Management Service
 * Generated from OpenAPI specification
 */

/**
 * Status of individual dependency check
 */
export interface DependencyCheck {
  status: 'healthy' | 'unhealthy' | 'timeout';
  response_time_ms: number;
}

/**
 * Readiness status of individual dependency check
 */
export interface ReadinessDependencyCheck {
  status: 'ready' | 'not_ready' | 'timeout';
  response_time_ms: number;
}

/**
 * Health check response with comprehensive dependency validation
 */
export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  response_time_ms: number;
  checks: {
    database: DependencyCheck;
    storage: DependencyCheck;
    overall: 'healthy' | 'degraded' | 'unhealthy';
  };
}

/**
 * Readiness check response with binary ready/not-ready status
 */
export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  timestamp: string;
  service: string;
  version: string;
  response_time_ms: number;
  checks: {
    database: ReadinessDependencyCheck;
    storage: ReadinessDependencyCheck;
    overall: 'ready' | 'not_ready';
  };
}
