import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useMealPlanSwaggerUI,
  useMealPlanOpenAPIJson,
  useMealPlanServiceInfo,
  useMealPlanConfiguration,
} from '@/hooks/meal-plan-management/use-system';
import { systemApi } from '@/lib/api/meal-plan-management';
import type {
  ServiceInfo,
  SafeConfiguration,
} from '@/types/meal-plan-management';

// Mock the API
jest.mock('@/lib/api/meal-plan-management', () => ({
  systemApi: {
    getSwaggerUI: jest.fn(),
    getOpenAPIJson: jest.fn(),
    getServiceInfo: jest.fn(),
    getConfiguration: jest.fn(),
  },
}));

const mockedSystemApi = systemApi as jest.Mocked<typeof systemApi>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('System Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  describe('useMealPlanSwaggerUI', () => {
    it('should fetch Swagger UI HTML successfully', async () => {
      mockedSystemApi.getSwaggerUI.mockResolvedValue(mockSwaggerHTML);

      const { result } = renderHook(() => useMealPlanSwaggerUI(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSystemApi.getSwaggerUI).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockSwaggerHTML);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanSwaggerUI(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedSystemApi.getSwaggerUI).not.toHaveBeenCalled();
    });
  });

  describe('useMealPlanOpenAPIJson', () => {
    it('should fetch OpenAPI JSON successfully', async () => {
      mockedSystemApi.getOpenAPIJson.mockResolvedValue(mockOpenAPIJson);

      const { result } = renderHook(() => useMealPlanOpenAPIJson(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSystemApi.getOpenAPIJson).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockOpenAPIJson);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanOpenAPIJson(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedSystemApi.getOpenAPIJson).not.toHaveBeenCalled();
    });
  });

  describe('useMealPlanServiceInfo', () => {
    it('should fetch service info successfully', async () => {
      mockedSystemApi.getServiceInfo.mockResolvedValue(mockServiceInfo);

      const { result } = renderHook(() => useMealPlanServiceInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSystemApi.getServiceInfo).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockServiceInfo);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanServiceInfo(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedSystemApi.getServiceInfo).not.toHaveBeenCalled();
    });

    it('should handle service info with runtime data', async () => {
      const runtimeServiceInfo: ServiceInfo = {
        ...mockServiceInfo,
        uptime: 7200.8,
        memory: {
          used: 52,
          total: 128,
          external: 15,
        },
      };

      mockedSystemApi.getServiceInfo.mockResolvedValue(runtimeServiceInfo);

      const { result } = renderHook(() => useMealPlanServiceInfo(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.uptime).toBe(7200.8);
      expect(result.current.data?.memory.used).toBe(52);
    });
  });

  describe('useMealPlanConfiguration', () => {
    it('should fetch configuration successfully', async () => {
      mockedSystemApi.getConfiguration.mockResolvedValue(mockSafeConfiguration);

      const { result } = renderHook(() => useMealPlanConfiguration(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockedSystemApi.getConfiguration).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockSafeConfiguration);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMealPlanConfiguration(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(mockedSystemApi.getConfiguration).not.toHaveBeenCalled();
    });

    it('should handle configuration with environment-specific values', async () => {
      const prodConfiguration: SafeConfiguration = {
        ...mockSafeConfiguration,
        environment: 'production',
        port: 8080,
        corsOrigins: ['https://recipe-app.com'],
        rateLimit: {
          ttl: 60000,
          limit: 1000,
        },
      };

      mockedSystemApi.getConfiguration.mockResolvedValue(prodConfiguration);

      const { result } = renderHook(() => useMealPlanConfiguration(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.environment).toBe('production');
      expect(result.current.data?.port).toBe(8080);
      expect(result.current.data?.rateLimit.limit).toBe(1000);
    });
  });
});
