/**
 * Service URL Configuration
 *
 * Centralized configuration for all microservice URLs.
 * Browser connects directly to these service URLs.
 */

/**
 * Service URLs for development
 * Points directly to backend services via .local domains
 */
export const SERVICE_URLS = {
  /**
   * Auth Service - OAuth2 authentication and authorization
   */
  AUTH: 'http://auth-service.local/api/v1/auth',

  /**
   * Meal Plan Management Service - Meal planning and scheduling
   */
  MEAL_PLAN_MANAGEMENT:
    'http://meal-plan-management.local/api/v1/meal-plan-management',

  /**
   * Media Management Service - File upload and media processing
   */
  MEDIA_MANAGEMENT: 'http://media-management.local/api/v1/media-management',

  /**
   * Notification Service - Email notifications and alerts
   */
  NOTIFICATION: 'http://notification-service.local/api/v1/notification',

  /**
   * Recipe Management Service - Recipe CRUD operations
   */
  RECIPE_MANAGEMENT: 'http://recipe-management.local/api/v1/recipe-management',

  /**
   * Recipe Scraper Service - Web scraping and recipe import
   */
  RECIPE_SCRAPER: 'http://recipe-scraper.local/api/v1/recipe-scraper',

  /**
   * User Management Service - User profiles and preferences
   */
  USER_MANAGEMENT: 'http://user-management.local/api/v1/user-management',
} as const;

/**
 * Service URL type for type-safe service references
 */
export type ServiceUrl = (typeof SERVICE_URLS)[keyof typeof SERVICE_URLS];

/**
 * Get service URL for a given service
 *
 * @param serviceKey - The service key from SERVICE_URLS
 * @returns The service URL
 */
export function getServiceUrl(serviceKey: keyof typeof SERVICE_URLS): string {
  // Safe access: serviceKey is constrained to keyof SERVICE_URLS
  // eslint-disable-next-line security/detect-object-injection
  return SERVICE_URLS[serviceKey];
}
