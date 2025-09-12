import { healthApi } from '@/lib/api/media-management/health';
import {
  mediaManagementClient,
  handleMediaManagementApiError,
} from '@/lib/api/media-management/client';
import { HealthResponse, ReadinessResponse } from '@/types/media-management';

// Mock the client
jest.mock('@/lib/api/media-management/client', () => ({
  mediaManagementClient: {
    get: jest.fn(),
  },
  handleMediaManagementApiError: jest.fn(),
}));

const mockedClient = mediaManagementClient as jest.Mocked<
  typeof mediaManagementClient
>;
const mockedErrorHandler = handleMediaManagementApiError as jest.MockedFunction<
  typeof handleMediaManagementApiError
>;

describe('Media Management Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHealthResponse: HealthResponse = {
    status: 'healthy',
    timestamp: '2025-01-15T10:30:00Z',
    service: 'media-management-service',
    version: '0.1.0',
    response_time_ms: 25,
    checks: {
      database: {
        status: 'healthy',
        response_time_ms: 5,
      },
      storage: {
        status: 'healthy',
        response_time_ms: 3,
      },
      overall: 'healthy',
    },
  };

  const mockReadinessResponse: ReadinessResponse = {
    status: 'ready',
    timestamp: '2025-01-15T10:30:00Z',
    service: 'media-management-service',
    version: '0.1.0',
    response_time_ms: 25,
    checks: {
      database: {
        status: 'ready',
        response_time_ms: 5,
      },
      storage: {
        status: 'ready',
        response_time_ms: 3,
      },
      overall: 'ready',
    },
  };

  describe('getHealth', () => {
    it('should get health status successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthResponse });

      const result = await healthApi.getHealth();

      expect(mockedClient.get).toHaveBeenCalledWith('/health', {
        headers: { Authorization: undefined },
      });
      expect(result).toEqual(mockHealthResponse);
    });

    it('should handle degraded health status', async () => {
      const degradedResponse: HealthResponse = {
        ...mockHealthResponse,
        status: 'degraded',
        checks: {
          database: {
            status: 'unhealthy',
            response_time_ms: 2000,
          },
          storage: {
            status: 'healthy',
            response_time_ms: 3,
          },
          overall: 'degraded',
        },
      };

      mockedClient.get.mockResolvedValue({ data: degradedResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('degraded');
      expect(result.checks.overall).toBe('degraded');
    });

    it('should handle unhealthy status', async () => {
      const unhealthyResponse: HealthResponse = {
        ...mockHealthResponse,
        status: 'unhealthy',
        checks: {
          database: {
            status: 'timeout',
            response_time_ms: 2000,
          },
          storage: {
            status: 'unhealthy',
            response_time_ms: 2000,
          },
          overall: 'unhealthy',
        },
      };

      mockedClient.get.mockResolvedValue({ data: unhealthyResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('unhealthy');
      expect(result.checks.overall).toBe('unhealthy');
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Network error');
      mockedClient.get.mockRejectedValue(apiError);
      mockedErrorHandler.mockImplementation(error => {
        throw error;
      });

      await expect(healthApi.getHealth()).rejects.toThrow('Network error');

      expect(mockedClient.get).toHaveBeenCalledWith('/health', {
        headers: { Authorization: undefined },
      });
      expect(mockedErrorHandler).toHaveBeenCalledWith(apiError);
    });
  });

  describe('getReadiness', () => {
    it('should get readiness status successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockReadinessResponse });

      const result = await healthApi.getReadiness();

      expect(mockedClient.get).toHaveBeenCalledWith('/ready', {
        headers: { Authorization: undefined },
      });
      expect(result).toEqual(mockReadinessResponse);
    });

    it('should handle not ready status', async () => {
      const notReadyResponse: ReadinessResponse = {
        ...mockReadinessResponse,
        status: 'not_ready',
        checks: {
          database: {
            status: 'timeout',
            response_time_ms: 2000,
          },
          storage: {
            status: 'ready',
            response_time_ms: 3,
          },
          overall: 'not_ready',
        },
      };

      mockedClient.get.mockResolvedValue({ data: notReadyResponse });

      const result = await healthApi.getReadiness();

      expect(result.status).toBe('not_ready');
      expect(result.checks.overall).toBe('not_ready');
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Service unavailable');
      mockedClient.get.mockRejectedValue(apiError);
      mockedErrorHandler.mockImplementation(error => {
        throw error;
      });

      await expect(healthApi.getReadiness()).rejects.toThrow(
        'Service unavailable'
      );

      expect(mockedClient.get).toHaveBeenCalledWith('/ready', {
        headers: { Authorization: undefined },
      });
      expect(mockedErrorHandler).toHaveBeenCalledWith(apiError);
    });
  });

  describe('getMetrics', () => {
    it('should get Prometheus metrics successfully', async () => {
      const mockMetrics = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status="200"} 42

# HELP media_uploads_total Total number of media uploads
# TYPE media_uploads_total counter
media_uploads_total{status="success"} 15
media_uploads_total{status="failed"} 2`;

      mockedClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await healthApi.getMetrics();

      expect(mockedClient.get).toHaveBeenCalledWith('/metrics', {
        headers: {
          Authorization: undefined,
          Accept: 'text/plain; version=0.0.4; charset=utf-8',
        },
      });
      expect(result).toBe(mockMetrics);
      expect(result).toContain('http_requests_total');
      expect(result).toContain('media_uploads_total');
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Metrics endpoint error');
      mockedClient.get.mockRejectedValue(apiError);
      mockedErrorHandler.mockImplementation(error => {
        throw error;
      });

      await expect(healthApi.getMetrics()).rejects.toThrow(
        'Metrics endpoint error'
      );

      expect(mockedClient.get).toHaveBeenCalledWith('/metrics', {
        headers: {
          Authorization: undefined,
          Accept: 'text/plain; version=0.0.4; charset=utf-8',
        },
      });
      expect(mockedErrorHandler).toHaveBeenCalledWith(apiError);
    });
  });
});
