import type { HealthStatus } from './common';

// Basic Health Check
export interface HealthCheckResponse {
  status?: HealthStatus;
  message?: string;
  timestamp?: string;
  uptime_seconds?: number;
}

// Service Status
export interface ServiceStatus {
  status?: 'healthy' | 'unhealthy';
  response_time_ms?: number;
  last_check?: string;
  error_message?: string;
}

// Database Health
export interface DatabaseHealth extends ServiceStatus {
  connection_pool?: {
    active_connections?: number;
    idle_connections?: number;
    max_connections?: number;
    connection_utilization_percent?: number;
  };
  query_performance?: {
    avg_query_time_ms?: number;
    slow_queries_count?: number;
    failed_queries_count?: number;
  };
}

// Redis Health
export interface RedisHealth extends ServiceStatus {
  memory?: {
    used_memory?: string;
    used_memory_human?: string;
    memory_usage_percent?: number;
  };
  connectivity?: {
    connected_clients?: number;
    blocked_clients?: number;
  };
  performance?: {
    hit_rate_percent?: number;
    keyspace_hits?: number;
    keyspace_misses?: number;
  };
}

// External Service Health
export interface ExternalServiceHealth {
  name?: string;
  url?: string;
  status?: 'healthy' | 'unhealthy' | 'timeout';
  response_time_ms?: number;
  last_check?: string;
  error_message?: string;
}

// Comprehensive Health Response
export interface ComprehensiveHealthResponse {
  overall_status?: HealthStatus;
  timestamp?: string;
  uptime_seconds?: number;
  version?: string;
  environment?: string;
  services?: {
    database?: DatabaseHealth;
    redis?: RedisHealth;
    external_services?: ExternalServiceHealth[];
  };
  system_resources?: {
    cpu_usage_percent?: number;
    memory_usage_percent?: number;
    disk_usage_percent?: number;
  };
  application_health?: {
    active_sessions?: number;
    request_rate_per_minute?: number;
    error_rate_percent?: number;
    avg_response_time_ms?: number;
  };
}

// Health History
export interface HealthHistoryEntry {
  timestamp?: string;
  overall_status?: HealthStatus;
  services?: {
    database_status?: 'healthy' | 'unhealthy';
    redis_status?: 'healthy' | 'unhealthy';
  };
  metrics?: {
    response_time_ms?: number;
    cpu_usage_percent?: number;
    memory_usage_percent?: number;
  };
}

export interface HealthHistoryResponse {
  entries?: HealthHistoryEntry[];
  period_start?: string;
  period_end?: string;
  total_entries?: number;
}
