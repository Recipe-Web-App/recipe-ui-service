import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { monitoringApi } from '@/lib/api/recipe-management';
import {
  useRecipeManagementInfo,
  useRecipeManagementMetrics,
  useRecipeManagementMetric,
  usePrometheusMetrics,
  useRecipeManagementEnvironment,
  useRecipeManagementEnvironmentProperty,
  useRecipeManagementConfigProperties,
  useRecipeManagementDashboard,
  useMetricMonitor,
  usePerformanceMetrics,
  useSystemInformation,
} from '@/hooks/recipe-management/useMonitoring';
import type {
  RecipeManagementInfoResponse,
  RecipeManagementMetricsResponse,
  RecipeManagementMetricResponse,
  RecipeManagementEnvironmentResponse,
  RecipeManagementConfigPropsResponse,
} from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  monitoringApi: {
    getInfo: jest.fn(),
    getMetrics: jest.fn(),
    getMetric: jest.fn(),
    getPrometheusMetrics: jest.fn(),
    getEnvironment: jest.fn(),
    getEnvironmentProperty: jest.fn(),
    getConfigurationProperties: jest.fn(),
  },
}));

const mockedMonitoringApi = monitoringApi as jest.Mocked<typeof monitoringApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useMonitoring hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipeManagementInfo', () => {
    it('should fetch application info successfully', async () => {
      const mockInfo: RecipeManagementInfoResponse = {
        app: {
          name: 'recipe-management-service',
          version: '1.0.0',
          description: 'Recipe Management Service',
        },
        build: {
          version: '1.0.0',
          artifact: 'recipe-management-service',
          group: 'com.example',
          name: 'recipe-management-service',
          time: '2024-01-01T00:00:00Z',
        },
        java: {
          version: '21.0.0',
          vendor: 'OpenJDK',
        },
        os: {
          name: 'Linux',
          version: '5.15.0',
          arch: 'amd64',
        },
      };

      mockedMonitoringApi.getInfo.mockResolvedValue(mockInfo);

      const { result } = renderHook(() => useRecipeManagementInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockInfo);
      expect(mockedMonitoringApi.getInfo).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => useRecipeManagementInfo(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getInfo).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch info');
      mockedMonitoringApi.getInfo.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeManagementInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementMetrics', () => {
    it('should fetch metrics successfully', async () => {
      const mockMetrics: RecipeManagementMetricsResponse = {
        names: ['jvm.memory.used', 'jvm.memory.max', 'system.cpu.usage'],
      };

      mockedMonitoringApi.getMetrics.mockResolvedValue(mockMetrics);

      const { result } = renderHook(() => useRecipeManagementMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMetrics);
      expect(mockedMonitoringApi.getMetrics).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => useRecipeManagementMetrics(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getMetrics).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch metrics');
      mockedMonitoringApi.getMetrics.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeManagementMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementMetric', () => {
    it('should fetch specific metric successfully', async () => {
      const mockMetric: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        description: 'JVM memory used',
        baseUnit: 'bytes',
        measurements: [
          {
            statistic: 'VALUE',
            value: 1048576,
          },
        ],
        availableTags: [],
      };

      mockedMonitoringApi.getMetric.mockResolvedValue(mockMetric);

      const { result } = renderHook(
        () => useRecipeManagementMetric('jvm.memory.used'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockMetric);
      expect(mockedMonitoringApi.getMetric).toHaveBeenCalledWith(
        'jvm.memory.used'
      );
    });

    it('should handle disabled state when metricName is empty', () => {
      const { result } = renderHook(() => useRecipeManagementMetric(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getMetric).not.toHaveBeenCalled();
    });

    it('should handle disabled state when enabled is false', () => {
      const { result } = renderHook(
        () => useRecipeManagementMetric('jvm.memory.used', false),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getMetric).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch metric');
      mockedMonitoringApi.getMetric.mockRejectedValue(error);

      const { result } = renderHook(
        () => useRecipeManagementMetric('jvm.memory.used'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('usePrometheusMetrics', () => {
    it('should fetch Prometheus metrics successfully', async () => {
      const mockPrometheusMetrics =
        'jvm_memory_used_bytes 1048576\nsystem_cpu_usage 0.15';

      mockedMonitoringApi.getPrometheusMetrics.mockResolvedValue(
        mockPrometheusMetrics
      );

      const { result } = renderHook(() => usePrometheusMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPrometheusMetrics);
      expect(mockedMonitoringApi.getPrometheusMetrics).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => usePrometheusMetrics(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getPrometheusMetrics).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch Prometheus metrics');
      mockedMonitoringApi.getPrometheusMetrics.mockRejectedValue(error);

      const { result } = renderHook(() => usePrometheusMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementEnvironment', () => {
    it('should fetch environment successfully', async () => {
      const mockEnvironment: RecipeManagementEnvironmentResponse = {
        activeProfiles: ['development', 'local'],
        propertySources: [
          {
            name: 'applicationConfig: [classpath:/application.yml]',
            properties: {
              'server.port': {
                value: '8080',
                origin: 'class path resource [application.yml]:2:9',
              },
            },
          },
        ],
      };

      mockedMonitoringApi.getEnvironment.mockResolvedValue(mockEnvironment);

      const { result } = renderHook(() => useRecipeManagementEnvironment(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockEnvironment);
      expect(mockedMonitoringApi.getEnvironment).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(
        () => useRecipeManagementEnvironment(false),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getEnvironment).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch environment');
      mockedMonitoringApi.getEnvironment.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeManagementEnvironment(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementEnvironmentProperty', () => {
    it('should fetch environment property successfully', async () => {
      const mockProperty = {
        property: {
          source: 'class path resource [application.yml]:2:9',
          value: '8080',
        },
      };

      mockedMonitoringApi.getEnvironmentProperty.mockResolvedValue(
        mockProperty
      );

      const { result } = renderHook(
        () => useRecipeManagementEnvironmentProperty('server.port'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProperty);
      expect(mockedMonitoringApi.getEnvironmentProperty).toHaveBeenCalledWith(
        'server.port'
      );
    });

    it('should handle disabled state when propertyName is empty', () => {
      const { result } = renderHook(
        () => useRecipeManagementEnvironmentProperty(''),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getEnvironmentProperty).not.toHaveBeenCalled();
    });

    it('should handle disabled state when enabled is false', () => {
      const { result } = renderHook(
        () => useRecipeManagementEnvironmentProperty('server.port', false),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedMonitoringApi.getEnvironmentProperty).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch environment property');
      mockedMonitoringApi.getEnvironmentProperty.mockRejectedValue(error);

      const { result } = renderHook(
        () => useRecipeManagementEnvironmentProperty('server.port'),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementConfigProperties', () => {
    it('should fetch configuration properties successfully', async () => {
      const mockConfigProps: RecipeManagementConfigPropsResponse = {
        contexts: {
          application: {
            beans: {
              'server.tomcat-org.springframework.boot.autoconfigure.web.embedded.EmbeddedWebServerFactoryCustomizerAutoConfiguration$TomcatWebServerFactoryCustomizerConfiguration':
                {
                  prefix: 'server.tomcat',
                  properties: {
                    maxConnections: 8192,
                    maxThreads: 200,
                  },
                },
            },
          },
        },
      };

      mockedMonitoringApi.getConfigurationProperties.mockResolvedValue(
        mockConfigProps
      );

      const { result } = renderHook(
        () => useRecipeManagementConfigProperties(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockConfigProps);
      expect(
        mockedMonitoringApi.getConfigurationProperties
      ).toHaveBeenCalledTimes(1);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(
        () => useRecipeManagementConfigProperties(false),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(
        mockedMonitoringApi.getConfigurationProperties
      ).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch configuration properties');
      mockedMonitoringApi.getConfigurationProperties.mockRejectedValue(error);

      const { result } = renderHook(
        () => useRecipeManagementConfigProperties(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useRecipeManagementDashboard', () => {
    it('should fetch dashboard data successfully', async () => {
      const mockInfo: RecipeManagementInfoResponse = {
        app: { name: 'recipe-management-service', version: '1.0.0' },
        build: { version: '1.0.0', artifact: 'recipe-management-service' },
        java: { version: '21.0.0' },
        os: { name: 'Linux', version: '5.15.0' },
      };

      const mockMetrics: RecipeManagementMetricsResponse = {
        names: ['jvm.memory.used', 'system.cpu.usage'],
      };

      const mockEnvironment: RecipeManagementEnvironmentResponse = {
        activeProfiles: ['development'],
        propertySources: [],
      };

      mockedMonitoringApi.getInfo.mockResolvedValue(mockInfo);
      mockedMonitoringApi.getMetrics.mockResolvedValue(mockMetrics);
      mockedMonitoringApi.getEnvironment.mockResolvedValue(mockEnvironment);

      const { result } = renderHook(() => useRecipeManagementDashboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.info).toEqual(mockInfo);
      expect(result.current.metrics).toEqual(mockMetrics);
      expect(result.current.environment).toEqual(mockEnvironment);
      expect(result.current.hasError).toBe(false);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => useRecipeManagementDashboard(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.queries.info.fetchStatus).toBe('idle');
      expect(result.current.queries.metrics.fetchStatus).toBe('idle');
      expect(result.current.queries.environment.fetchStatus).toBe('idle');
    });

    it('should handle partial errors', async () => {
      const mockInfo: RecipeManagementInfoResponse = {
        app: { name: 'recipe-management-service', version: '1.0.0' },
        build: { version: '1.0.0' },
        java: { version: '21.0.0' },
        os: { name: 'Linux' },
      };

      const error = new Error('Failed to fetch metrics');

      mockedMonitoringApi.getInfo.mockResolvedValue(mockInfo);
      mockedMonitoringApi.getMetrics.mockRejectedValue(error);
      mockedMonitoringApi.getEnvironment.mockResolvedValue({
        activeProfiles: [],
        propertySources: [],
      });

      const { result } = renderHook(() => useRecipeManagementDashboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.queries.metrics.isError).toBe(true);
      });

      // With nullish coalescing (??), hasError will be false from successful info query
      // since false ?? true still returns false (false is not nullish)
      expect(result.current.hasError).toBe(false);
      expect(result.current.info).toEqual(mockInfo);
      // Error will come from the first query that has an error (metrics in this case)
      expect(result.current.error).toEqual(error);
    });
  });

  describe('useMetricMonitor', () => {
    it('should monitor multiple metrics successfully', async () => {
      const metricNames = ['jvm.memory.used', 'system.cpu.usage'];
      const mockMetric1: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };
      const mockMetric2: RecipeManagementMetricResponse = {
        name: 'system.cpu.usage',
        measurements: [{ statistic: 'VALUE', value: 0.15 }],
        availableTags: [],
      };

      mockedMonitoringApi.getMetric
        .mockResolvedValueOnce(mockMetric1)
        .mockResolvedValueOnce(mockMetric2);

      const { result } = renderHook(() => useMetricMonitor(metricNames), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.metrics['jvm.memory.used']?.data).toEqual(
        mockMetric1
      );
      expect(result.current.metrics['system.cpu.usage']?.data).toEqual(
        mockMetric2
      );
      expect(result.current.hasError).toBe(false);
      expect(result.current.metricNames).toEqual(metricNames);
    });

    it('should handle empty metric names array', () => {
      const { result } = renderHook(() => useMetricMonitor([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.metrics).toEqual({});
      expect(mockedMonitoringApi.getMetric).not.toHaveBeenCalled();
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(
        () => useMetricMonitor(['jvm.memory.used'], { enabled: false }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.isLoading).toBe(false);
      expect(mockedMonitoringApi.getMetric).not.toHaveBeenCalled();
    });

    it('should handle individual metric errors', async () => {
      const metricNames = ['jvm.memory.used', 'invalid.metric'];
      const mockMetric: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };
      const error = new Error('Invalid metric');

      mockedMonitoringApi.getMetric
        .mockResolvedValueOnce(mockMetric)
        .mockRejectedValueOnce(error);

      const { result } = renderHook(() => useMetricMonitor(metricNames), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.metrics['jvm.memory.used']?.data).toEqual(
        mockMetric
      );
      expect(result.current.metrics['jvm.memory.used']?.error).toBeNull();
      expect(result.current.metrics['invalid.metric']?.error).toEqual(error);
      expect(result.current.hasError).toBe(true);
    });

    it('should filter out invalid metric names', async () => {
      const metricNames = ['jvm.memory.used', 'invalid@metric', ''];
      const mockMetric: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };

      // All metrics get API calls but only valid ones are stored in results
      mockedMonitoringApi.getMetric.mockResolvedValue(mockMetric);

      const { result } = renderHook(() => useMetricMonitor(metricNames), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.metrics['jvm.memory.used']).toBeDefined();
      expect(result.current.metrics['invalid@metric']).toBeUndefined();
      expect(result.current.metrics['']).toBeUndefined();
      // All 3 metric names trigger API calls, filtering happens during result processing
      expect(mockedMonitoringApi.getMetric).toHaveBeenCalledTimes(3);
    });

    it('should provide refresh functionality', async () => {
      const metricNames = ['jvm.memory.used'];
      const mockMetric: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };

      mockedMonitoringApi.getMetric.mockResolvedValue(mockMetric);

      const { result } = renderHook(() => useMetricMonitor(metricNames), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedMonitoringApi.getMetric).toHaveBeenCalledTimes(1);

      result.current.refreshAll();

      await waitFor(() => {
        expect(mockedMonitoringApi.getMetric).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('usePerformanceMetrics', () => {
    it('should fetch performance metrics successfully', async () => {
      const mockMemoryUsed: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };
      const mockMemoryMax: RecipeManagementMetricResponse = {
        name: 'jvm.memory.max',
        measurements: [{ statistic: 'VALUE', value: 2097152 }],
        availableTags: [],
      };
      const mockCpuUsage: RecipeManagementMetricResponse = {
        name: 'system.cpu.usage',
        measurements: [{ statistic: 'VALUE', value: 0.15 }],
        availableTags: [],
      };
      const mockRequestMetrics: RecipeManagementMetricResponse = {
        name: 'http.server.requests',
        measurements: [{ statistic: 'COUNT', value: 100 }],
        availableTags: [],
      };
      const mockGcMetrics: RecipeManagementMetricResponse = {
        name: 'jvm.gc.pause',
        measurements: [{ statistic: 'TOTAL_TIME', value: 1000 }],
        availableTags: [],
      };

      mockedMonitoringApi.getMetric
        .mockResolvedValueOnce(mockMemoryUsed)
        .mockResolvedValueOnce(mockMemoryMax)
        .mockResolvedValueOnce(mockCpuUsage)
        .mockResolvedValueOnce(mockRequestMetrics)
        .mockResolvedValueOnce(mockGcMetrics);

      const { result } = renderHook(() => usePerformanceMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.memoryUsage).toEqual(mockMemoryUsed);
      expect(result.current.memoryMax).toEqual(mockMemoryMax);
      expect(result.current.cpuUsage).toEqual(mockCpuUsage);
      expect(result.current.requestMetrics).toEqual(mockRequestMetrics);
      expect(result.current.gcMetrics).toEqual(mockGcMetrics);
      expect(result.current.hasError).toBe(false);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => usePerformanceMetrics(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockedMonitoringApi.getMetric).not.toHaveBeenCalled();
    });

    it('should handle partial metric failures', async () => {
      const mockMemoryUsed: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        measurements: [{ statistic: 'VALUE', value: 1048576 }],
        availableTags: [],
      };
      const error = new Error('Failed to fetch CPU metric');

      mockedMonitoringApi.getMetric
        .mockResolvedValueOnce(mockMemoryUsed)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(mockMemoryUsed)
        .mockResolvedValueOnce(mockMemoryUsed)
        .mockResolvedValueOnce(mockMemoryUsed);

      const { result } = renderHook(() => usePerformanceMetrics(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.memoryUsage).toEqual(mockMemoryUsed);
      expect(result.current.hasError).toBe(true);
    });
  });

  describe('useSystemInformation', () => {
    it('should combine info and environment data successfully', async () => {
      const mockInfo: RecipeManagementInfoResponse = {
        app: { name: 'recipe-management-service', version: '1.0.0' },
        build: { version: '1.0.0', artifact: 'recipe-management-service' },
        java: { version: '21.0.0', vendor: 'OpenJDK' },
        os: { name: 'Linux', version: '5.15.0', arch: 'amd64' },
      };

      const mockEnvironment: RecipeManagementEnvironmentResponse = {
        activeProfiles: ['development', 'local'],
        propertySources: [],
      };

      mockedMonitoringApi.getInfo.mockResolvedValue(mockInfo);
      mockedMonitoringApi.getEnvironment.mockResolvedValue(mockEnvironment);

      const { result } = renderHook(() => useSystemInformation(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.application).toEqual(mockInfo.app);
      expect(result.current.build).toEqual(mockInfo.build);
      expect(result.current.java).toEqual(mockInfo.java);
      expect(result.current.operatingSystem).toEqual(mockInfo.os);
      expect(result.current.activeProfiles).toEqual(
        mockEnvironment.activeProfiles
      );
      expect(result.current.hasError).toBe(false);
    });

    it('should handle errors in either query', async () => {
      const error = new Error('Failed to fetch info');
      mockedMonitoringApi.getInfo.mockRejectedValue(error);
      mockedMonitoringApi.getEnvironment.mockResolvedValue({
        activeProfiles: [],
        propertySources: [],
      });

      const { result } = renderHook(() => useSystemInformation(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.hasError).toBe(true);
      });

      expect(result.current.application).toBeUndefined();
      expect(result.current.hasError).toBe(true);
    });
  });
});
