import { userManagementClient, handleUserManagementApiError } from './client';
import type {
  ComprehensiveHealthResponse,
  ReadinessResponse,
  LivenessResponse,
} from '@/types/user-management';

/**
 * Health monitoring API functions
 * Basic health endpoints are public, detailed health requires admin scope
 *
 * Note: Per OpenAPI spec update:
 * - /live endpoint removed (use /health for liveness)
 * - /health/history endpoint removed
 * - /ready endpoint added for readiness checks
 */
export const healthApi = {
  /**
   * Basic health/liveness check
   * Simple liveness check - returns basic service status
   * No authentication required
   */
  async getHealthCheck(): Promise<LivenessResponse> {
    try {
      const response = await userManagementClient.get('/health');
      return response.data as LivenessResponse;
    } catch (error) {
      handleUserManagementApiError(error);
      throw error; // This line should never be reached since handleUserManagementApiError throws
    }
  },

  /**
   * Readiness check
   * Returns 200 OK if service is ready to accept traffic
   * Returns degraded status when database is down but Redis is healthy
   * Returns 503 when Redis is unavailable (JWT sessions are critical)
   * No authentication required
   */
  async getReadinessCheck(): Promise<ReadinessResponse> {
    try {
      const response = await userManagementClient.get('/ready');
      return response.data as ReadinessResponse;
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
   * Get service uptime
   * Calculate service uptime from health check response
   */
  async getUptime(): Promise<{
    uptimeSeconds: number;
    uptimeHuman: string;
  }> {
    try {
      // Use comprehensive health which has uptime info
      const health = await this.getComprehensiveHealth();
      const uptimeSeconds = health.uptimeSeconds ?? 0;

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
        uptimeSeconds,
        uptimeHuman: uptimeHuman.trim(),
      };
    } catch {
      return {
        uptimeSeconds: 0,
        uptimeHuman: 'Unknown',
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
    health: LivenessResponse | null;
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
          isHealthy: health.status === 'UP',
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
    liveness: LivenessResponse;
    readiness: ReadinessResponse;
    detailed?: ComprehensiveHealthResponse;
    uptime: { uptimeSeconds: number; uptimeHuman: string };
  }> {
    try {
      const [liveness, readiness, uptime] = await Promise.all([
        this.getHealthCheck(),
        this.getReadinessCheck(),
        this.getUptime(),
      ]);

      let detailed: ComprehensiveHealthResponse | undefined;

      // Try to get detailed health if admin permissions are available
      try {
        detailed = await this.getComprehensiveHealth();
      } catch {
        // Silently fail if no admin permissions
      }

      return {
        liveness,
        readiness,
        detailed,
        uptime,
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
    responseTimeMs?: number;
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
        responseTimeMs: componentData?.responseTimeMs,
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
  ): Promise<LivenessResponse> {
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
