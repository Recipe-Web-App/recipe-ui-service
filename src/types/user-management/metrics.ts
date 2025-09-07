// Performance Metrics
export interface PerformanceMetrics {
  response_times?: {
    average_ms?: number;
    p50_ms?: number;
    p95_ms?: number;
    p99_ms?: number;
  };
  request_counts?: {
    total_requests?: number;
    requests_per_minute?: number;
    active_sessions?: number;
  };
  error_rates?: {
    total_errors?: number;
    error_rate_percent?: number;
    '4xx_errors'?: number;
    '5xx_errors'?: number;
  };
  database?: {
    active_connections?: number;
    max_connections?: number;
    avg_query_time_ms?: number;
    slow_queries_count?: number;
  };
}

// Cache Metrics
export interface CacheMetrics {
  memory_usage?: string;
  memory_usage_human?: string;
  keys_count?: number;
  hit_rate?: number;
  connected_clients?: number;
  evicted_keys?: number;
  expired_keys?: number;
}

export interface CacheClearRequest {
  pattern?: string;
}

export interface CacheClearResponse {
  message?: string;
  pattern?: string;
  cleared_count?: number;
}

// System Metrics
export interface SystemMetrics {
  timestamp?: string;
  system?: {
    cpu_usage_percent?: number;
    memory_total_gb?: number;
    memory_used_gb?: number;
    memory_usage_percent?: number;
    disk_total_gb?: number;
    disk_used_gb?: number;
    disk_usage_percent?: number;
  };
  process?: {
    memory_rss_mb?: number;
    memory_vms_mb?: number;
    cpu_percent?: number;
    num_threads?: number;
    open_files?: number;
  };
  uptime_seconds?: number;
}

// Detailed Health Metrics
export interface DetailedHealthMetrics {
  timestamp?: string;
  overall_status?: 'healthy' | 'degraded' | 'unhealthy';
  services?: {
    redis?: {
      status?: 'healthy' | 'unhealthy';
      response_time_ms?: number;
      memory_usage?: string;
      connected_clients?: number;
      hit_rate_percent?: number;
    };
    database?: {
      status?: 'healthy' | 'unhealthy';
      response_time_ms?: number;
      active_connections?: number;
      max_connections?: number;
    };
  };
  application?: {
    version?: string;
    environment?: string;
    features?: {
      authentication?: string;
      caching?: string;
      monitoring?: string;
      security_headers?: string;
    };
  };
}
