import { userManagementClient, handleUserManagementApiError } from './client';
import type {
  HealthCheckResponse,
  ComprehensiveHealthResponse,
  HealthHistoryResponse,
} from '@/types/user-management';

/**
 * Health monitoring API functions
 * Basic health endpoints are public, detailed health requires admin scope
 */
export const healthApi = {
  /**
   * Basic health check
   * Simple liveness check - returns basic service status
   * No authentication required
   */
  async getHealthCheck(): Promise<HealthCheckResponse> {
    try {
      const response = await userManagementClient.get('/health');
      return response.data as HealthCheckResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Liveness probe
   * Kubernetes/container orchestration compatible liveness endpoint
   * No authentication required
   */
  async getLivenessCheck(): Promise<{ status: 'ok' }> {
    try {
      const response = await userManagementClient.get('/live');
      return response.data as { status: 'ok' };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Comprehensive health check
   * Detailed system health including all service dependencies
   * Requires: admin scope (same endpoint as metrics/health/detailed)
   */
  async getComprehensiveHealth(): Promise<ComprehensiveHealthResponse> {
    try {
      const response = await userManagementClient.get(
        '/metrics/health/detailed'
      );
      return response.data as ComprehensiveHealthResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Get health history
   * Historical health status data for trend analysis
   * Requires: admin scope
   */
  async getHealthHistory(params?: {
    period_start?: string;
    period_end?: string;
    limit?: number;
  }): Promise<HealthHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period_start)
        queryParams.append('period_start', params.period_start);
      if (params?.period_end)
        queryParams.append('period_end', params.period_end);
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = queryString
        ? `/health/history?${queryString}`
        : '/health/history';

      const response = await userManagementClient.get(url);
      return response.data as HealthHistoryResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Check if service is ready to accept traffic
   * Readiness check that validates all dependencies
   * No authentication required
   */
  async getReadinessCheck(): Promise<{
    status: 'ready' | 'not_ready';
    checks: {
      database: 'pass' | 'fail';
      redis: 'pass' | 'fail';
      external_services: 'pass' | 'fail';
    };
  }> {
    try {
      const health = await this.getHealthCheck();

      // Basic readiness logic based on health check
      const isReady = health.status === 'healthy';

      return {
        status: isReady ? 'ready' : 'not_ready',
        checks: {
          database: isReady ? 'pass' : 'fail',
          redis: isReady ? 'pass' : 'fail',
          external_services: isReady ? 'pass' : 'fail',
        },
      };
    } catch {
      return {
        status: 'not_ready',
        checks: {
          database: 'fail',
          redis: 'fail',
          external_services: 'fail',
        },
      };
    }
  },

  /**
   * Get service uptime
   * Calculate service uptime from health check response
   */
  async getUptime(): Promise<{
    uptime_seconds: number;
    uptime_human: string;
  }> {
    try {
      const health = await this.getHealthCheck();
      const uptimeSeconds = health.uptime_seconds ?? 0;

      // Convert seconds to human readable format
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);

      let uptimeHuman = '';
      if (days > 0) uptimeHuman += `${days}d `;
      if (hours > 0) uptimeHuman += `${hours}h `;
      if (minutes > 0) uptimeHuman += `${minutes}m`;
      if (!uptimeHuman) uptimeHuman = '< 1m';

      return {
        uptime_seconds: uptimeSeconds,
        uptime_human: uptimeHuman.trim(),
      };
    } catch {
      return {
        uptime_seconds: 0,
        uptime_human: 'Unknown',
      };
    }
  },

  /**
   * Monitor service health with retry logic
   * Robust health checking with automatic retries
   */
  async monitorHealth(options?: {
    retries?: number;
    retryDelay?: number;
  }): Promise<{
    isHealthy: boolean;
    health: HealthCheckResponse | null;
    attempts: number;
    lastError?: string;
  }> {
    const retries = options?.retries ?? 3;
    const retryDelay = options?.retryDelay ?? 1000;

    let attempts = 0;
    let lastError: string | undefined;

    for (let i = 0; i <= retries; i++) {
      attempts++;

      try {
        const health = await this.getHealthCheck();

        return {
          isHealthy: health.status === 'healthy',
          health,
          attempts,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';

        if (i < retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      isHealthy: false,
      health: null,
      attempts,
      lastError,
    };
  },

  /**
   * Get health summary for dashboard
   * Combined health information for admin dashboard
   * Requires: admin scope for detailed information
   */
  async getHealthSummary(): Promise<{
    basic: HealthCheckResponse;
    detailed?: ComprehensiveHealthResponse;
    uptime: { uptime_seconds: number; uptime_human: string };
    readiness: { status: 'ready' | 'not_ready' };
  }> {
    try {
      const [basic, uptime, readiness] = await Promise.all([
        this.getHealthCheck(),
        this.getUptime(),
        this.getReadinessCheck(),
      ]);

      let detailed: ComprehensiveHealthResponse | undefined;

      // Try to get detailed health if admin permissions are available
      try {
        detailed = await this.getComprehensiveHealth();
      } catch {
        // Silently fail if no admin permissions
      }

      return {
        basic,
        detailed,
        uptime,
        readiness,
      };
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Check specific service component health
   * Focused health check for individual service components
   * Requires: admin scope
   */
  async checkServiceComponent(component: 'database' | 'redis'): Promise<{
    component: string;
    status: 'healthy' | 'unhealthy';
    response_time_ms?: number;
    details?: Record<string, unknown>;
  }> {
    try {
      const detailed = await this.getComprehensiveHealth();
      const componentData =
        detailed.services &&
        Object.prototype.hasOwnProperty.call(detailed.services, component)
          ? // eslint-disable-next-line security/detect-object-injection
            detailed.services[component]
          : undefined;

      return {
        component,
        status: componentData?.status ?? 'unhealthy',
        response_time_ms: componentData?.response_time_ms,
        details: componentData as Record<string, unknown>,
      };
    } catch {
      return {
        component,
        status: 'unhealthy',
        details: { error: 'Unable to check component health' },
      };
    }
  },

  /**
   * Health check with timeout
   * Health check that fails fast if service is unresponsive
   */
  async getHealthCheckWithTimeout(
    timeoutMs: number = 5000
  ): Promise<HealthCheckResponse> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), timeoutMs);
    });

    try {
      return await Promise.race([this.getHealthCheck(), timeoutPromise]);
    } catch (error) {
      throw error;
    }
  },
};
