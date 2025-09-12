import {
  MediaManagementApiError,
  handleMediaManagementApiError,
  buildQueryParams,
} from '@/lib/api/media-management/client';
import { ErrorResponse } from '@/types/media-management';

describe('Media Management API Client Utilities', () => {
  describe('MediaManagementApiError', () => {
    it('should create error with all properties', () => {
      const details = { field: 'value', code: 'INVALID_INPUT' };
      const error = new MediaManagementApiError('Test error', 400, details);

      expect(error.name).toBe('MediaManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.details).toEqual(details);
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with minimal properties', () => {
      const error = new MediaManagementApiError('Simple error');

      expect(error.name).toBe('MediaManagementApiError');
      expect(error.message).toBe('Simple error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create error with partial properties', () => {
      const error = new MediaManagementApiError('Partial error', 403);

      expect(error.message).toBe('Partial error');
      expect(error.status).toBe(403);
      expect(error.details).toBeUndefined();
    });
  });

  describe('handleMediaManagementApiError', () => {
    it('should handle AxiosError with ErrorResponse data', () => {
      const errorResponse: ErrorResponse = {
        error: 'Bad Request',
        message: 'File too large',
        details: { maxSize: 50000000, actualSize: 52428800 },
      };

      const axiosError = {
        response: {
          status: 400,
          data: errorResponse,
        },
        message: 'Request failed',
      };

      expect(() => handleMediaManagementApiError(axiosError)).toThrow(
        MediaManagementApiError
      );

      try {
        handleMediaManagementApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(MediaManagementApiError);
        expect((error as MediaManagementApiError).message).toBe(
          'File too large'
        );
        expect((error as MediaManagementApiError).status).toBe(400);
        expect((error as MediaManagementApiError).details).toEqual({
          maxSize: 50000000,
          actualSize: 52428800,
        });
      }
    });

    it('should handle AxiosError with message field', () => {
      const axiosError = {
        response: {
          status: 413,
          data: {
            message: 'Upload size exceeded',
          },
        },
      };

      try {
        handleMediaManagementApiError(axiosError);
      } catch (error) {
        expect((error as MediaManagementApiError).message).toBe(
          'Upload size exceeded'
        );
        expect((error as MediaManagementApiError).status).toBe(413);
      }
    });

    it('should handle AxiosError without proper ErrorResponse data', () => {
      const axiosError = {
        response: {
          status: 500,
          data: { someOtherField: 'value' },
        },
        message: 'Internal server error',
      };

      try {
        handleMediaManagementApiError(axiosError);
      } catch (error) {
        expect((error as MediaManagementApiError).message).toBe(
          'Internal server error'
        );
        expect((error as MediaManagementApiError).status).toBe(500);
        expect((error as MediaManagementApiError).details).toBeUndefined();
      }
    });

    it('should handle AxiosError without response', () => {
      const axiosError = {
        message: 'Network error',
      };

      try {
        handleMediaManagementApiError(axiosError);
      } catch (error) {
        expect((error as MediaManagementApiError).message).toBe(
          'Network error'
        );
        expect((error as MediaManagementApiError).status).toBeUndefined();
      }
    });

    it('should handle standard Error objects', () => {
      const standardError = new Error('Connection timeout');

      try {
        handleMediaManagementApiError(standardError);
      } catch (error) {
        expect(error).toBeInstanceOf(MediaManagementApiError);
        expect((error as MediaManagementApiError).message).toBe(
          'Connection timeout'
        );
        expect((error as MediaManagementApiError).status).toBeUndefined();
      }
    });

    it('should handle unknown error types', () => {
      try {
        handleMediaManagementApiError('string error');
      } catch (error) {
        expect(error).toBeInstanceOf(MediaManagementApiError);
        expect((error as MediaManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }
    });

    it('should handle null and undefined errors', () => {
      try {
        handleMediaManagementApiError(null);
      } catch (error) {
        expect((error as MediaManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }

      try {
        handleMediaManagementApiError(undefined);
      } catch (error) {
        expect((error as MediaManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from simple parameters', () => {
      const params = { page: 1, limit: 10, status: 'Complete' };
      const result = buildQueryParams(params);

      expect(result).toBe('?page=1&limit=10&status=Complete');
    });

    it('should handle array parameters', () => {
      const params = { sort: ['title', 'date'], status: 'Pending' };
      const result = buildQueryParams(params);

      expect(result).toBe('?sort=title&sort=date&status=Pending');
    });

    it('should skip undefined, null, and empty string values', () => {
      const params = {
        page: 1,
        limit: undefined,
        status: null,
        search: '',
        filter: 'active',
      };
      const result = buildQueryParams(params);

      expect(result).toBe('?page=1&filter=active');
    });

    it('should return empty string when no valid parameters', () => {
      const params = { limit: undefined, status: null, search: '' };
      const result = buildQueryParams(params);

      expect(result).toBe('');
    });

    it('should handle empty object', () => {
      const result = buildQueryParams({});

      expect(result).toBe('');
    });

    it('should properly encode special characters', () => {
      const params = { search: 'test query', filter: 'category/subcategory' };
      const result = buildQueryParams(params);

      expect(result).toBe('?search=test+query&filter=category%2Fsubcategory');
    });

    it('should handle boolean values correctly', () => {
      const params = {
        active: true,
        deleted: false,
        includeProcessing: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('?active=true&deleted=false&includeProcessing=true');
    });

    it('should handle numeric values including zero', () => {
      const params = {
        cursor: 0,
        limit: 0,
        mediaId: 123,
        recipeId: 456,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('?cursor=0&limit=0&mediaId=123&recipeId=456');
    });

    it('should handle empty arrays', () => {
      const params = {
        tags: [],
        limit: 10,
        active: true,
      };

      const result = buildQueryParams(params);
      expect(result).toBe('?limit=10&active=true');
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

      const result = buildQueryParams(params);
      expect(result).toBe(
        '?string=text&number=42&boolean=true&array=a&array=b&zero=0'
      );
    });

    it('should handle cursor-based pagination parameters', () => {
      const params = {
        cursor: 'eyJpZCI6MTI0fQ==',
        limit: 50,
        status: 'Complete',
      };

      const result = buildQueryParams(params);
      expect(result).toBe(
        '?cursor=eyJpZCI6MTI0fQ%3D%3D&limit=50&status=Complete'
      );
    });
  });
});
