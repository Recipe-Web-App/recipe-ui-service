import type { HealthStatus } from './common';

// Liveness Response - aligned with OpenAPI spec
export interface LivenessResponse {
  status: string; // "UP"
}

// Database Health for Readiness - aligned with OpenAPI spec
export interface DatabaseHealth {
  status?: string;
  message?: string;
  open_connections?: string;
  in_use?: string;
  idle?: string;
  wait_count?: string;
  wait_duration?: string;
  max_idle_closed?: string;
  max_lifetime_closed?: string;
}

// Redis Health for Readiness - aligned with OpenAPI spec
export interface RedisHealth {
  status?: string;
  message?: string;
  total_conns?: string;
  idle_conns?: string;
  stale_conns?: string;
  hits?: string;
  misses?: string;
  timeouts?: string;
}

// Readiness Response - aligned with OpenAPI spec
export interface ReadinessResponse {
  status?: string; // "READY"
  database?: DatabaseHealth;
  redis?: RedisHealth;
}

// Basic Health Check Response
export interface HealthCheckResponse {
  status?: HealthStatus;
  message?: string;
  timestamp?: string;
  uptimeSeconds?: number;
}

// Service Status (for internal use)
export interface ServiceStatus {
  status?: 'healthy' | 'unhealthy';
  responseTimeMs?: number;
  lastCheck?: string;
  errorMessage?: string;
}

// Comprehensive Health Response (for detailed metrics endpoint)
export interface ComprehensiveHealthResponse {
  overallStatus?: HealthStatus;
  timestamp?: string;
  uptimeSeconds?: number;
  version?: string;
  environment?: string;
  services?: {
    database?: {
      status?: 'healthy' | 'unhealthy';
      responseTimeMs?: number;
      activeConnections?: number;
      maxConnections?: number;
    };
    redis?: {
      status?: 'healthy' | 'unhealthy';
      responseTimeMs?: number;
      memoryUsage?: string;
      connectedClients?: number;
      hitRatePercent?: number;
    };
  };
  systemResources?: {
    cpuUsagePercent?: number;
    memoryUsagePercent?: number;
    diskUsagePercent?: number;
  };
  applicationHealth?: {
    activeSessions?: number;
    requestRatePerMinute?: number;
    errorRatePercent?: number;
    avgResponseTimeMs?: number;
  };
}

// Health Check utility type
export interface HealthCheck {
  healthy: boolean;
  message: string;
}
