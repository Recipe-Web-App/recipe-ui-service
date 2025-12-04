import { recipeScraperClient, handleRecipeScraperApiError } from './client';
import type { HealthCheckResponse } from '@/types/recipe-scraper';

export const healthApi = {
  /**
   * Root endpoint providing basic service information and health status
   * GET /
   */
  async getRoot(): Promise<{
    service: string;
    version: string;
    status: string;
    docs: string;
    health: string;
  }> {
    try {
      const response = await recipeScraperClient.get('/');
      return response.data as {
        service: string;
        version: string;
        status: string;
        docs: string;
        health: string;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Prometheus metrics endpoint for monitoring and observability
   * GET /metrics
   */
  async getMetrics(): Promise<string> {
    try {
      const response = await recipeScraperClient.get('/metrics');
      return response.data as string;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Basic liveness check for Kubernetes/container orchestration
   * GET /api/liveness
   */
  async getLiveness(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    try {
      const response = await recipeScraperClient.get('/api/liveness');
      return response.data as {
        status: string;
        timestamp: string;
        service: string;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Readiness check including database and external dependencies
   * GET /api/readiness
   */
  async getReadiness(): Promise<{
    status: 'ready' | 'degraded';
    timestamp: string;
    checks: {
      database: {
        status: 'healthy' | 'degraded';
        response_time_ms: number;
        message: string;
      };
    };
    message: string;
  }> {
    try {
      const response = await recipeScraperClient.get('/api/readiness');
      return response.data as {
        status: 'ready' | 'degraded';
        timestamp: string;
        checks: {
          database: {
            status: 'healthy' | 'degraded';
            response_time_ms: number;
            message: string;
          };
        };
        message: string;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Comprehensive health check including all dependencies and metrics
   * GET /api/health
   */
  async getHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await recipeScraperClient.get('/api/health');
      return response.data as HealthCheckResponse;
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },

  /**
   * Legacy health check endpoint for backwards compatibility (deprecated)
   * GET /health
   */
  async getLegacyHealth(): Promise<{
    status: string;
  }> {
    try {
      const response = await recipeScraperClient.get('/health');
      return response.data as {
        status: string;
      };
    } catch (error) {
      handleRecipeScraperApiError(error);
      throw error;
    }
  },
};
