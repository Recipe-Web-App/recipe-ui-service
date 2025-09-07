import {
  UserManagementApiError,
  handleUserManagementApiError,
  createFormData,
  buildQueryParams,
} from '@/lib/api/user-management/client';

describe('User Management API Client Utilities', () => {
  describe('UserManagementApiError', () => {
    it('should create error with all properties', () => {
      const error = new UserManagementApiError(
        'Test error',
        400,
        ['user:read', 'user:write'],
        'validation_failed'
      );

      expect(error.name).toBe('UserManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.scopes).toEqual(['user:read', 'user:write']);
      expect(error.errorCode).toBe('validation_failed');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with minimal properties', () => {
      const error = new UserManagementApiError('Simple error');

      expect(error.name).toBe('UserManagementApiError');
      expect(error.message).toBe('Simple error');
      expect(error.status).toBeUndefined();
      expect(error.scopes).toBeUndefined();
      expect(error.errorCode).toBeUndefined();
    });

    it('should create error with partial properties', () => {
      const error = new UserManagementApiError('Partial error', 403);

      expect(error.message).toBe('Partial error');
      expect(error.status).toBe(403);
      expect(error.scopes).toBeUndefined();
      expect(error.errorCode).toBeUndefined();
    });
  });

  describe('handleUserManagementApiError', () => {
    it('should handle AxiosError with OAuth2 scope information', () => {
      const axiosError = {
        response: {
          status: 403,
          data: {
            error_description: 'Insufficient OAuth2 scopes',
            required_scopes: ['admin'],
            error_code: 'insufficient_scopes',
          },
        },
      };

      expect(() => handleUserManagementApiError(axiosError)).toThrow(
        UserManagementApiError
      );

      try {
        handleUserManagementApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(UserManagementApiError);
        expect((error as UserManagementApiError).message).toBe(
          'Insufficient OAuth2 scopes'
        );
        expect((error as UserManagementApiError).status).toBe(403);
        expect((error as UserManagementApiError).scopes).toEqual(['admin']);
        expect((error as UserManagementApiError).errorCode).toBe(
          'insufficient_scopes'
        );
      }
    });

    it('should handle AxiosError with error_description', () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            error_description: 'Invalid request format',
          },
        },
      };

      expect(() => handleUserManagementApiError(axiosError)).toThrow(
        UserManagementApiError
      );

      try {
        handleUserManagementApiError(axiosError);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'Invalid request format'
        );
        expect((error as UserManagementApiError).status).toBe(400);
      }
    });

    it('should handle AxiosError with message field', () => {
      const axiosError = {
        response: {
          status: 422,
          data: {
            message: 'Validation error',
          },
        },
      };

      try {
        handleUserManagementApiError(axiosError);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'Validation error'
        );
        expect((error as UserManagementApiError).status).toBe(422);
      }
    });

    it('should handle AxiosError with detail field', () => {
      const axiosError = {
        response: {
          status: 404,
          data: {
            detail: 'Resource not found',
          },
        },
      };

      try {
        handleUserManagementApiError(axiosError);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'Resource not found'
        );
        expect((error as UserManagementApiError).status).toBe(404);
      }
    });

    it('should handle custom error objects with scope information', () => {
      const customError = {
        message: 'Custom scope error',
        status: 403,
        scopes: ['user:write'],
        errorCode: 'write_permission_required',
      };

      try {
        handleUserManagementApiError(customError);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'Custom scope error'
        );
        expect((error as UserManagementApiError).status).toBe(403);
        expect((error as UserManagementApiError).scopes).toEqual([
          'user:write',
        ]);
        expect((error as UserManagementApiError).errorCode).toBe(
          'write_permission_required'
        );
      }
    });

    it('should handle standard Error objects', () => {
      const standardError = new Error('Network timeout');

      try {
        handleUserManagementApiError(standardError);
      } catch (error) {
        expect(error).toBeInstanceOf(UserManagementApiError);
        expect((error as UserManagementApiError).message).toBe(
          'Network timeout'
        );
      }
    });

    it('should handle unknown error types', () => {
      try {
        handleUserManagementApiError('string error');
      } catch (error) {
        expect(error).toBeInstanceOf(UserManagementApiError);
        expect((error as UserManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }
    });

    it('should handle null and undefined errors', () => {
      try {
        handleUserManagementApiError(null);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }

      try {
        handleUserManagementApiError(undefined);
      } catch (error) {
        expect((error as UserManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }
    });
  });

  describe('createFormData', () => {
    it('should create FormData from object with mixed data types', () => {
      const testFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const data = {
        name: 'Test User',
        avatar: testFile,
        age: 25,
        active: true,
        score: 95.5,
      };

      const formData = createFormData(data);

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('name')).toBe('Test User');
      expect(formData.get('avatar')).toBe(testFile);
      expect(formData.get('age')).toBe('25');
      expect(formData.get('active')).toBe('true');
      expect(formData.get('score')).toBe('95.5');
    });

    it('should handle File objects correctly', () => {
      const imageFile = new File(['binary'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const data = {
        profilePicture: imageFile,
        name: 'User',
      };

      const formData = createFormData(data);

      expect(formData.get('profilePicture')).toBe(imageFile);
      expect(formData.get('name')).toBe('User');
    });

    it('should skip undefined and null values', () => {
      const data = {
        name: 'Valid Name',
        undefined_field: undefined,
        null_field: null,
        empty_string: '',
        zero_value: 0,
        false_value: false,
      };

      const formData = createFormData(data);

      expect(formData.get('name')).toBe('Valid Name');
      expect(formData.get('undefined_field')).toBeNull();
      expect(formData.get('null_field')).toBeNull();
      expect(formData.get('empty_string')).toBe('');
      expect(formData.get('zero_value')).toBe('0');
      expect(formData.get('false_value')).toBe('false');
    });

    it('should handle empty object', () => {
      const formData = createFormData({});

      expect(formData).toBeInstanceOf(FormData);
      expect(Array.from(formData.keys())).toHaveLength(0);
    });

    it('should handle arrays by converting to strings', () => {
      const data = {
        tags: ['javascript', 'typescript'],
        numbers: [1, 2, 3],
      };

      const formData = createFormData(data);

      expect(formData.get('tags')).toBe('javascript,typescript');
      expect(formData.get('numbers')).toBe('1,2,3');
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from simple object', () => {
      const params = {
        limit: 10,
        offset: 0,
        search: 'test query',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('limit=10&offset=0&search=test+query');
    });

    it('should handle array parameters correctly', () => {
      const params = {
        tags: ['javascript', 'typescript', 'react'],
        categories: ['frontend', 'backend'],
        limit: 20,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'tags=javascript&tags=typescript&tags=react&categories=frontend&categories=backend&limit=20'
      );
    });

    it('should skip undefined and null values', () => {
      const params = {
        limit: 10,
        offset: undefined,
        search: null,
        active: true,
        page: 0,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('limit=10&active=true&page=0');
    });

    it('should handle boolean values correctly', () => {
      const params = {
        active: true,
        deleted: false,
        archived: true,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('active=true&deleted=false&archived=true');
    });

    it('should handle numeric values including zero', () => {
      const params = {
        page: 0,
        limit: 0,
        count: 100,
        rating: 4.5,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('page=0&limit=0&count=100&rating=4.5');
    });

    it('should handle empty arrays', () => {
      const params = {
        tags: [],
        limit: 10,
        active: true,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('limit=10&active=true');
    });

    it('should handle empty object', () => {
      const queryString = buildQueryParams({});
      expect(queryString).toBe('');
    });

    it('should properly encode special characters', () => {
      const params = {
        search: 'hello & world',
        email: 'test@example.com',
        name: 'user name',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'search=hello+%26+world&email=test%40example.com&name=user+name'
      );
    });

    it('should handle mixed data types', () => {
      const params = {
        string: 'text',
        number: 42,
        boolean: true,
        array: ['a', 'b'],
        zero: 0,
        empty: '',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'string=text&number=42&boolean=true&array=a&array=b&zero=0&empty='
      );
    });
  });
});
