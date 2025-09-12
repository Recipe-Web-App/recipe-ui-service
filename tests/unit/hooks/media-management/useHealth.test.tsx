/**
 * Unit tests for health and monitoring hooks
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useMediaManagementHealth,
  useMediaManagementReadiness,
  useMediaManagementMetrics,
  useMediaManagementMonitoring,
  useMediaManagementHealthManager,
} from '@/hooks/media-management/useHealth';
import { healthApi } from '@/lib/api/media-management';
import { QUERY_KEYS } from '@/constants';
import type {
  HealthResponse,
  ReadinessResponse,
} from '@/types/media-management';

// Mock the health API
jest.mock('@/lib/api/media-management', () => ({
  healthApi: {
    getHealth: jest.fn(),
    getReadiness: jest.fn(),
    getMetrics: jest.fn(),
  },
}));

const mockedHealthApi = healthApi as jest.Mocked<typeof healthApi>;

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMediaManagementHealth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch health status successfully', async () => {
    const mockHealthResponse: HealthResponse = {
      status: 'healthy',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 15,
      checks: {
        database: { status: 'healthy', response_time_ms: 5 },
        storage: { status: 'healthy', response_time_ms: 8 },
        overall: 'healthy',
      },
    };

    mockedHealthApi.getHealth.mockResolvedValue(mockHealthResponse);

    const { result } = renderHook(() => useMediaManagementHealth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHealthApi.getHealth).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockHealthResponse);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useMediaManagementHealth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useMediaManagementHealth(false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Health check failed');
    mockedHealthApi.getHealth.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMediaManagementHealth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedHealthApi.getHealth).toHaveBeenCalled();
  });
});

describe('useMediaManagementReadiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch readiness status successfully', async () => {
    const mockReadinessResponse: ReadinessResponse = {
      status: 'ready',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 12,
      checks: {
        database: { status: 'ready', response_time_ms: 3 },
        storage: { status: 'ready', response_time_ms: 4 },
        overall: 'ready',
      },
    };

    mockedHealthApi.getReadiness.mockResolvedValue(mockReadinessResponse);

    const { result } = renderHook(() => useMediaManagementReadiness(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHealthApi.getReadiness).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockReadinessResponse);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useMediaManagementReadiness(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useMediaManagementReadiness(false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedHealthApi.getReadiness).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Readiness check failed');
    mockedHealthApi.getReadiness.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMediaManagementReadiness(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedHealthApi.getReadiness).toHaveBeenCalled();
  });
});

describe('useMediaManagementMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch metrics successfully', async () => {
    const mockMetricsResponse = `# HELP http_requests_total Total HTTP requests
http_requests_total{method="GET",status="200"} 1234
http_requests_total{method="POST",status="201"} 567
# HELP memory_usage_bytes Memory usage in bytes
memory_usage_bytes 1048576`;

    mockedHealthApi.getMetrics.mockResolvedValue(mockMetricsResponse);

    const { result } = renderHook(() => useMediaManagementMetrics(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedHealthApi.getMetrics).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockMetricsResponse);
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useMediaManagementMetrics(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useMediaManagementMetrics(false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(mockedHealthApi.getMetrics).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Metrics fetch failed');
    mockedHealthApi.getMetrics.mockRejectedValue(mockError);

    const { result } = renderHook(() => useMediaManagementMetrics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
    expect(mockedHealthApi.getMetrics).toHaveBeenCalled();
  });
});

describe('useMediaManagementMonitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should combine health, readiness, and metrics data', async () => {
    const mockHealthResponse: HealthResponse = {
      status: 'healthy',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 15,
      checks: {
        database: { status: 'healthy', response_time_ms: 5 },
        storage: { status: 'healthy', response_time_ms: 8 },
        overall: 'healthy',
      },
    };

    const mockReadinessResponse: ReadinessResponse = {
      status: 'ready',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 12,
      checks: {
        database: { status: 'ready', response_time_ms: 3 },
        storage: { status: 'ready', response_time_ms: 4 },
        overall: 'ready',
      },
    };

    const mockMetrics = 'http_requests_total 1234';

    mockedHealthApi.getHealth.mockResolvedValue(mockHealthResponse);
    mockedHealthApi.getReadiness.mockResolvedValue(mockReadinessResponse);
    mockedHealthApi.getMetrics.mockResolvedValue(mockMetrics);

    const { result } = renderHook(() => useMediaManagementMonitoring(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.health.isSuccess).toBe(true);
      expect(result.current.readiness.isSuccess).toBe(true);
      expect(result.current.metrics.isSuccess).toBe(true);
    });

    expect(result.current.isHealthy).toBe(true);
    expect(result.current.isReady).toBe(true);
    expect(result.current.hasMetrics).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle degraded health status', async () => {
    const mockHealthResponse: HealthResponse = {
      status: 'degraded',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 25,
      checks: {
        database: { status: 'healthy', response_time_ms: 5 },
        storage: { status: 'unhealthy', response_time_ms: 0 },
        overall: 'degraded',
      },
    };

    const mockReadinessResponse: ReadinessResponse = {
      status: 'ready',
      timestamp: '2024-01-15T10:30:00Z',
      service: 'media-management',
      version: '0.1.0',
      response_time_ms: 12,
      checks: {
        database: { status: 'ready', response_time_ms: 3 },
        storage: { status: 'not_ready', response_time_ms: 0 },
        overall: 'ready',
      },
    };

    mockedHealthApi.getHealth.mockResolvedValue(mockHealthResponse);
    mockedHealthApi.getReadiness.mockResolvedValue(mockReadinessResponse);
    mockedHealthApi.getMetrics.mockResolvedValue('');

    const { result } = renderHook(() => useMediaManagementMonitoring(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.health.isSuccess).toBe(true);
    });

    expect(result.current.isHealthy).toBe(false);
    expect(result.current.isReady).toBe(true);
    expect(result.current.hasMetrics).toBe(true); // Empty string is still defined
  });

  it('should respect enabled flag', () => {
    const { result } = renderHook(() => useMediaManagementMonitoring(false), {
      wrapper: createWrapper(),
    });

    expect(result.current.health.fetchStatus).toBe('idle');
    expect(result.current.readiness.fetchStatus).toBe('idle');
    expect(result.current.metrics.fetchStatus).toBe('idle');
    expect(mockedHealthApi.getHealth).not.toHaveBeenCalled();
    expect(mockedHealthApi.getReadiness).not.toHaveBeenCalled();
    expect(mockedHealthApi.getMetrics).not.toHaveBeenCalled();
  });
});

describe('useMediaManagementHealthManager', () => {
  it('should provide query key helpers', () => {
    const { result } = renderHook(() => useMediaManagementHealthManager());

    expect(result.current.getHealthQueryKey()).toEqual(
      QUERY_KEYS.MEDIA_MANAGEMENT.HEALTH
    );
    expect(result.current.getReadinessQueryKey()).toEqual(
      QUERY_KEYS.MEDIA_MANAGEMENT.READINESS
    );
    expect(result.current.getMetricsQueryKey()).toEqual(
      QUERY_KEYS.MEDIA_MANAGEMENT.METRICS
    );
  });

  it('should provide service status helpers', () => {
    const { result } = renderHook(() => useMediaManagementHealthManager());

    // Test operational status
    expect(result.current.isServiceOperational('healthy', 'ready')).toBe(true);
    expect(result.current.isServiceOperational('healthy', 'not_ready')).toBe(
      false
    );
    expect(result.current.isServiceOperational('degraded', 'ready')).toBe(
      false
    );

    // Test degraded status
    expect(result.current.isServiceDegraded('degraded', 'ready')).toBe(true);
    expect(result.current.isServiceDegraded('healthy', 'not_ready')).toBe(true);
    expect(result.current.isServiceDegraded('healthy', 'ready')).toBe(false);
  });

  it('should parse Prometheus metrics correctly', () => {
    const { result } = renderHook(() => useMediaManagementHealthManager());

    const mockMetrics = `# HELP http_requests_total Total HTTP requests
http_requests_total{method="GET"} 1234
# Comment line
memory_usage_bytes 1048576
invalid_line_without_space
`;

    const parsedMetrics = result.current.parseMetrics(mockMetrics);

    expect(parsedMetrics.get('http_requests_total{method="GET"}')).toBe('1234');
    expect(parsedMetrics.get('memory_usage_bytes')).toBe('1048576');
    expect(parsedMetrics.has('invalid_line_without_space')).toBe(false);
    expect(parsedMetrics.size).toBe(2);
  });

  it('should handle empty metrics', () => {
    const { result } = renderHook(() => useMediaManagementHealthManager());

    const emptyResult = result.current.parseMetrics('');
    expect(emptyResult.size).toBe(0);

    const nullResult = result.current.parseMetrics(null as any);
    expect(nullResult.size).toBe(0);
  });
});
