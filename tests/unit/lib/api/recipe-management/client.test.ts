import {
  RecipeManagementApiError,
  handleRecipeManagementApiError,
  createFormData,
  buildQueryParams,
} from '@/lib/api/recipe-management/client';

describe('Recipe Management API Client Utilities', () => {
  describe('RecipeManagementApiError', () => {
    it('should create error with all properties', () => {
      const details = { field: 'value', code: 123 };
      const error = new RecipeManagementApiError('Test error', 400, details);

      expect(error.name).toBe('RecipeManagementApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.details).toEqual(details);
      expect(error).toBeInstanceOf(Error);
    });

    it('should create error with minimal properties', () => {
      const error = new RecipeManagementApiError('Simple error');

      expect(error.name).toBe('RecipeManagementApiError');
      expect(error.message).toBe('Simple error');
      expect(error.status).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create error with partial properties', () => {
      const error = new RecipeManagementApiError('Partial error', 403);

      expect(error.message).toBe('Partial error');
      expect(error.status).toBe(403);
      expect(error.details).toBeUndefined();
    });
  });

  describe('handleRecipeManagementApiError', () => {
    it('should handle AxiosError with error field', () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            error: 'Invalid request format',
            details: { field: 'validation_error' },
          },
        },
      };

      expect(() => handleRecipeManagementApiError(axiosError)).toThrow(
        RecipeManagementApiError
      );

      try {
        handleRecipeManagementApiError(axiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeManagementApiError);
        expect((error as RecipeManagementApiError).message).toBe(
          'Invalid request format'
        );
        expect((error as RecipeManagementApiError).status).toBe(400);
        expect((error as RecipeManagementApiError).details).toEqual({
          field: 'validation_error',
        });
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
        handleRecipeManagementApiError(axiosError);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
          'Validation error'
        );
        expect((error as RecipeManagementApiError).status).toBe(422);
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
        handleRecipeManagementApiError(axiosError);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
          'Resource not found'
        );
        expect((error as RecipeManagementApiError).status).toBe(404);
      }
    });

    it('should handle axios-like error objects', () => {
      const axiosLikeError = {
        response: {
          status: 403,
          data: {
            error: 'Forbidden access',
            details: { permission: 'required' },
          },
        },
      };

      try {
        handleRecipeManagementApiError(axiosLikeError);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
          'Forbidden access'
        );
        expect((error as RecipeManagementApiError).status).toBe(403);
        expect((error as RecipeManagementApiError).details).toEqual({
          permission: 'required',
        });
      }
    });

    it('should handle custom error objects', () => {
      const customError = {
        message: 'Custom error',
        status: 500,
        details: { code: 'internal_error' },
      };

      try {
        handleRecipeManagementApiError(customError);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
          'Custom error'
        );
        expect((error as RecipeManagementApiError).status).toBe(500);
        expect((error as RecipeManagementApiError).details).toEqual({
          code: 'internal_error',
        });
      }
    });

    it('should handle standard Error objects', () => {
      const standardError = new Error('Network timeout');

      try {
        handleRecipeManagementApiError(standardError);
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeManagementApiError);
        expect((error as RecipeManagementApiError).message).toBe(
          'Network timeout'
        );
      }
    });

    it('should handle unknown error types', () => {
      try {
        handleRecipeManagementApiError('string error');
      } catch (error) {
        expect(error).toBeInstanceOf(RecipeManagementApiError);
        expect((error as RecipeManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }
    });

    it('should handle null and undefined errors', () => {
      try {
        handleRecipeManagementApiError(null);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
          'An unexpected error occurred'
        );
      }

      try {
        handleRecipeManagementApiError(undefined);
      } catch (error) {
        expect((error as RecipeManagementApiError).message).toBe(
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
        title: 'Test Recipe',
        image: testFile,
        servings: 4,
        published: true,
        rating: 4.5,
      };

      const formData = createFormData(data);

      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get('title')).toBe('Test Recipe');
      expect(formData.get('image')).toBe(testFile);
      expect(formData.get('servings')).toBe('4');
      expect(formData.get('published')).toBe('true');
      expect(formData.get('rating')).toBe('4.5');
    });

    it('should handle File objects correctly', () => {
      const imageFile = new File(['binary'], 'recipe.jpg', {
        type: 'image/jpeg',
      });
      const data = {
        media: imageFile,
        description: 'Recipe image',
      };

      const formData = createFormData(data);

      expect(formData.get('media')).toBe(imageFile);
      expect(formData.get('description')).toBe('Recipe image');
    });

    it('should skip undefined and null values', () => {
      const data = {
        title: 'Valid Recipe',
        undefined_field: undefined,
        null_field: null,
        empty_string: '',
        zero_value: 0,
        false_value: false,
      };

      const formData = createFormData(data);

      expect(formData.get('title')).toBe('Valid Recipe');
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
        tags: ['italian', 'pasta'],
        ingredients: [1, 2, 3],
      };

      const formData = createFormData(data);

      expect(formData.get('tags')).toBe('italian,pasta');
      expect(formData.get('ingredients')).toBe('1,2,3');
    });
  });

  describe('buildQueryParams', () => {
    it('should build query string from simple object', () => {
      const params = {
        page: 0,
        size: 20,
        search: 'pasta recipe',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('page=0&size=20&search=pasta+recipe');
    });

    it('should handle array parameters correctly', () => {
      const params = {
        tags: ['italian', 'pasta', 'dinner'],
        difficulty: ['EASY', 'MEDIUM'],
        size: 10,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'tags=italian&tags=pasta&tags=dinner&difficulty=EASY&difficulty=MEDIUM&size=10'
      );
    });

    it('should skip undefined and null values', () => {
      const params = {
        page: 0,
        size: undefined,
        search: null,
        published: true,
        rating: 4,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('page=0&published=true&rating=4');
    });

    it('should handle boolean values correctly', () => {
      const params = {
        published: true,
        featured: false,
        approved: true,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('published=true&featured=false&approved=true');
    });

    it('should handle numeric values including zero', () => {
      const params = {
        page: 0,
        size: 0,
        servings: 4,
        rating: 4.5,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('page=0&size=0&servings=4&rating=4.5');
    });

    it('should handle empty arrays', () => {
      const params = {
        tags: [],
        size: 10,
        published: true,
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe('size=10&published=true');
    });

    it('should handle empty object', () => {
      const queryString = buildQueryParams({});
      expect(queryString).toBe('');
    });

    it('should properly encode special characters', () => {
      const params = {
        search: 'chicken & rice',
        author: 'chef@example.com',
        title: 'recipe name',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'search=chicken+%26+rice&author=chef%40example.com&title=recipe+name'
      );
    });

    it('should handle mixed data types', () => {
      const params = {
        title: 'Recipe',
        servings: 4,
        published: true,
        tags: ['a', 'b'],
        rating: 0,
        description: '',
      };

      const queryString = buildQueryParams(params);
      expect(queryString).toBe(
        'title=Recipe&servings=4&published=true&tags=a&tags=b&rating=0&description='
      );
    });
  });
});
