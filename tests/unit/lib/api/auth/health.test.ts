import { healthApi } from '@/lib/api/auth/health';
import { authClient } from '@/lib/api/auth/client';
import type {
  HealthResponse,
  ReadinessResponse,
  LivenessResponse,
} from '@/types/auth';

// Mock the auth client
jest.mock('@/lib/api/auth/client', () => ({
  authClient: {
    get: jest.fn(),
  },
  handleAuthApiError: jest.fn().mockImplementation(error => {
    throw new Error(error.message || 'API Error');
  }),
}));

const mockedAuthClient = authClient as jest.Mocked<typeof authClient>;

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should get health status when service is healthy', async () => {
      const mockResponse: HealthResponse = {
        status: 'healthy',
        timestamp: '2023-01-01T12:00:00Z',
        version: '1.0.0',
        uptime: '2h15m30s',
        components: {
          redis: {
            status: 'healthy',
            message: 'Redis is healthy',
            last_checked: '2023-01-01T12:00:00Z',
            response_time: '2ms',
          },
        },
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealth();

      expect(mockedAuthClient.get).toHaveBeenCalledWith('/health');
      expect(result).toEqual(mockResponse);
    });

    it('should get health status when service is unhealthy', async () => {
      const mockResponse: HealthResponse = {
        status: 'unhealthy',
        timestamp: '2023-01-01T12:00:00Z',
        components: {
          redis: {
            status: 'unhealthy',
            message: 'Redis connection failed',
            last_checked: '2023-01-01T12:00:00Z',
          },
        },
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getHealth();

      expect(result).toEqual(mockResponse);
    });

    it('should handle health check error', async () => {
      const error = new Error('Service unavailable');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(healthApi.getHealth()).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('getReadiness', () => {
    it('should get readiness status when service is ready', async () => {
      const mockResponse: ReadinessResponse = {
        ready: true,
        timestamp: '2023-01-01T12:00:00Z',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadiness();

      expect(mockedAuthClient.get).toHaveBeenCalledWith('/health/ready');
      expect(result).toEqual(mockResponse);
    });

    it('should get readiness status when service is not ready', async () => {
      const mockResponse: ReadinessResponse = {
        ready: false,
        timestamp: '2023-01-01T12:00:00Z',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getReadiness();

      expect(result).toEqual(mockResponse);
    });

    it('should handle readiness check error', async () => {
      const error = new Error('Readiness check failed');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(healthApi.getReadiness()).rejects.toThrow(
        'Readiness check failed'
      );
    });
  });

  describe('getLiveness', () => {
    it('should get liveness status', async () => {
      const mockResponse: LivenessResponse = {
        status: 'alive',
        timestamp: '2023-01-01T12:00:00Z',
        uptime: '1h 30m 45s',
      };

      mockedAuthClient.get.mockResolvedValue({ data: mockResponse });

      const result = await healthApi.getLiveness();

      expect(mockedAuthClient.get).toHaveBeenCalledWith('/health/live');
      expect(result).toEqual(mockResponse);
    });

    it('should handle liveness check error', async () => {
      const error = new Error('Liveness check failed');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(healthApi.getLiveness()).rejects.toThrow(
        'Liveness check failed'
      );
    });
  });

  describe('getMetrics', () => {
    it('should get metrics in Prometheus format', async () => {
      const mockMetrics = `# HELP auth_requests_total Total number of auth requests
# TYPE auth_requests_total counter
auth_requests_total{method="POST",endpoint="/login"} 42
auth_requests_total{method="POST",endpoint="/register"} 15

# HELP auth_request_duration_seconds Duration of auth requests
# TYPE auth_request_duration_seconds histogram
auth_request_duration_seconds_bucket{le="0.1"} 10
auth_request_duration_seconds_bucket{le="0.5"} 25
auth_request_duration_seconds_bucket{le="1.0"} 40
auth_request_duration_seconds_bucket{le="+Inf"} 42
auth_request_duration_seconds_sum 15.2
auth_request_duration_seconds_count 42`;

      mockedAuthClient.get.mockResolvedValue({ data: mockMetrics });

      const result = await healthApi.getMetrics();

      expect(mockedAuthClient.get).toHaveBeenCalledWith('/metrics', {
        headers: {
          Accept: 'text/plain',
        },
      });
      expect(result).toBe(mockMetrics);
      expect(typeof result).toBe('string');
    });

    it('should handle metrics fetch error', async () => {
      const error = new Error('Metrics unavailable');
      mockedAuthClient.get.mockRejectedValue(error);

      await expect(healthApi.getMetrics()).rejects.toThrow(
        'Metrics unavailable'
      );
    });
  });
});
