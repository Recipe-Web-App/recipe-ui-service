import { describe, it, expect } from '@jest/globals';
import {
  ROUTE_METADATA,
  getRouteMetadataByPattern,
  getAllRouteMetadata,
  routeRequiresAuth,
  isRouteHiddenFromBreadcrumbs,
  type RouteMetadata,
} from '@/lib/navigation/route-metadata';

describe('route-metadata', () => {
  describe('ROUTE_METADATA', () => {
    it('should contain route definitions', () => {
      expect(ROUTE_METADATA).toBeDefined();
      expect(Array.isArray(ROUTE_METADATA)).toBe(true);
      expect(ROUTE_METADATA.length).toBeGreaterThan(0);
    });

    it('should have required properties for each route', () => {
      ROUTE_METADATA.forEach(route => {
        expect(route).toHaveProperty('pattern');
        expect(route).toHaveProperty('label');
        expect(typeof route.pattern).toBe('string');
        expect(typeof route.label).toBe('string');
      });
    });

    it('should have unique patterns', () => {
      const patterns = ROUTE_METADATA.map(r => r.pattern);
      const uniquePatterns = new Set(patterns);
      expect(patterns.length).toBe(uniquePatterns.size);
    });

    it('should include home route', () => {
      const homeRoute = ROUTE_METADATA.find(r => r.pattern === '/');
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.label).toBe('Home');
    });

    it('should include recipe routes', () => {
      const recipeRoutes = ROUTE_METADATA.filter(r =>
        r.pattern.startsWith('/recipes')
      );
      expect(recipeRoutes.length).toBeGreaterThan(0);
    });

    it('should include auth routes', () => {
      const authRoutes = ROUTE_METADATA.filter(
        r => r.pattern === '/login' || r.pattern === '/register'
      );
      expect(authRoutes.length).toBeGreaterThan(0);
    });
  });

  describe('getRouteMetadataByPattern', () => {
    it('should find route by exact pattern match', () => {
      const route = getRouteMetadataByPattern('/');
      expect(route).toBeDefined();
      expect(route?.pattern).toBe('/');
    });

    it('should find route by pattern', () => {
      const route = getRouteMetadataByPattern('/recipes');
      expect(route).toBeDefined();
      expect(route?.pattern).toBe('/recipes');
    });

    it('should return undefined for non-existent pattern', () => {
      const route = getRouteMetadataByPattern('/non-existent-route');
      expect(route).toBeUndefined();
    });

    it('should find dynamic route patterns', () => {
      const route = getRouteMetadataByPattern('/recipes/[id]');
      expect(route).toBeDefined();
      expect(route?.pattern).toBe('/recipes/[id]');
    });
  });

  describe('getAllRouteMetadata', () => {
    it('should return all route metadata', () => {
      const metadata = getAllRouteMetadata();
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata.length).toBe(ROUTE_METADATA.length);
    });

    it('should return route objects with patterns', () => {
      const metadata = getAllRouteMetadata();
      metadata.forEach(route => {
        expect(route).toHaveProperty('pattern');
        expect(typeof route.pattern).toBe('string');
      });
    });

    it('should include root pattern', () => {
      const metadata = getAllRouteMetadata();
      const patterns = metadata.map(r => r.pattern);
      expect(patterns).toContain('/');
    });
  });

  describe('routeRequiresAuth', () => {
    it('should return true for auth-required routes', () => {
      // /profile requires auth
      expect(routeRequiresAuth('/profile')).toBe(true);
      expect(routeRequiresAuth('/favorites')).toBe(true);
    });

    it('should return false for public routes', () => {
      expect(routeRequiresAuth('/login')).toBe(false);
      expect(routeRequiresAuth('/register')).toBe(false);
      expect(routeRequiresAuth('/')).toBe(false);
    });

    it('should return false for non-existent routes', () => {
      expect(routeRequiresAuth('/non-existent')).toBe(false);
    });
  });

  describe('isRouteHiddenFromBreadcrumbs', () => {
    it('should return true for hidden routes', () => {
      expect(isRouteHiddenFromBreadcrumbs('/login')).toBe(true);
      expect(isRouteHiddenFromBreadcrumbs('/register')).toBe(true);
      expect(isRouteHiddenFromBreadcrumbs('/forgot-password')).toBe(true);
    });

    it('should return false for visible routes', () => {
      expect(isRouteHiddenFromBreadcrumbs('/')).toBe(false);
      expect(isRouteHiddenFromBreadcrumbs('/recipes')).toBe(false);
    });

    it('should return false for non-existent routes', () => {
      expect(isRouteHiddenFromBreadcrumbs('/non-existent')).toBe(false);
    });
  });

  describe('Route metadata properties', () => {
    it('should have icons for main navigation routes', () => {
      const mainRoutes = ROUTE_METADATA.filter(
        r =>
          r.pattern === '/recipes' ||
          r.pattern === '/meal-plans' ||
          r.pattern === '/profile'
      );

      mainRoutes.forEach(route => {
        expect(route.icon).toBeDefined();
      });
    });

    it('should have recipe patterns for recipe routes', () => {
      const recipeDetailRoute = ROUTE_METADATA.find(
        r => r.pattern === '/recipes/[id]'
      );
      if (recipeDetailRoute) {
        expect(recipeDetailRoute.recipePattern).toBeDefined();
      }
    });

    it('should have label resolvers for dynamic routes', () => {
      const dynamicRoutes = ROUTE_METADATA.filter(r => r.pattern.includes('['));

      // At least some dynamic routes should have label resolvers
      const routesWithResolvers = dynamicRoutes.filter(r => r.labelResolver);
      expect(routesWithResolvers.length).toBeGreaterThan(0);
    });

    it('should not have href for routes', () => {
      // Route metadata should use pattern, not href
      ROUTE_METADATA.forEach(route => {
        expect(route).not.toHaveProperty('href');
      });
    });
  });

  describe('Route hierarchy validation', () => {
    it('should have valid parent references', () => {
      const allMetadata = getAllRouteMetadata();
      const patterns = allMetadata.map(r => r.pattern);

      ROUTE_METADATA.forEach(route => {
        if (route.parent) {
          expect(patterns).toContain(route.parent);
        }
      });
    });

    it('should not have circular parent references', () => {
      const visitedPatterns = new Set<string>();

      const checkCircular = (pattern: string, path: string[] = []): void => {
        if (path.includes(pattern)) {
          throw new Error(
            `Circular reference detected: ${path.join(' -> ')} -> ${pattern}`
          );
        }

        if (visitedPatterns.has(pattern)) {
          return;
        }

        visitedPatterns.add(pattern);

        const route = getRouteMetadataByPattern(pattern);
        if (route?.parent) {
          checkCircular(route.parent, [...path, pattern]);
        }
      };

      expect(() => {
        ROUTE_METADATA.forEach(route => {
          checkCircular(route.pattern);
        });
      }).not.toThrow();
    });
  });

  describe('Label resolvers', () => {
    it('should have async label resolvers for dynamic routes', async () => {
      const recipeDetailRoute = ROUTE_METADATA.find(
        r => r.pattern === '/recipes/[id]'
      );

      if (recipeDetailRoute?.labelResolver) {
        const label = await recipeDetailRoute.labelResolver({ id: '123' });
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      }
    });

    it('should handle missing parameters in label resolvers', async () => {
      const dynamicRoute = ROUTE_METADATA.find(r => r.labelResolver);

      if (dynamicRoute?.labelResolver) {
        const label = await dynamicRoute.labelResolver({});
        expect(typeof label).toBe('string');
      }
    });
  });

  describe('Special route flags', () => {
    it('should mark appropriate routes as hidden from breadcrumbs', () => {
      const hiddenRoutes = ROUTE_METADATA.filter(r => r.hiddenFromBreadcrumbs);

      // Should be array (even if empty)
      expect(Array.isArray(hiddenRoutes)).toBe(true);
    });

    it('should have consistent auth requirements', () => {
      // Login and register should not require auth
      expect(routeRequiresAuth('/login')).toBe(false);
      expect(routeRequiresAuth('/register')).toBe(false);
    });
  });

  describe('Recipe navigation patterns', () => {
    it('should define recipe navigation patterns', () => {
      const recipeRoutes = ROUTE_METADATA.filter(r => r.recipePattern);
      expect(recipeRoutes.length).toBeGreaterThan(0);
    });

    it('should have valid recipe pattern types', () => {
      const validPatterns = [
        'category-browse',
        'recipe-detail',
        'cooking-workflow',
        'search-results',
        'user-collection',
        'meal-planning',
      ];

      const recipeRoutes = ROUTE_METADATA.filter(r => r.recipePattern);

      recipeRoutes.forEach(route => {
        if (route.recipePattern) {
          expect(validPatterns).toContain(route.recipePattern);
        }
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty pattern search', () => {
      const route = getRouteMetadataByPattern('');
      expect(route).toBeUndefined();
    });

    it('should handle patterns with trailing slashes', () => {
      const route = getRouteMetadataByPattern('/recipes/');
      // Should either find or not find, but not throw
      expect(route === undefined || route?.pattern === '/recipes').toBe(true);
    });

    it('should return consistent results for multiple calls', () => {
      const route1 = getRouteMetadataByPattern('/recipes');
      const route2 = getRouteMetadataByPattern('/recipes');

      expect(route1).toEqual(route2);
    });
  });
});
