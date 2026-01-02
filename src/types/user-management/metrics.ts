// Performance Metrics - aligned with OpenAPI spec (camelCase)
export interface PerformanceMetrics {
  responseTimes?: {
    averageMs?: number;
    p50Ms?: number;
    p95Ms?: number;
    p99Ms?: number;
  };
  requestCounts?: {
    totalRequests?: number;
  };
  errorRates?: {
    totalErrors?: number;
    errorRatePercent?: number;
    '4xxErrors'?: number;
    '5xxErrors'?: number;
  };
  database?: {
    activeConnections?: number;
    maxConnections?: number;
  };
}

// Cache Metrics - aligned with OpenAPI spec (camelCase)
export interface CacheMetrics {
  memoryUsage?: string;
  memoryUsageHuman?: string;
  keysCount?: number;
  hitRate?: number;
  connectedClients?: number;
  evictedKeys?: number;
  expiredKeys?: number;
}

// System Metrics - aligned with OpenAPI spec (camelCase)
export interface SystemMetrics {
  timestamp?: string;
  system?: {
    cpuUsagePercent?: number;
    memoryTotalGb?: number;
    memoryUsedGb?: number;
    memoryUsagePercent?: number;
    diskTotalGb?: number;
    diskUsedGb?: number;
    diskUsagePercent?: number;
  };
  process?: {
    memoryRssMb?: number;
    memoryVmsMb?: number;
    cpuPercent?: number;
    numThreads?: number;
    openFiles?: number;
  };
  uptimeSeconds?: number;
}

// Detailed Health Metrics - aligned with OpenAPI spec (camelCase)
export interface DetailedHealthMetrics {
  timestamp?: string;
  overallStatus?: 'healthy' | 'degraded' | 'unhealthy';
  services?: {
    redis?: {
      status?: 'healthy' | 'unhealthy';
      responseTimeMs?: number;
      memoryUsage?: string;
      connectedClients?: number;
      hitRatePercent?: number;
    };
    database?: {
      status?: 'healthy' | 'unhealthy';
      responseTimeMs?: number;
      activeConnections?: number;
      maxConnections?: number;
    };
  };
  application?: {
    version?: string;
    environment?: string;
    features?: {
      authentication?: string;
      caching?: string;
      monitoring?: string;
      securityHeaders?: string;
    };
  };
}
