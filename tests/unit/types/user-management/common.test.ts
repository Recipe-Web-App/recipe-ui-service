import type {
  PaginationParams,
  PaginatedResponse,
  CountOnlyResponse,
  ErrorResponse,
  OAuth2ScopeError,
  SuccessResponse,
  HealthCheck,
  HealthStatus,
  ReadinessStatus,
  ProfileVisibility,
  Theme,
} from '@/types/user-management/common';

describe('User Management Common Types', () => {
  describe('PaginationParams', () => {
    it('should allow optional parameters', () => {
      const validParams: PaginationParams[] = [
        {},
        { limit: 10 },
        { offset: 20 },
        { countOnly: true },
        { limit: 10, offset: 20 },
        { limit: 10, offset: 20, countOnly: false },
      ];

      validParams.forEach(params => {
        expect(typeof params).toBe('object');
        if (params.limit !== undefined) {
          expect(typeof params.limit).toBe('number');
        }
        if (params.offset !== undefined) {
          expect(typeof params.offset).toBe('number');
        }
        if (params.countOnly !== undefined) {
          expect(typeof params.countOnly).toBe('boolean');
        }
      });
    });
  });

  describe('PaginatedResponse', () => {
    it('should have correct structure', () => {
      const response: PaginatedResponse<string> = {
        results: ['item1', 'item2'],
        totalCount: 2,
        limit: 10,
        offset: 0,
      };

      expect(Array.isArray(response.results)).toBe(true);
      expect(typeof response.totalCount).toBe('number');
      expect(typeof response.limit).toBe('number');
      expect(typeof response.offset).toBe('number');
    });

    it('should work with different types', () => {
      interface TestItem {
        id: string;
        name: string;
      }

      const response: PaginatedResponse<TestItem> = {
        results: [{ id: '1', name: 'test' }],
        totalCount: 1,
        limit: 10,
        offset: 0,
      };

      expect(response.results![0].id).toBe('1');
      expect(response.results![0].name).toBe('test');
    });
  });

  describe('CountOnlyResponse', () => {
    it('should have totalCount property', () => {
      const response: CountOnlyResponse = {
        totalCount: 42,
      };

      expect(typeof response.totalCount).toBe('number');
      expect(response.totalCount).toBe(42);
    });
  });

  describe('ErrorResponse', () => {
    it('should have required fields', () => {
      const error: ErrorResponse = {
        error: 'validation_error',
        message: 'Invalid input data',
      };

      expect(typeof error.error).toBe('string');
      expect(typeof error.message).toBe('string');
    });

    it('should allow optional details', () => {
      const errorWithDetails: ErrorResponse = {
        error: 'validation_error',
        message: 'Invalid input data',
        details: {
          field: 'username',
          code: 'INVALID_FORMAT',
        },
      };

      expect(typeof errorWithDetails.details).toBe('object');
      expect(errorWithDetails.details?.field).toBe('username');
    });
  });

  describe('OAuth2ScopeError', () => {
    it('should have all required fields with camelCase', () => {
      const scopeError: OAuth2ScopeError = {
        detail: 'Missing required scope: user:write',
        errorCode: 'INSUFFICIENT_SCOPE',
        requiredScopes: ['user:write'],
        availableScopes: ['user:read', 'profile'],
      };

      expect(typeof scopeError.detail).toBe('string');
      expect(typeof scopeError.errorCode).toBe('string');
      expect(Array.isArray(scopeError.requiredScopes)).toBe(true);
      expect(Array.isArray(scopeError.availableScopes)).toBe(true);
      expect(
        scopeError.requiredScopes.every(scope => typeof scope === 'string')
      ).toBe(true);
      expect(
        scopeError.availableScopes.every(scope => typeof scope === 'string')
      ).toBe(true);
    });
  });

  describe('SuccessResponse', () => {
    it('should have message property', () => {
      const response: SuccessResponse = {
        message: 'Operation completed successfully',
      };

      expect(typeof response.message).toBe('string');
    });
  });

  describe('HealthCheck', () => {
    it('should have healthy and message properties', () => {
      const healthyCheck: HealthCheck = {
        healthy: true,
        message: 'Service is running',
      };

      const unhealthyCheck: HealthCheck = {
        healthy: false,
        message: 'Database connection failed',
      };

      expect(typeof healthyCheck.healthy).toBe('boolean');
      expect(typeof healthyCheck.message).toBe('string');
      expect(typeof unhealthyCheck.healthy).toBe('boolean');
      expect(typeof unhealthyCheck.message).toBe('string');
    });
  });

  describe('String Union Types', () => {
    it('should validate HealthStatus values', () => {
      const validStatuses: HealthStatus[] = [
        'healthy',
        'degraded',
        'unhealthy',
      ];
      validStatuses.forEach(status => {
        expect(['healthy', 'degraded', 'unhealthy']).toContain(status);
      });
    });

    it('should validate ReadinessStatus values (UPPERCASE per OpenAPI spec)', () => {
      const validStatuses: ReadinessStatus[] = [
        'READY',
        'DEGRADED',
        'NOT_READY',
      ];
      validStatuses.forEach(status => {
        expect(['READY', 'DEGRADED', 'NOT_READY']).toContain(status);
      });
    });

    it('should validate ProfileVisibility values (legacy lowercase)', () => {
      const validVisibilities: ProfileVisibility[] = [
        'public',
        'followers_only',
        'private',
      ];
      validVisibilities.forEach(visibility => {
        expect(['public', 'followers_only', 'private']).toContain(visibility);
      });
    });

    it('should validate Theme values (legacy lowercase)', () => {
      const validThemes: Theme[] = ['light', 'dark', 'system'];
      validThemes.forEach(theme => {
        expect(['light', 'dark', 'system']).toContain(theme);
      });
    });
  });
});
