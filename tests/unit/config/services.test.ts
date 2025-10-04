import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SERVICE_URLS, getServiceUrl } from '@/config/services';

describe('services config', () => {
  describe('SERVICE_URLS', () => {
    it('should export all service URLs', () => {
      expect(SERVICE_URLS).toBeDefined();
      expect(SERVICE_URLS.AUTH).toBeDefined();
      expect(SERVICE_URLS.MEAL_PLAN_MANAGEMENT).toBeDefined();
      expect(SERVICE_URLS.MEDIA_MANAGEMENT).toBeDefined();
      expect(SERVICE_URLS.RECIPE_MANAGEMENT).toBeDefined();
      expect(SERVICE_URLS.RECIPE_SCRAPER).toBeDefined();
      expect(SERVICE_URLS.USER_MANAGEMENT).toBeDefined();
    });

    it('should use .local domain URLs', () => {
      expect(SERVICE_URLS.AUTH).toContain('.local');
      expect(SERVICE_URLS.MEAL_PLAN_MANAGEMENT).toContain('.local');
      expect(SERVICE_URLS.MEDIA_MANAGEMENT).toContain('.local');
      expect(SERVICE_URLS.RECIPE_MANAGEMENT).toContain('.local');
      expect(SERVICE_URLS.RECIPE_SCRAPER).toContain('.local');
      expect(SERVICE_URLS.USER_MANAGEMENT).toContain('.local');
    });

    it('should have correct auth service URL', () => {
      expect(SERVICE_URLS.AUTH).toBe('http://auth-service.local/api/v1/auth');
    });

    it('should have correct meal plan management service URL', () => {
      expect(SERVICE_URLS.MEAL_PLAN_MANAGEMENT).toBe(
        'http://meal-plan-management.local/api/v1/meal-plan-management'
      );
    });

    it('should have correct media management service URL', () => {
      expect(SERVICE_URLS.MEDIA_MANAGEMENT).toBe(
        'http://media-management.local/api/v1/media-management'
      );
    });

    it('should have correct recipe management service URL', () => {
      expect(SERVICE_URLS.RECIPE_MANAGEMENT).toBe(
        'http://recipe-management.local/api/v1/recipe-management'
      );
    });

    it('should have correct recipe scraper service URL', () => {
      expect(SERVICE_URLS.RECIPE_SCRAPER).toBe(
        'http://recipe-scraper.local/api/v1/recipe-scraper'
      );
    });

    it('should have correct user management service URL', () => {
      expect(SERVICE_URLS.USER_MANAGEMENT).toBe(
        'http://user-management.local/api/v1/user-management'
      );
    });
  });

  describe('getServiceUrl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Create a fresh copy of process.env for each test
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      // Restore original process.env
      process.env = originalEnv;
    });

    it('should return default URL when env var is not set', () => {
      const url = getServiceUrl('AUTH', 'NEXT_PUBLIC_AUTH_SERVICE_URL');
      expect(url).toBe('http://auth-service.local/api/v1/auth');
    });

    it('should return env var URL when set', () => {
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = 'http://custom.example.com';
      const url = getServiceUrl('AUTH', 'NEXT_PUBLIC_AUTH_SERVICE_URL');
      expect(url).toBe('http://custom.example.com');
    });

    it('should prioritize env var over default', () => {
      process.env.NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL =
        'http://production.example.com/api/recipes';
      const url = getServiceUrl(
        'RECIPE_MANAGEMENT',
        'NEXT_PUBLIC_RECIPE_MANAGEMENT_SERVICE_URL'
      );
      expect(url).toBe('http://production.example.com/api/recipes');
    });

    it('should handle all service keys', () => {
      expect(getServiceUrl('AUTH', 'TEST_VAR')).toBe(SERVICE_URLS.AUTH);
      expect(getServiceUrl('MEAL_PLAN_MANAGEMENT', 'TEST_VAR')).toBe(
        SERVICE_URLS.MEAL_PLAN_MANAGEMENT
      );
      expect(getServiceUrl('MEDIA_MANAGEMENT', 'TEST_VAR')).toBe(
        SERVICE_URLS.MEDIA_MANAGEMENT
      );
      expect(getServiceUrl('RECIPE_MANAGEMENT', 'TEST_VAR')).toBe(
        SERVICE_URLS.RECIPE_MANAGEMENT
      );
      expect(getServiceUrl('RECIPE_SCRAPER', 'TEST_VAR')).toBe(
        SERVICE_URLS.RECIPE_SCRAPER
      );
      expect(getServiceUrl('USER_MANAGEMENT', 'TEST_VAR')).toBe(
        SERVICE_URLS.USER_MANAGEMENT
      );
    });

    it('should return empty string when env var is explicitly empty', () => {
      // Note: Nullish coalescing (??) only checks for null/undefined, not empty strings
      // This is intentional - if an env var is explicitly set to empty, we respect that
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL = '';
      const url = getServiceUrl('AUTH', 'NEXT_PUBLIC_AUTH_SERVICE_URL');
      expect(url).toBe('');
    });

    it('should return default when env var is undefined', () => {
      delete process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
      const url = getServiceUrl('AUTH', 'NEXT_PUBLIC_AUTH_SERVICE_URL');
      expect(url).toBe('http://auth-service.local/api/v1/auth');
    });
  });
});
