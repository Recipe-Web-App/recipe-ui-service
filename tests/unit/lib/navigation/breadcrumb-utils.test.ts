import { describe, it, expect } from '@jest/globals';
import {
  collapseBreadcrumbs,
  detectNavigationPattern,
  filterBreadcrumbsByAuth,
  formatBreadcrumbLabel,
  buildRecipeBreadcrumb,
  enrichBreadcrumbsWithContext,
} from '@/lib/navigation/breadcrumb-utils';
import type { BreadcrumbItem } from '@/types/ui/breadcrumb';
import type { NavigationContext } from '@/types/navigation';

describe('breadcrumb-utils', () => {
  describe('collapseBreadcrumbs', () => {
    it('should not collapse when items <= maxItems', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
        { id: '3', label: 'Detail' },
      ];

      const collapsed = collapseBreadcrumbs(items, 5);
      expect(collapsed).toHaveLength(3);
      expect(collapsed).toEqual(items);
    });

    it('should collapse when items > maxItems', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
        { id: '3', label: 'Category', href: '/recipes/category' },
        { id: '4', label: 'Subcategory', href: '/recipes/category/sub' },
        { id: '5', label: 'Detail' },
      ];

      const collapsed = collapseBreadcrumbs(items, 3);

      // Should have first, ellipsis, and last 2 items
      expect(collapsed.length).toBeLessThanOrEqual(5);
      expect(collapsed[0]?.label).toBe('Home');
      expect(collapsed[collapsed.length - 1]?.label).toBe('Detail');

      // Should include ellipsis
      const hasEllipsis = collapsed.some(
        item =>
          item.metadata &&
          (item.metadata as { isEllipsis?: boolean }).isEllipsis
      );
      expect(hasEllipsis).toBe(true);
    });

    it('should handle very small maxItems', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
        { id: '3', label: 'Category', href: '/recipes/category' },
        { id: '4', label: 'Detail' },
      ];

      const collapsed = collapseBreadcrumbs(items, 2);

      // Should still have first, ellipsis, and last items
      expect(collapsed.length).toBeGreaterThan(2);
      expect(collapsed[0]?.label).toBe('Home');
      expect(collapsed[collapsed.length - 1]?.label).toBe('Detail');
    });
  });

  describe('detectNavigationPattern', () => {
    it('should detect search results pattern', () => {
      const pattern = detectNavigationPattern('/search?q=pasta');
      expect(pattern).toBe('search-results');
    });

    it('should detect cooking workflow pattern', () => {
      const pattern = detectNavigationPattern('/recipes/workflow/cooking');
      expect(pattern).toBe('cooking-workflow');
    });

    it('should detect meal planning pattern', () => {
      const pattern = detectNavigationPattern('/meal-plans/123');
      expect(pattern).toBe('meal-planning');
    });

    it('should detect collection pattern', () => {
      const pattern = detectNavigationPattern('/recipes/collections/456');
      expect(pattern).toBe('user-collection');
    });

    it('should detect recipe detail pattern', () => {
      const pattern = detectNavigationPattern('/recipes/123');
      expect(pattern).toBe('recipe-detail');
    });

    it('should default to category browse', () => {
      const pattern = detectNavigationPattern('/other/path');
      expect(pattern).toBe('category-browse');
    });
  });

  describe('filterBreadcrumbsByAuth', () => {
    it('should filter out auth-required items when not authenticated', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Public', href: '/public' },
        {
          id: '3',
          label: 'Private',
          href: '/private',
          metadata: { requiresAuth: true },
        },
      ];

      const filtered = filterBreadcrumbsByAuth(items, false);
      expect(filtered).toHaveLength(2);
      expect(filtered.some(item => item.label === 'Private')).toBe(false);
    });

    it('should keep all items when authenticated', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Public', href: '/public' },
        {
          id: '3',
          label: 'Private',
          href: '/private',
          metadata: { requiresAuth: true },
        },
      ];

      const filtered = filterBreadcrumbsByAuth(items, true);
      expect(filtered).toHaveLength(3);
    });

    it('should keep items without auth requirements', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Public', href: '/public' },
      ];

      const filtered = filterBreadcrumbsByAuth(items, false);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('formatBreadcrumbLabel', () => {
    it('should replace single parameter', () => {
      const label = formatBreadcrumbLabel('Recipe: {name}', { name: 'Pasta' });
      expect(label).toBe('Recipe: Pasta');
    });

    it('should replace multiple parameters', () => {
      const label = formatBreadcrumbLabel('{category} - {subcategory}', {
        category: 'Italian',
        subcategory: 'Pasta',
      });
      expect(label).toBe('Italian - Pasta');
    });

    it('should handle missing parameters', () => {
      const label = formatBreadcrumbLabel('Recipe: {name}', {});
      expect(label).toContain('{name}');
    });
  });

  describe('buildRecipeBreadcrumb', () => {
    it('should build category-browse breadcrumb', () => {
      const breadcrumbs = buildRecipeBreadcrumb('category-browse', {
        category: 'Italian',
        cuisine: 'Pasta',
      });

      expect(breadcrumbs).toHaveLength(4);
      expect(breadcrumbs[0]?.label).toBe('Home');
      expect(breadcrumbs[1]?.label).toBe('Recipes');
      expect(breadcrumbs[2]?.label).toBe('Italian');
      expect(breadcrumbs[3]?.label).toBe('Pasta');
    });

    it('should build recipe-detail breadcrumb', () => {
      const breadcrumbs = buildRecipeBreadcrumb('recipe-detail', {
        recipeId: '123',
        recipeName: 'Italian Pasta',
      });

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0]?.label).toBe('Home');
      expect(breadcrumbs[1]?.label).toBe('Recipes');
      expect(breadcrumbs[2]?.label).toBe('Italian Pasta');
    });

    it('should build cooking-workflow breadcrumb', () => {
      const breadcrumbs = buildRecipeBreadcrumb('cooking-workflow', {});

      expect(breadcrumbs).toHaveLength(4);
      expect(breadcrumbs[0]?.label).toBe('Planning');
      expect(breadcrumbs[1]?.label).toBe('Shopping');
      expect(breadcrumbs[2]?.label).toBe('Cooking');
      expect(breadcrumbs[3]?.label).toBe('Serving');
    });

    it('should build search-results breadcrumb', () => {
      const breadcrumbs = buildRecipeBreadcrumb('search-results', {
        searchQuery: 'pasta recipes',
      });

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0]?.label).toBe('Home');
      expect(breadcrumbs[1]?.label).toBe('Search');
      expect(breadcrumbs[2]?.label).toBe('"pasta recipes"');
    });

    it('should handle missing optional parameters', () => {
      const breadcrumbs = buildRecipeBreadcrumb('category-browse', {});

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]?.label).toBe('Home');
      expect(breadcrumbs[1]?.label).toBe('Recipes');
    });
  });

  describe('enrichBreadcrumbsWithContext', () => {
    it('should mark last item as current', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
        { id: '3', label: 'Detail', href: '/recipes/123' },
      ];

      const context: NavigationContext = {
        currentPath: '/recipes/123',
        isAuthenticated: true,
        userRoles: [],
        featureFlags: {},
        isMobile: false,
      };

      const enriched = enrichBreadcrumbsWithContext(items, context);

      expect(enriched[2]?.metadata).toMatchObject({
        current: true,
        depth: 2,
      });
      expect(enriched[2]?.href).toBeUndefined();
    });

    it('should add context to all items', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
      ];

      const context: NavigationContext = {
        currentPath: '/recipes',
        isAuthenticated: true,
        userRoles: ['user'],
        featureFlags: {},
        isMobile: false,
      };

      const enriched = enrichBreadcrumbsWithContext(items, context);

      enriched.forEach(item => {
        expect(item.metadata).toHaveProperty('isAuthenticated', true);
        expect(item.metadata).toHaveProperty('depth');
      });
    });

    it('should keep href for non-last items', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Home', href: '/' },
        { id: '2', label: 'Recipes', href: '/recipes' },
        { id: '3', label: 'Detail', href: '/recipes/123' },
      ];

      const context: NavigationContext = {
        currentPath: '/recipes/123',
        isAuthenticated: false,
        userRoles: [],
        featureFlags: {},
        isMobile: false,
      };

      const enriched = enrichBreadcrumbsWithContext(items, context);

      expect(enriched[0]?.href).toBe('/');
      expect(enriched[1]?.href).toBe('/recipes');
      expect(enriched[2]?.href).toBeUndefined();
    });
  });
});
