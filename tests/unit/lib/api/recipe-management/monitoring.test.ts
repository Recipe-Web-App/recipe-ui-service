import { monitoringApi } from '@/lib/api/recipe-management/monitoring';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeManagementInfoResponse,
  RecipeManagementMetricsResponse,
  RecipeManagementMetricResponse,
  RecipeManagementEnvironmentResponse,
  RecipeManagementPropertyResponse,
  RecipeManagementConfigPropsResponse,
  RecipeManagementMetricMeasurement,
  RecipeManagementMetricTag,
  RecipeManagementPropertySource,
  RecipeManagementConfigPropsBean,
  RecipeManagementConfigPropsContext,
} from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Monitoring API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInfo', () => {
    it('should get application info', async () => {
      const mockInfoResponse: RecipeManagementInfoResponse = {
        app: {
          name: 'recipe-management-service',
          version: '1.0.0',
          description: 'Recipe Management Service API',
        },
        build: {
          version: '1.0.0',
          time: '2023-01-01T10:00:00.000Z',
          artifact: 'recipe-management-service',
          name: 'Recipe Management Service',
          group: 'com.recipeapp',
        },
        java: {
          version: '17.0.2',
          vendor: 'Eclipse Adoptium',
        },
        os: {
          name: 'Linux',
          version: '5.15.0-153-generic',
          arch: 'amd64',
        },
      };

      mockedClient.get.mockResolvedValue({ data: mockInfoResponse });

      const result = await monitoringApi.getInfo();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/info');
      expect(result).toEqual(mockInfoResponse);
    });

    it('should handle minimal info response', async () => {
      const minimalInfoResponse: RecipeManagementInfoResponse = {};

      mockedClient.get.mockResolvedValue({ data: minimalInfoResponse });

      const result = await monitoringApi.getInfo();

      expect(result).toEqual(minimalInfoResponse);
    });

    it('should handle info endpoint error', async () => {
      const error = new Error('Service unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getInfo()).rejects.toThrow(
        'Service unavailable'
      );
    });
  });

  describe('getMetrics', () => {
    it('should get available metrics', async () => {
      const mockMetricsResponse: RecipeManagementMetricsResponse = {
        names: [
          'jvm.memory.used',
          'jvm.memory.max',
          'http.server.requests',
          'system.cpu.usage',
          'jvm.gc.pause',
          'database.connections.active',
          'recipe.creation.count',
          'recipe.search.duration',
        ],
      };

      mockedClient.get.mockResolvedValue({ data: mockMetricsResponse });

      const result = await monitoringApi.getMetrics();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/metrics');
      expect(result).toEqual(mockMetricsResponse);
      expect(result.names).toHaveLength(8);
    });

    it('should handle empty metrics list', async () => {
      const emptyMetricsResponse: RecipeManagementMetricsResponse = {
        names: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyMetricsResponse });

      const result = await monitoringApi.getMetrics();

      expect(result.names).toHaveLength(0);
    });

    it('should handle metrics endpoint error', async () => {
      const error = new Error('Metrics not available');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getMetrics()).rejects.toThrow(
        'Metrics not available'
      );
    });
  });

  describe('getMetric', () => {
    it('should get specific metric', async () => {
      const metricMeasurements: RecipeManagementMetricMeasurement[] = [
        { statistic: 'VALUE', value: 123456789 },
        { statistic: 'MAX', value: 987654321 },
      ];

      const metricTags: RecipeManagementMetricTag[] = [
        { tag: 'area', values: ['heap', 'nonheap'] },
        { tag: 'id', values: ['G1 Eden Space', 'G1 Old Gen'] },
      ];

      const mockMetricResponse: RecipeManagementMetricResponse = {
        name: 'jvm.memory.used',
        description: 'The amount of used memory',
        baseUnit: 'bytes',
        measurements: metricMeasurements,
        availableTags: metricTags,
      };

      mockedClient.get.mockResolvedValue({ data: mockMetricResponse });

      const result = await monitoringApi.getMetric('jvm.memory.used');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/metrics/jvm.memory.used'
      );
      expect(result).toEqual(mockMetricResponse);
      expect(result.measurements).toHaveLength(2);
      expect(result.availableTags).toHaveLength(2);
    });

    it('should get metric without optional fields', async () => {
      const mockMetricResponse: RecipeManagementMetricResponse = {
        name: 'custom.counter',
        measurements: [{ statistic: 'COUNT', value: 42 }],
      };

      mockedClient.get.mockResolvedValue({ data: mockMetricResponse });

      const result = await monitoringApi.getMetric('custom.counter');

      expect(result.name).toBe('custom.counter');
      expect(result.description).toBeUndefined();
      expect(result.baseUnit).toBeUndefined();
      expect(result.availableTags).toBeUndefined();
    });

    it('should handle metric not found error', async () => {
      const error = new Error('Metric not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getMetric('invalid.metric')).rejects.toThrow(
        'Metric not found'
      );
    });

    it('should handle special characters in metric name', async () => {
      const mockMetricResponse: RecipeManagementMetricResponse = {
        name: 'http.server.requests',
        measurements: [{ statistic: 'COUNT', value: 1000 }],
      };

      mockedClient.get.mockResolvedValue({ data: mockMetricResponse });

      await monitoringApi.getMetric('http.server.requests');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/metrics/http.server.requests'
      );
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should get Prometheus metrics', async () => {
      const prometheusMetrics = `# HELP jvm_memory_used_bytes The amount of used memory
# TYPE jvm_memory_used_bytes gauge
jvm_memory_used_bytes{area="heap",id="G1 Eden Space",} 1.23456789E8
jvm_memory_used_bytes{area="heap",id="G1 Old Gen",} 9.87654321E8
# HELP http_server_requests_seconds
# TYPE http_server_requests_seconds summary
http_server_requests_seconds_count{method="GET",uri="/actuator/health",status="200",} 42.0
http_server_requests_seconds_sum{method="GET",uri="/actuator/health",status="200",} 1.234`;

      mockedClient.get.mockResolvedValue({ data: prometheusMetrics });

      const result = await monitoringApi.getPrometheusMetrics();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/prometheus');
      expect(result).toBe(prometheusMetrics);
      expect(typeof result).toBe('string');
    });

    it('should handle empty Prometheus metrics', async () => {
      mockedClient.get.mockResolvedValue({ data: '' });

      const result = await monitoringApi.getPrometheusMetrics();

      expect(result).toBe('');
    });

    it('should handle Prometheus endpoint error', async () => {
      const error = new Error('Prometheus endpoint unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getPrometheusMetrics()).rejects.toThrow(
        'Prometheus endpoint unavailable'
      );
    });
  });

  describe('getEnvironment', () => {
    it('should get environment properties', async () => {
      const mockPropertySources: RecipeManagementPropertySource[] = [
        {
          name: 'applicationConfig: [classpath:/application.yml]',
          properties: {
            'server.port': {
              value: '8080',
              origin: 'class path resource [application.yml] - 2:13',
            },
            'spring.datasource.url': {
              value: 'jdbc:postgresql://localhost:5432/recipedb',
              origin: 'class path resource [application.yml] - 8:9',
            },
            'spring.datasource.password': {
              value: '******',
              sensitive: true,
            },
          },
        },
        {
          name: 'systemProperties',
          properties: {
            'java.version': {
              value: '17.0.2',
            },
            'os.name': {
              value: 'Linux',
            },
          },
        },
      ];

      const mockEnvironmentResponse: RecipeManagementEnvironmentResponse = {
        activeProfiles: ['dev', 'local'],
        propertySources: mockPropertySources,
      };

      mockedClient.get.mockResolvedValue({ data: mockEnvironmentResponse });

      const result = await monitoringApi.getEnvironment();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/env');
      expect(result).toEqual(mockEnvironmentResponse);
      expect(result.activeProfiles).toHaveLength(2);
      expect(result.propertySources).toHaveLength(2);
    });

    it('should handle environment with no active profiles', async () => {
      const mockEnvironmentResponse: RecipeManagementEnvironmentResponse = {
        activeProfiles: [],
        propertySources: [],
      };

      mockedClient.get.mockResolvedValue({ data: mockEnvironmentResponse });

      const result = await monitoringApi.getEnvironment();

      expect(result.activeProfiles).toHaveLength(0);
      expect(result.propertySources).toHaveLength(0);
    });

    it('should handle environment endpoint error', async () => {
      const error = new Error('Environment access denied');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getEnvironment()).rejects.toThrow(
        'Environment access denied'
      );
    });
  });

  describe('getEnvironmentProperty', () => {
    it('should get specific environment property', async () => {
      const mockPropertyResponse: RecipeManagementPropertyResponse = {
        property: {
          source: 'applicationConfig: [classpath:/application.yml]',
          value: '8080',
        },
        activeProfiles: ['dev'],
        propertySources: ['applicationConfig', 'systemProperties'],
      };

      mockedClient.get.mockResolvedValue({ data: mockPropertyResponse });

      const result = await monitoringApi.getEnvironmentProperty('server.port');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/env/server.port'
      );
      expect(result).toEqual(mockPropertyResponse);
    });

    it('should handle property not found', async () => {
      const emptyPropertyResponse: RecipeManagementPropertyResponse = {};

      mockedClient.get.mockResolvedValue({ data: emptyPropertyResponse });

      const result = await monitoringApi.getEnvironmentProperty(
        'nonexistent.property'
      );

      expect(result.property).toBeUndefined();
    });

    it('should handle property access error', async () => {
      const error = new Error('Property access denied');
      mockedClient.get.mockRejectedValue(error);

      await expect(
        monitoringApi.getEnvironmentProperty('sensitive.property')
      ).rejects.toThrow('Property access denied');
    });

    it('should handle property names with special characters', async () => {
      const mockPropertyResponse: RecipeManagementPropertyResponse = {
        property: {
          source: 'systemProperties',
          value: 'value',
        },
      };

      mockedClient.get.mockResolvedValue({ data: mockPropertyResponse });

      await monitoringApi.getEnvironmentProperty('spring.profiles.active');

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/env/spring.profiles.active'
      );
    });
  });

  describe('getConfigurationProperties', () => {
    it('should get configuration properties', async () => {
      const mockConfigBean: RecipeManagementConfigPropsBean = {
        prefix: 'server',
        properties: {
          port: 8080,
          'servlet.context-path': '/api',
          'max-http-header-size': '8KB',
        },
      };

      const mockConfigContext: RecipeManagementConfigPropsContext = {
        beans: {
          serverProperties: mockConfigBean,
          dataSourceProperties: {
            prefix: 'spring.datasource',
            properties: {
              url: 'jdbc:postgresql://localhost:5432/recipedb',
              'driver-class-name': 'org.postgresql.Driver',
              username: 'recipe_user',
            },
          },
        },
        parentId: null,
      };

      const mockConfigPropsResponse: RecipeManagementConfigPropsResponse = {
        contexts: {
          'recipe-management-service': mockConfigContext,
        },
      };

      mockedClient.get.mockResolvedValue({ data: mockConfigPropsResponse });

      const result = await monitoringApi.getConfigurationProperties();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/configprops');
      expect(result).toEqual(mockConfigPropsResponse);
      expect(result.contexts['recipe-management-service'].beans).toHaveProperty(
        'serverProperties'
      );
      expect(result.contexts['recipe-management-service'].beans).toHaveProperty(
        'dataSourceProperties'
      );
    });

    it('should handle empty configuration properties', async () => {
      const emptyConfigResponse: RecipeManagementConfigPropsResponse = {
        contexts: {},
      };

      mockedClient.get.mockResolvedValue({ data: emptyConfigResponse });

      const result = await monitoringApi.getConfigurationProperties();

      expect(Object.keys(result.contexts)).toHaveLength(0);
    });

    it('should handle configuration properties error', async () => {
      const error = new Error('Configuration access denied');
      mockedClient.get.mockRejectedValue(error);

      await expect(monitoringApi.getConfigurationProperties()).rejects.toThrow(
        'Configuration access denied'
      );
    });

    it('should handle multiple contexts', async () => {
      const mockConfigPropsResponse: RecipeManagementConfigPropsResponse = {
        contexts: {
          'parent-context': {
            beans: {
              parentBean: {
                prefix: 'parent',
                properties: { value: 'parent-value' },
              },
            },
            parentId: null,
          },
          'child-context': {
            beans: {
              childBean: {
                prefix: 'child',
                properties: { value: 'child-value' },
              },
            },
            parentId: 'parent-context',
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: mockConfigPropsResponse });

      const result = await monitoringApi.getConfigurationProperties();

      expect(Object.keys(result.contexts)).toHaveLength(2);
      expect(result.contexts['child-context'].parentId).toBe('parent-context');
    });
  });
});
