import { systemApi } from '@/lib/api/meal-plan-management/system';
import { mealPlanManagementClient } from '@/lib/api/meal-plan-management/client';
import type {
  ServiceInfo,
  SafeConfiguration,
} from '@/types/meal-plan-management';

// Mock the client
jest.mock('@/lib/api/meal-plan-management/client', () => ({
  mealPlanManagementClient: {
    get: jest.fn(),
  },
  handleMealPlanManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = mealPlanManagementClient as jest.Mocked<
  typeof mealPlanManagementClient
>;

describe('System API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockServiceInfo: ServiceInfo = {
    name: 'Meal Plan Management Service',
    version: '1.0.0',
    description:
      'API for managing meal plans, recipes, and nutritional tracking',
    environment: 'development',
    uptime: 3600.5,
    timestamp: '2024-01-15T14:30:00Z',
    nodeVersion: 'v18.17.0',
    platform: 'linux',
    arch: 'x64',
    memory: {
      used: 45,
      total: 128,
      external: 12,
    },
    pid: 12345,
  };

  const mockSafeConfiguration: SafeConfiguration = {
    environment: 'development',
    port: 3000,
    logLevel: 'info',
    corsOrigins: ['http://localhost:3000'],
    rateLimit: {
      ttl: 60000,
      limit: 100,
    },
    database: {
      maxRetries: 5,
      retryDelay: 5000,
      healthCheckInterval: 30000,
      logQueries: false,
    },
    oauth2: {
      serviceEnabled: true,
      serviceToServiceEnabled: true,
      introspectionEnabled: false,
      clientId: 'meal-plan-service',
    },
    logging: {
      level: 'info',
      consoleFormat: 'pretty',
      fileEnabled: false,
      maxSize: '20m',
      maxFiles: '14d',
    },
  };

  const mockSwaggerHTML =
    '<html><head><title>Swagger UI</title></head><body>...</body></html>';

  const mockOpenAPIJson = {
    openapi: '3.0.3',
    info: {
      title: 'Meal Plan Management Service API',
      version: '1.0.0',
    },
    paths: {},
  };

  describe('getSwaggerUI', () => {
    it('should get Swagger UI HTML successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockSwaggerHTML });

      const result = await systemApi.getSwaggerUI();

      expect(mockedClient.get).toHaveBeenCalledWith('/docs', {
        headers: {
          Accept: 'text/html',
        },
      });
      expect(result).toEqual(mockSwaggerHTML);
    });

    it('should handle get Swagger UI error', async () => {
      const error = new Error('Docs unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(systemApi.getSwaggerUI()).rejects.toThrow(error);
    });
  });

  describe('getOpenAPIJson', () => {
    it('should get OpenAPI JSON successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockOpenAPIJson });

      const result = await systemApi.getOpenAPIJson();

      expect(mockedClient.get).toHaveBeenCalledWith('/docs-json');
      expect(result).toEqual(mockOpenAPIJson);
    });

    it('should handle get OpenAPI JSON error', async () => {
      const error = new Error('OpenAPI spec unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(systemApi.getOpenAPIJson()).rejects.toThrow(error);
    });
  });

  describe('getServiceInfo', () => {
    it('should get service info successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockServiceInfo });

      const result = await systemApi.getServiceInfo();

      expect(mockedClient.get).toHaveBeenCalledWith('/info');
      expect(result).toEqual(mockServiceInfo);
    });

    it('should handle get service info error', async () => {
      const error = new Error('Service info unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(systemApi.getServiceInfo()).rejects.toThrow(error);
    });
  });

  describe('getConfiguration', () => {
    it('should get safe configuration successfully', async () => {
      mockedClient.get.mockResolvedValue({ data: mockSafeConfiguration });

      const result = await systemApi.getConfiguration();

      expect(mockedClient.get).toHaveBeenCalledWith('/config');
      expect(result).toEqual(mockSafeConfiguration);
    });

    it('should handle get configuration error', async () => {
      const error = new Error('Configuration unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(systemApi.getConfiguration()).rejects.toThrow(error);
    });
  });
});
