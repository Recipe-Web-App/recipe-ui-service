import { useSearchFilterStore } from '@/stores/ui/search-filter-store';

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

describe('useSearchFilterStore', () => {
  beforeEach(() => {
    // Reset store state
    useSearchFilterStore.setState({
      activeQuery: '',
      activeFilters: [],
      sortConfig: { field: '', direction: 'asc' },
      searchHistory: [],
      savedSearches: [],
      suggestions: [],
      isSearching: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useSearchFilterStore.getState();

      expect(state.activeQuery).toBe('');
      expect(state.activeFilters).toEqual([]);
      expect(state.sortConfig).toEqual({ field: '', direction: 'asc' });
      expect(state.searchHistory).toEqual([]);
      expect(state.savedSearches).toEqual([]);
      expect(state.suggestions).toEqual([]);
      expect(state.isSearching).toBe(false);
    });
  });

  describe('query management', () => {
    it('should set query', () => {
      useSearchFilterStore.getState().setQuery('test search');
      expect(useSearchFilterStore.getState().activeQuery).toBe('test search');
    });

    it('should clear query', () => {
      useSearchFilterStore.getState().setQuery('test search');
      useSearchFilterStore.getState().clearQuery();
      expect(useSearchFilterStore.getState().activeQuery).toBe('');
    });

    it('should add to search history when setting query', () => {
      useSearchFilterStore.getState().setQuery('first search');
      useSearchFilterStore.getState().setQuery('second search');

      const history = useSearchFilterStore.getState().searchHistory;
      expect(history).toContain('first search');
      expect(history).toContain('second search');
      expect(history[0]).toBe('second search'); // Most recent first
    });

    it('should not add empty queries to history', () => {
      useSearchFilterStore.getState().setQuery('   ');
      expect(useSearchFilterStore.getState().searchHistory).toEqual([]);
    });

    it('should add to history manually', () => {
      useSearchFilterStore.getState().addToHistory('manual entry');
      expect(useSearchFilterStore.getState().searchHistory).toContain(
        'manual entry'
      );
    });

    it('should not add empty strings to history', () => {
      useSearchFilterStore.getState().addToHistory('');
      useSearchFilterStore.getState().addToHistory('   ');
      expect(useSearchFilterStore.getState().searchHistory).toEqual([]);
    });

    it('should clear search history', () => {
      useSearchFilterStore.getState().addToHistory('test');
      useSearchFilterStore.getState().clearHistory();
      expect(useSearchFilterStore.getState().searchHistory).toEqual([]);
    });

    it('should remove specific item from history', () => {
      useSearchFilterStore.getState().addToHistory('first');
      useSearchFilterStore.getState().addToHistory('second');
      useSearchFilterStore.getState().removeFromHistory('first');

      const history = useSearchFilterStore.getState().searchHistory;
      expect(history).not.toContain('first');
      expect(history).toContain('second');
    });
  });

  describe('filter management', () => {
    it('should add filter', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      const filters = useSearchFilterStore.getState().activeFilters;
      expect(filters).toHaveLength(1);
      expect(filters[0].field).toBe('category');
      expect(filters[0].value).toBe('main');
    });

    it('should remove filter', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      const filterId = useSearchFilterStore.getState().activeFilters[0].id;
      useSearchFilterStore.getState().removeFilter(filterId);

      expect(useSearchFilterStore.getState().activeFilters).toHaveLength(0);
    });

    it('should update filter', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      const filterId = useSearchFilterStore.getState().activeFilters[0].id;
      useSearchFilterStore.getState().updateFilter(filterId, { value: 'side' });

      const filters = useSearchFilterStore.getState().activeFilters;
      expect(filters[0].value).toBe('side');
    });

    it('should clear all filters', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      useSearchFilterStore.getState().clearFilters();
      expect(useSearchFilterStore.getState().activeFilters).toEqual([]);
    });

    it('should clear filters by category', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      useSearchFilterStore.getState().addFilter({
        field: 'author',
        operator: 'equals',
        value: 'chef',
        label: 'Chef Author',
        category: 'user',
      });

      useSearchFilterStore.getState().clearFiltersByCategory('recipe');

      const filters = useSearchFilterStore.getState().activeFilters;
      expect(filters).toHaveLength(1);
      expect(filters[0].category).toBe('user');
    });
  });

  describe('sort management', () => {
    it('should set sort config', () => {
      useSearchFilterStore.getState().setSortConfig('name', 'desc');

      const sortConfig = useSearchFilterStore.getState().sortConfig;
      expect(sortConfig.field).toBe('name');
      expect(sortConfig.direction).toBe('desc');
    });

    it('should default to asc direction', () => {
      useSearchFilterStore.getState().setSortConfig('name');
      expect(useSearchFilterStore.getState().sortConfig.direction).toBe('asc');
    });

    it('should toggle sort direction', () => {
      useSearchFilterStore.getState().setSortConfig('name', 'asc');
      useSearchFilterStore.getState().toggleSortDirection('name');
      expect(useSearchFilterStore.getState().sortConfig.direction).toBe('desc');

      useSearchFilterStore.getState().toggleSortDirection('name');
      expect(useSearchFilterStore.getState().sortConfig.direction).toBe('asc');
    });

    it('should default to asc when toggling new field', () => {
      useSearchFilterStore.getState().setSortConfig('name', 'desc');
      useSearchFilterStore.getState().toggleSortDirection('date');

      const sortConfig = useSearchFilterStore.getState().sortConfig;
      expect(sortConfig.field).toBe('date');
      expect(sortConfig.direction).toBe('desc'); // Should toggle from default asc
    });

    it('should clear sort', () => {
      useSearchFilterStore.getState().setSortConfig('name', 'desc');
      useSearchFilterStore.getState().clearSort();

      const sortConfig = useSearchFilterStore.getState().sortConfig;
      expect(sortConfig.field).toBe('');
      expect(sortConfig.direction).toBe('asc');
    });
  });

  describe('saved searches', () => {
    it('should save current search state', () => {
      useSearchFilterStore.getState().setQuery('test query');
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });
      useSearchFilterStore.getState().setSortConfig('name', 'desc');

      const id = useSearchFilterStore.getState().saveSearch('My Search');
      const savedSearches = useSearchFilterStore.getState().savedSearches;

      expect(savedSearches).toHaveLength(1);
      expect(savedSearches[0].id).toBe(id);
      expect(savedSearches[0].name).toBe('My Search');
      expect(savedSearches[0].query.query).toBe('test query');
      expect(savedSearches[0].query.filters).toHaveLength(1);
      expect(savedSearches[0].query.sort.field).toBe('name');
    });

    it('should save search with custom config', () => {
      const customConfig = {
        query: 'custom query',
        filters: [
          {
            id: 'custom',
            field: 'custom',
            operator: 'equals' as const,
            value: 'value',
            label: 'Custom Filter',
          },
        ],
        sort: { field: 'custom', direction: 'asc' as const },
      };

      const id = useSearchFilterStore
        .getState()
        .saveSearch('Custom Search', customConfig);
      const savedSearch = useSearchFilterStore.getState().savedSearches[0];

      expect(savedSearch.query.query).toBe('custom query');
      expect(savedSearch.query.filters[0].field).toBe('custom');
    });

    it('should load saved search', () => {
      useSearchFilterStore.getState().setQuery('original');
      const id = useSearchFilterStore.getState().saveSearch('Test Search');

      useSearchFilterStore.getState().setQuery('changed');
      useSearchFilterStore.getState().loadSavedSearch(id);

      expect(useSearchFilterStore.getState().activeQuery).toBe('original');
    });

    it('should delete saved search', () => {
      const id = useSearchFilterStore.getState().saveSearch('Test Search');
      useSearchFilterStore.getState().deleteSavedSearch(id);

      expect(useSearchFilterStore.getState().savedSearches).toHaveLength(0);
    });

    it('should update saved search', async () => {
      const id = useSearchFilterStore.getState().saveSearch('Original Name');

      // Small delay to ensure updatedAt is different from createdAt
      await new Promise(resolve => setTimeout(resolve, 10));

      useSearchFilterStore
        .getState()
        .updateSavedSearch(id, { name: 'Updated Name' });

      const savedSearch = useSearchFilterStore.getState().savedSearches[0];
      expect(savedSearch.name).toBe('Updated Name');
      expect(savedSearch.updatedAt).toBeGreaterThan(savedSearch.createdAt);
    });

    it('should set default search', () => {
      const id1 = useSearchFilterStore.getState().saveSearch('Search 1');
      const id2 = useSearchFilterStore.getState().saveSearch('Search 2');

      useSearchFilterStore.getState().setDefaultSearch(id2);

      const savedSearches = useSearchFilterStore.getState().savedSearches;
      expect(savedSearches.find(s => s.id === id1)?.isDefault).toBeFalsy();
      expect(savedSearches.find(s => s.id === id2)?.isDefault).toBe(true);
    });
  });

  describe('suggestions', () => {
    it('should set suggestions', () => {
      const suggestions = ['apple', 'banana', 'cherry'];
      useSearchFilterStore.getState().setSuggestions(suggestions);
      expect(useSearchFilterStore.getState().suggestions).toEqual(suggestions);
    });

    it('should clear suggestions', () => {
      useSearchFilterStore.getState().setSuggestions(['test']);
      useSearchFilterStore.getState().clearSuggestions();
      expect(useSearchFilterStore.getState().suggestions).toEqual([]);
    });
  });

  describe('search state', () => {
    it('should set searching state', () => {
      useSearchFilterStore.getState().setIsSearching(true);
      expect(useSearchFilterStore.getState().isSearching).toBe(true);
    });
  });

  describe('utility methods', () => {
    it('should get current search query', () => {
      useSearchFilterStore.getState().setQuery('test');
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });
      useSearchFilterStore.getState().setSortConfig('name', 'desc');

      const currentQuery = useSearchFilterStore
        .getState()
        .getCurrentSearchQuery();
      expect(currentQuery.query).toBe('test');
      expect(currentQuery.filters).toHaveLength(1);
      expect(currentQuery.sort.field).toBe('name');
      expect(typeof currentQuery.timestamp).toBe('number');
    });

    it('should check if has active filters', () => {
      expect(useSearchFilterStore.getState().hasActiveFilters()).toBe(false);

      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      expect(useSearchFilterStore.getState().hasActiveFilters()).toBe(true);
    });

    it('should get filters by category', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      useSearchFilterStore.getState().addFilter({
        field: 'author',
        operator: 'equals',
        value: 'chef',
        label: 'Chef Author',
        category: 'user',
      });

      const recipeFilters = useSearchFilterStore
        .getState()
        .getFiltersByCategory('recipe');
      expect(recipeFilters).toHaveLength(1);
      expect(recipeFilters[0].field).toBe('category');
    });

    it('should check if filter is active', () => {
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      expect(
        useSearchFilterStore.getState().isFilterActive('category', 'main')
      ).toBe(true);
      expect(
        useSearchFilterStore.getState().isFilterActive('category', 'side')
      ).toBe(false);
      expect(
        useSearchFilterStore.getState().isFilterActive('author', 'chef')
      ).toBe(false);
    });

    it('should export search state', () => {
      useSearchFilterStore.getState().setQuery('test');
      useSearchFilterStore.getState().addFilter({
        field: 'category',
        operator: 'equals',
        value: 'main',
        label: 'Main Category',
        category: 'recipe',
      });

      const exported = useSearchFilterStore.getState().exportSearchState();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(parsed.activeQuery).toBe('test');
      expect(parsed.activeFilters).toHaveLength(1);
    });

    it('should import search state', () => {
      const exportData = {
        activeQuery: 'imported query',
        activeFilters: [
          {
            id: 'test',
            field: 'category',
            operator: 'equals',
            value: 'imported',
            label: 'Imported Filter',
            category: 'recipe',
          },
        ],
        sortConfig: { field: 'date', direction: 'desc' },
        savedSearches: [],
      };

      useSearchFilterStore
        .getState()
        .importSearchState(JSON.stringify(exportData));

      const state = useSearchFilterStore.getState();
      expect(state.activeQuery).toBe('imported query');
      expect(state.activeFilters).toHaveLength(1);
      expect(state.sortConfig.field).toBe('date');
    });

    it('should handle invalid import data', () => {
      const originalState = useSearchFilterStore.getState();

      useSearchFilterStore.getState().importSearchState('invalid json');

      // State should remain unchanged on error
      const newState = useSearchFilterStore.getState();
      expect(newState.activeQuery).toBe(originalState.activeQuery);
    });
  });
});
