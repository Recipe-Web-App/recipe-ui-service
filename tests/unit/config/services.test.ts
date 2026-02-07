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
      expect(SERVICE_URLS.AUTH).toBe(
        'http://sous-chef-proxy.local/api/v1/auth'
      );
    });

    it('should have correct meal plan management service URL', () => {
      expect(SERVICE_URLS.MEAL_PLAN_MANAGEMENT).toBe(
        'http://sous-chef-proxy.local/api/v1/meal-plan-management'
      );
    });

    it('should have correct media management service URL', () => {
      expect(SERVICE_URLS.MEDIA_MANAGEMENT).toBe(
        'http://sous-chef-proxy.local/api/v1/media-management'
      );
    });

    it('should have correct recipe management service URL', () => {
      expect(SERVICE_URLS.RECIPE_MANAGEMENT).toBe(
        'http://sous-chef-proxy.local/api/v1/recipe-management'
      );
    });

    it('should have correct recipe scraper service URL', () => {
      expect(SERVICE_URLS.RECIPE_SCRAPER).toBe(
        'http://sous-chef-proxy.local/api/v1/recipe-scraper'
      );
    });

    it('should have correct user management service URL', () => {
      expect(SERVICE_URLS.USER_MANAGEMENT).toBe(
        'http://sous-chef-proxy.local/api/v1/user-management'
      );
    });
  });

  describe('getServiceUrl', () => {
    it('should return service URL from SERVICE_URLS constant', () => {
      const url = getServiceUrl('AUTH');
      expect(url).toBe('http://sous-chef-proxy.local/api/v1/auth');
    });

    it('should handle all service keys', () => {
      expect(getServiceUrl('AUTH')).toBe(SERVICE_URLS.AUTH);
      expect(getServiceUrl('MEAL_PLAN_MANAGEMENT')).toBe(
        SERVICE_URLS.MEAL_PLAN_MANAGEMENT
      );
      expect(getServiceUrl('MEDIA_MANAGEMENT')).toBe(
        SERVICE_URLS.MEDIA_MANAGEMENT
      );
      expect(getServiceUrl('RECIPE_MANAGEMENT')).toBe(
        SERVICE_URLS.RECIPE_MANAGEMENT
      );
      expect(getServiceUrl('RECIPE_SCRAPER')).toBe(SERVICE_URLS.RECIPE_SCRAPER);
      expect(getServiceUrl('USER_MANAGEMENT')).toBe(
        SERVICE_URLS.USER_MANAGEMENT
      );
    });

    it('should return correct URL for each service', () => {
      expect(getServiceUrl('AUTH')).toBe(
        'http://sous-chef-proxy.local/api/v1/auth'
      );
      expect(getServiceUrl('RECIPE_MANAGEMENT')).toBe(
        'http://sous-chef-proxy.local/api/v1/recipe-management'
      );
      expect(getServiceUrl('MEAL_PLAN_MANAGEMENT')).toBe(
        'http://sous-chef-proxy.local/api/v1/meal-plan-management'
      );
    });
  });
});
