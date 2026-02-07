import { healthApi } from '@/lib/api/recipe-scraper/health';
import { RecipeScraperApiError } from '@/lib/api/recipe-scraper/client';
import type {
  HealthCheckResponse,
  HealthCheckItem,
} from '@/types/recipe-scraper';

// Mock the client
jest.mock('@/lib/api/recipe-scraper/client', () => {
  const originalModule = jest.requireActual('@/lib/api/recipe-scraper/client');
  return {
    ...originalModule,
    recipeScraperClient: {
      get: jest.fn(),
    },
    handleRecipeScraperApiError: jest
      .fn()
      .mockImplementation((error: unknown) => {
        if (error instanceof Error) {
          throw new originalModule.RecipeScraperApiError(error.message, 500);
        }
        throw new originalModule.RecipeScraperApiError('Unknown error', 500);
      }),
  };
});

const mockClient =
  require('@/lib/api/recipe-scraper/client').recipeScraperClient;

describe('Recipe Scraper Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoot', () => {
    it('should fetch root endpoint successfully', async () => {
      const mockResponse = {
        service: 'Recipe Scraper Service',
        version: '2.0.0',
        status: 'operational',
        docs: '/docs',
        health: '/api/v1/health',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getRoot();

      expect(mockClient.get).toHaveBeenCalledWith('/');
      expect(result).toEqual(mockResponse);
      expect(result.service).toBe('Recipe Scraper Service');
      expect(result.version).toBe('2.0.0');
      expect(result.status).toBe('operational');
      expect(result.docs).toBe('/docs');
      expect(result.health).toBe('/api/v1/health');
    });

    it('should handle errors from root endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Network error'));

      await expect(healthApi.getRoot()).rejects.toThrow('Network error');
      expect(mockClient.get).toHaveBeenCalledWith('/');
    });
  });

  describe('getMetrics', () => {
    it('should fetch Prometheus metrics successfully', async () => {
      const mockMetrics = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/api/health"} 42`;

      mockClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await healthApi.getMetrics();

      expect(mockClient.get).toHaveBeenCalledWith('/metrics');
      expect(result).toBe(mockMetrics);
      expect(typeof result).toBe('string');
      expect(result).toContain('http_requests_total');
    });

    it('should handle errors from metrics endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Metrics unavailable'));

      await expect(healthApi.getMetrics()).rejects.toThrow(
        'Metrics unavailable'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/metrics');
    });
  });

  describe('getLiveness', () => {
    it('should fetch liveness status successfully', async () => {
      const mockResponse = {
        status: 'alive',
        timestamp: '2025-01-31T12:00:00Z',
        service: 'recipe-scraper-service',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getLiveness();

      expect(mockClient.get).toHaveBeenCalledWith('/api/liveness');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('alive');
      expect(result.timestamp).toBe('2025-01-31T12:00:00Z');
      expect(result.service).toBe('recipe-scraper-service');
    });

    it('should handle errors from liveness endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Service not alive'));

      await expect(healthApi.getLiveness()).rejects.toThrow(
        'Service not alive'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/api/liveness');
    });
  });

  describe('getReadiness', () => {
    it('should fetch readiness status successfully', async () => {
      const mockResponse = {
        status: 'ready' as const,
        timestamp: '2025-01-31T12:00:00Z',
        checks: {
          database: {
            status: 'healthy' as const,
            responseTimeMs: 15.2,
            message: 'Database connection healthy',
          },
        },
        message: 'Service ready',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadiness();

      expect(mockClient.get).toHaveBeenCalledWith('/api/readiness');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('ready');
      expect(result.checks.database.status).toBe('healthy');
      expect(result.checks.database.responseTimeMs).toBe(15.2);
    });

    it('should handle degraded readiness status', async () => {
      const mockResponse = {
        status: 'degraded' as const,
        timestamp: '2025-01-31T12:00:00Z',
        checks: {
          database: {
            status: 'degraded' as const,
            responseTimeMs: 500,
            message: 'Database slow response',
          },
        },
        message: 'Service degraded but operational',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadiness();

      expect(result.status).toBe('degraded');
      expect(result.checks.database.status).toBe('degraded');
    });

    it('should handle errors from readiness endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Readiness check failed'));

      await expect(healthApi.getReadiness()).rejects.toThrow(
        'Readiness check failed'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/api/readiness');
    });
  });

  describe('getHealth', () => {
    it('should fetch comprehensive health status successfully', async () => {
      const mockHealthCheckItem: HealthCheckItem = {
        status: 'healthy',
        responseTimeMs: 25.5,
        message: 'All systems operational',
      };

      const mockResponse: HealthCheckResponse = {
        status: 'healthy',
        timestamp: '2025-01-31T12:00:00Z',
        version: '2.0.0',
        uptimeSeconds: 3600,
        checks: {
          database: mockHealthCheckItem,
          cache: {
            status: 'healthy',
            responseTimeMs: 5.1,
            message: 'Cache operational',
          },
          externalApis: {
            spoonacular: {
              status: 'healthy',
              responseTimeMs: 120.3,
              message: 'Spoonacular API responsive',
            },
          },
        },
        databaseMonitoring: {
          enabled: true,
          lastCheck: '2025-01-31T12:00:00Z',
        },
        responseTimeMs: 45.2,
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealth();

      expect(mockClient.get).toHaveBeenCalledWith('/api/health');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('healthy');
      expect(result.version).toBe('2.0.0');
      expect(result.uptimeSeconds).toBe(3600);
      expect(result.checks.database?.status).toBe('healthy');
      expect(result.checks.cache?.status).toBe('healthy');
      expect(result.checks.externalApis?.spoonacular?.status).toBe('healthy');
      expect(result.databaseMonitoring?.enabled).toBe(true);
      expect(result.responseTimeMs).toBe(45.2);
    });

    it('should handle degraded health status', async () => {
      const mockResponse: HealthCheckResponse = {
        status: 'degraded',
        timestamp: '2025-01-31T12:00:00Z',
        version: '2.0.0',
        checks: {
          database: {
            status: 'degraded',
            responseTimeMs: 500,
            message: 'Database slow',
          },
        },
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.checks.database?.status).toBe('degraded');
    });

    it('should handle unhealthy status with 503 response', async () => {
      const mockResponse: HealthCheckResponse = {
        status: 'unhealthy',
        timestamp: '2025-01-31T12:00:00Z',
        version: '2.0.0',
        checks: {
          database: {
            status: 'unhealthy',
            responseTimeMs: 0,
            message: 'Database connection failed',
          },
        },
      };

      // Even though the API might return 503, the client should still return the data
      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('unhealthy');
      expect(result.checks.database?.status).toBe('unhealthy');
    });

    it('should handle errors from health endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Health check failed'));

      await expect(healthApi.getHealth()).rejects.toThrow(
        'Health check failed'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/api/health');
    });
  });

  describe('getLegacyHealth', () => {
    it('should fetch legacy health status successfully', async () => {
      const mockResponse = {
        status: 'ok',
      };

      mockClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getLegacyHealth();

      expect(mockClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse);
      expect(result.status).toBe('ok');
    });

    it('should handle errors from legacy health endpoint', async () => {
      mockClient.get.mockRejectedValue(new Error('Legacy endpoint failed'));

      await expect(healthApi.getLegacyHealth()).rejects.toThrow(
        'Legacy endpoint failed'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/health');
    });
  });
});
