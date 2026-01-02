import { userManagementClient, handleUserManagementApiError } from './client';
import type {
  PerformanceMetrics,
  CacheMetrics,
  SystemMetrics,
  DetailedHealthMetrics,
} from '@/types/user-management';

/**
 * Metrics API functions - ALL REQUIRE 'admin' OAuth2 scope
 * These endpoints provide comprehensive system monitoring and performance analytics
 *
 * Note: Per OpenAPI spec update, cache clear methods were moved to /admin/cache/clear
 * Use adminApi.clearCache() instead.
 */
export const metricsApi = {
  /**
   * Get performance metrics
   * Response times, request counts, error rates, and database performance
   * Requires: admin scope
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await userManagementClient.get('/metrics/performance');
      return response.data as PerformanceMetrics;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get cache metrics
   * Redis memory usage, hit rates, client connections, and key statistics
   * Requires: admin scope
   */
  async getCacheMetrics(): Promise<CacheMetrics> {
    try {
      const response = await userManagementClient.get('/metrics/cache');
      return response.data as CacheMetrics;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get system resource metrics
   * CPU, memory, disk usage, and process information
   * Requires: admin scope
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await userManagementClient.get('/metrics/system');
      return response.data as SystemMetrics;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get detailed health metrics
   * Comprehensive health status including service dependencies
   * Requires: admin scope
   */
  async getDetailedHealthMetrics(): Promise<DetailedHealthMetrics> {
    try {
      const response = await userManagementClient.get(
        '/metrics/health/detailed'
      );
      return response.data as DetailedHealthMetrics;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get comprehensive metrics dashboard
   * All metrics data for administrative dashboard
   * Requires: admin scope
   */
  async getMetricsDashboard(): Promise<{
    performance: PerformanceMetrics;
    cache: CacheMetrics;
    system: SystemMetrics;
    health: DetailedHealthMetrics;
    timestamp: string;
  }> {
    try {
      // Fetch all metrics in parallel for performance
      const [performance, cache, system, health] = await Promise.all([
        this.getPerformanceMetrics(),
        this.getCacheMetrics(),
        this.getSystemMetrics(),
        this.getDetailedHealthMetrics(),
      ]);

      return {
        performance,
        cache,
        system,
        health,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Monitor system health trends
   * Helper method to track health metrics over time
   * Requires: admin scope
   */
  async getHealthTrends(): Promise<{
    current: DetailedHealthMetrics;
    status: 'healthy' | 'degraded' | 'unhealthy';
    alerts: string[];
  }> {
    try {
      const health = await this.getDetailedHealthMetrics();
      const alerts: string[] = [];

      // Analyze health metrics and generate alerts (using camelCase per new spec)
      if (health.services?.redis?.status === 'unhealthy') {
        alerts.push('Redis service is unhealthy');
      }
      if (health.services?.database?.status === 'unhealthy') {
        alerts.push('Database service is unhealthy');
      }
      if (
        health.services?.redis?.hitRatePercent &&
        health.services.redis.hitRatePercent < 50
      ) {
        alerts.push('Low Redis hit rate detected');
      }

      return {
        current: health,
        status: health.overallStatus ?? 'unhealthy',
        alerts,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get performance alerts
   * Analyze performance metrics and identify issues
   * Requires: admin scope
   */
  async getPerformanceAlerts(): Promise<{
    metrics: PerformanceMetrics;
    alerts: Array<{
      severity: 'low' | 'medium' | 'high';
      message: string;
      metric: string;
      value: number | string;
    }>;
  }> {
    try {
      const metrics = await this.getPerformanceMetrics();
      const alerts: Array<{
        severity: 'low' | 'medium' | 'high';
        message: string;
        metric: string;
        value: number | string;
      }> = [];

      // Analyze performance metrics for alerts (using camelCase per new spec)
      if (
        metrics.responseTimes?.averageMs &&
        metrics.responseTimes.averageMs > 1000
      ) {
        alerts.push({
          severity: 'high',
          message: 'High average response time detected',
          metric: 'averageResponseTime',
          value: metrics.responseTimes.averageMs,
        });
      }

      if (
        metrics.errorRates?.errorRatePercent &&
        metrics.errorRates.errorRatePercent > 5
      ) {
        alerts.push({
          severity: 'high',
          message: 'High error rate detected',
          metric: 'errorRate',
          value: metrics.errorRates.errorRatePercent,
        });
      }

      if (
        metrics.database?.activeConnections &&
        metrics.database?.maxConnections
      ) {
        const utilization =
          (metrics.database.activeConnections /
            metrics.database.maxConnections) *
          100;
        if (utilization > 80) {
          alerts.push({
            severity: 'medium',
            message: 'High database connection utilization',
            metric: 'dbConnectionUtilization',
            value: utilization,
          });
        }
      }

      return {
        metrics,
        alerts,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get cache performance summary
   * Analyze cache metrics and provide optimization insights
   * Requires: admin scope
   */
  async getCachePerformanceSummary(): Promise<{
    metrics: CacheMetrics;
    performance: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
  }> {
    try {
      const metrics = await this.getCacheMetrics();
      const recommendations: string[] = [];
      let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'good';

      // Analyze cache hit rate (using camelCase per new spec)
      if (metrics.hitRate && metrics.hitRate < 0.5) {
        performance = 'poor';
        recommendations.push('Consider reviewing cache TTL settings');
        recommendations.push('Analyze cache key patterns for optimization');
      } else if (metrics.hitRate && metrics.hitRate < 0.7) {
        performance = 'fair';
        recommendations.push(
          'Consider optimizing frequently accessed data caching'
        );
      } else if (metrics.hitRate && metrics.hitRate > 0.9) {
        performance = 'excellent';
      }

      // Analyze evicted keys
      if (metrics.evictedKeys && metrics.evictedKeys > 1000) {
        recommendations.push(
          'High number of evicted keys - consider increasing cache memory'
        );
      }

      // Analyze connected clients
      if (metrics.connectedClients && metrics.connectedClients > 100) {
        recommendations.push(
          'High number of connected clients - monitor connection pooling'
        );
      }

      return {
        metrics,
        performance,
        recommendations,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },
};
