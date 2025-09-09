import { healthApi } from '@/lib/api/recipe-management/health';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeManagementHealthResponse,
  RecipeManagementHealthStatus,
  RecipeManagementHealthComponentDetails,
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

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockHealthyResponse: RecipeManagementHealthResponse = {
    status: 'UP' as RecipeManagementHealthStatus,
    components: {
      db: {
        status: 'UP' as RecipeManagementHealthStatus,
        details: {
          database: 'PostgreSQL',
          validationQuery: 'isValid()',
          result: 1,
        },
      },
      diskSpace: {
        status: 'UP' as RecipeManagementHealthStatus,
        details: {
          total: 249769230336,
          free: 137460244480,
          threshold: 10485760,
          path: '/tmp/recipe-management',
          exists: true,
        },
      },
      redis: {
        status: 'UP' as RecipeManagementHealthStatus,
        details: {
          version: '7.0.8',
          mode: 'standalone',
        },
      },
    },
  };

  const mockUnhealthyResponse: RecipeManagementHealthResponse = {
    status: 'DOWN' as RecipeManagementHealthStatus,
    components: {
      db: {
        status: 'DOWN' as RecipeManagementHealthStatus,
        details: {
          database: 'PostgreSQL',
          error: 'Connection refused',
        },
      },
      diskSpace: {
        status: 'UP' as RecipeManagementHealthStatus,
        details: {
          total: 249769230336,
          free: 137460244480,
          threshold: 10485760,
          path: '/tmp/recipe-management',
          exists: true,
        },
      },
      redis: {
        status: 'DOWN' as RecipeManagementHealthStatus,
        details: {
          error: 'Redis connection timeout',
        },
      },
    },
  };

  describe('getHealth', () => {
    it('should get healthy application status', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthyResponse });

      const result = await healthApi.getHealth();

      expect(mockedClient.get).toHaveBeenCalledWith('/actuator/health');
      expect(result).toEqual(mockHealthyResponse);
      expect(result.status).toBe('UP');
    });

    it('should get unhealthy application status', async () => {
      mockedClient.get.mockResolvedValue({ data: mockUnhealthyResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('DOWN');
      expect(result.components?.db.status).toBe('DOWN');
      expect(result.components?.redis.status).toBe('DOWN');
    });

    it('should show detailed component information when healthy', async () => {
      mockedClient.get.mockResolvedValue({ data: mockHealthyResponse });

      const result = await healthApi.getHealth();

      expect(result.components?.db.details?.database).toBe('PostgreSQL');
      expect(result.components?.diskSpace.details?.exists).toBe(true);
      expect(result.components?.redis.details?.version).toBe('7.0.8');
    });

    it('should show error details when components are unhealthy', async () => {
      mockedClient.get.mockResolvedValue({ data: mockUnhealthyResponse });

      const result = await healthApi.getHealth();

      expect(result.components?.db.details?.error).toBe('Connection refused');
      expect(result.components?.redis.details?.error).toBe(
        'Redis connection timeout'
      );
    });

    it('should handle health check service unavailable', async () => {
      const error = new Error('Health endpoint unavailable');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getHealth()).rejects.toThrow(
        'Health endpoint unavailable'
      );
    });

    it('should handle partial component failures', async () => {
      const partialFailureResponse: RecipeManagementHealthResponse = {
        status: 'DOWN' as RecipeManagementHealthStatus,
        components: {
          db: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {
              database: 'PostgreSQL',
              validationQuery: 'isValid()',
              result: 1,
            },
          },
          diskSpace: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              total: 249769230336,
              free: 1048576,
              threshold: 10485760,
              path: '/tmp/recipe-management',
              exists: true,
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: partialFailureResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('DOWN');
      expect(result.components?.db.status).toBe('UP');
      expect(result.components?.diskSpace.status).toBe('DOWN');
    });
  });

  describe('getReadiness', () => {
    it('should get application readiness status', async () => {
      const readinessResponse: RecipeManagementHealthResponse = {
        status: 'UP' as RecipeManagementHealthStatus,
        components: {
          readinessState: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {
              ready: true,
            },
          },
          db: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {
              database: 'PostgreSQL',
              validationQuery: 'isValid()',
              result: 1,
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: readinessResponse });

      const result = await healthApi.getReadiness();

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/health/readiness'
      );
      expect(result).toEqual(readinessResponse);
      expect(result.status).toBe('UP');
    });

    it('should handle unready application state', async () => {
      const unreadyResponse: RecipeManagementHealthResponse = {
        status: 'DOWN' as RecipeManagementHealthStatus,
        components: {
          readinessState: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              ready: false,
              reason: 'Database migration in progress',
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: unreadyResponse });

      const result = await healthApi.getReadiness();

      expect(result.status).toBe('DOWN');
      expect(result.components?.readinessState.details?.ready).toBe(false);
    });

    it('should handle readiness check errors', async () => {
      const error = new Error('Readiness check failed');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getReadiness()).rejects.toThrow(
        'Readiness check failed'
      );
    });

    it('should handle readiness during startup', async () => {
      const startupResponse: RecipeManagementHealthResponse = {
        status: 'DOWN' as RecipeManagementHealthStatus,
        components: {
          readinessState: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              ready: false,
              reason: 'Application starting up',
            },
          },
          db: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              error: 'Connection pool initializing',
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: startupResponse });

      const result = await healthApi.getReadiness();

      expect(result.status).toBe('DOWN');
      expect(result.components?.readinessState.details?.reason).toBe(
        'Application starting up'
      );
    });
  });

  describe('getLiveness', () => {
    it('should get application liveness status', async () => {
      const livenessResponse: RecipeManagementHealthResponse = {
        status: 'UP' as RecipeManagementHealthStatus,
        components: {
          livenessState: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {
              alive: true,
            },
          },
          ping: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {},
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: livenessResponse });

      const result = await healthApi.getLiveness();

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/actuator/health/liveness'
      );
      expect(result).toEqual(livenessResponse);
      expect(result.status).toBe('UP');
    });

    it('should handle dead application state', async () => {
      const deadResponse: RecipeManagementHealthResponse = {
        status: 'DOWN' as RecipeManagementHealthStatus,
        components: {
          livenessState: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              alive: false,
              reason: 'Critical system failure',
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: deadResponse });

      const result = await healthApi.getLiveness();

      expect(result.status).toBe('DOWN');
      expect(result.components?.livenessState.details?.alive).toBe(false);
    });

    it('should handle liveness check timeout', async () => {
      const error = new Error('Liveness probe timeout');
      mockedClient.get.mockRejectedValue(error);

      await expect(healthApi.getLiveness()).rejects.toThrow(
        'Liveness probe timeout'
      );
    });

    it('should handle application deadlock scenarios', async () => {
      const deadlockResponse: RecipeManagementHealthResponse = {
        status: 'DOWN' as RecipeManagementHealthStatus,
        components: {
          livenessState: {
            status: 'DOWN' as RecipeManagementHealthStatus,
            details: {
              alive: false,
              reason: 'Thread pool exhausted',
              threadCount: 0,
              deadlockedThreads: ['main-thread'],
            },
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: deadlockResponse });

      const result = await healthApi.getLiveness();

      expect(result.status).toBe('DOWN');
      expect(result.components?.livenessState.details?.reason).toBe(
        'Thread pool exhausted'
      );
    });

    it('should validate ping component', async () => {
      const pingResponse: RecipeManagementHealthResponse = {
        status: 'UP' as RecipeManagementHealthStatus,
        components: {
          ping: {
            status: 'UP' as RecipeManagementHealthStatus,
            details: {},
          },
        },
      };

      mockedClient.get.mockResolvedValue({ data: pingResponse });

      const result = await healthApi.getLiveness();

      expect(result.components?.ping.status).toBe('UP');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors consistently across all endpoints', async () => {
      const networkError = new Error('Network timeout');

      mockedClient.get.mockRejectedValue(networkError);

      await expect(healthApi.getHealth()).rejects.toThrow('Network timeout');
      await expect(healthApi.getReadiness()).rejects.toThrow('Network timeout');
      await expect(healthApi.getLiveness()).rejects.toThrow('Network timeout');
    });

    it('should handle malformed health responses', async () => {
      const malformedResponse = {
        status: 'UNKNOWN',
        components: null,
      };

      mockedClient.get.mockResolvedValue({ data: malformedResponse });

      const result = await healthApi.getHealth();

      expect(result.status).toBe('UNKNOWN');
      expect(result.components).toBeNull();
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Unauthorized: Invalid credentials');

      mockedClient.get.mockRejectedValue(authError);

      await expect(healthApi.getHealth()).rejects.toThrow(
        'Unauthorized: Invalid credentials'
      );
      await expect(healthApi.getReadiness()).rejects.toThrow(
        'Unauthorized: Invalid credentials'
      );
      await expect(healthApi.getLiveness()).rejects.toThrow(
        'Unauthorized: Invalid credentials'
      );
    });
  });
});
