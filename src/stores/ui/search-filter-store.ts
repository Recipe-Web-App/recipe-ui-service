import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SearchState,
  SearchQuery,
  SavedSearch,
  Filter,
  SortDirection,
} from '@/types/ui/search-filter';

interface SearchFilterStoreState extends SearchState {
  // Query actions
  setQuery: (query: string) => void;
  clearQuery: () => void;
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;

  // Filter actions
  addFilter: (filter: Omit<Filter, 'id'>) => void;
  removeFilter: (filterId: string) => void;
  updateFilter: (filterId: string, updates: Partial<Filter>) => void;
  clearFilters: () => void;
  clearFiltersByCategory: (category: string) => void;

  // Sort actions
  setSortConfig: (field: string, direction?: SortDirection) => void;
  toggleSortDirection: (field: string) => void;
  clearSort: () => void;

  // Saved search actions
  saveSearch: (name: string, config?: Partial<SearchQuery>) => string;
  loadSavedSearch: (id: string) => void;
  deleteSavedSearch: (id: string) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  setDefaultSearch: (id: string) => void;

  // Suggestion actions
  setSuggestions: (suggestions: string[]) => void;
  clearSuggestions: () => void;

  // Search state actions
  setIsSearching: (isSearching: boolean) => void;

  // Utility methods
  getCurrentSearchQuery: () => SearchQuery;
  hasActiveFilters: () => boolean;
  getFiltersByCategory: (category: string) => Filter[];
  isFilterActive: (field: string, value: unknown) => boolean;
  exportSearchState: () => string;
  importSearchState: (data: string) => void;
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const MAX_HISTORY_SIZE = 20;
const MAX_SAVED_SEARCHES = 50;

export const useSearchFilterStore = create<SearchFilterStoreState>()(
  persist(
    (set, get) => ({
      activeQuery: '',
      searchHistory: [],
      activeFilters: [],
      savedSearches: [],
      sortConfig: { field: '', direction: 'asc' },
      suggestions: [],
      isSearching: false,

      setQuery: (query: string) => {
        set({ activeQuery: query });

        // Add to history if not empty and not already the last item
        if (query.trim() && get().searchHistory[0] !== query.trim()) {
          get().addToHistory(query.trim());
        }
      },

      clearQuery: () => {
        set({ activeQuery: '' });
      },

      addToHistory: (query: string) => {
        if (!query.trim()) return;

        set(state => {
          let newHistory = state.searchHistory.filter(item => item !== query);
          newHistory.unshift(query);

          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory = newHistory.slice(0, MAX_HISTORY_SIZE);
          }

          return { searchHistory: newHistory };
        });
      },

      clearHistory: () => {
        set({ searchHistory: [] });
      },

      removeFromHistory: (query: string) => {
        set(state => ({
          searchHistory: state.searchHistory.filter(item => item !== query),
        }));
      },

      addFilter: (filterData: Omit<Filter, 'id'>) => {
        const filter: Filter = {
          id: generateId(),
          ...filterData,
        };

        set(state => ({
          activeFilters: [...state.activeFilters, filter],
        }));
      },

      removeFilter: (filterId: string) => {
        set(state => ({
          activeFilters: state.activeFilters.filter(
            filter => filter.id !== filterId
          ),
        }));
      },

      updateFilter: (filterId: string, updates: Partial<Filter>) => {
        set(state => ({
          activeFilters: state.activeFilters.map(filter =>
            filter.id === filterId ? { ...filter, ...updates } : filter
          ),
        }));
      },

      clearFilters: () => {
        set({ activeFilters: [] });
      },

      clearFiltersByCategory: (category: string) => {
        set(state => ({
          activeFilters: state.activeFilters.filter(
            filter => filter.category !== category
          ),
        }));
      },

      setSortConfig: (field: string, direction: SortDirection = 'asc') => {
        set({ sortConfig: { field, direction } });
      },

      toggleSortDirection: (field: string) => {
        set(state => {
          const currentDirection =
            state.sortConfig.field === field
              ? state.sortConfig.direction
              : 'asc';
          const newDirection: SortDirection =
            currentDirection === 'asc' ? 'desc' : 'asc';

          return {
            sortConfig: { field, direction: newDirection },
          };
        });
      },

      clearSort: () => {
        set({ sortConfig: { field: '', direction: 'asc' } });
      },

      saveSearch: (name: string, config?: Partial<SearchQuery>) => {
        const currentState = get();
        const id = generateId();

        const searchQuery: SearchQuery = {
          query: config?.query ?? currentState.activeQuery,
          filters: config?.filters ?? currentState.activeFilters,
          sort: config?.sort ?? currentState.sortConfig,
          timestamp: Date.now(),
        };

        const savedSearch: SavedSearch = {
          id,
          name,
          query: searchQuery,
          isDefault: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set(state => {
          let newSavedSearches = [...state.savedSearches, savedSearch];

          if (newSavedSearches.length > MAX_SAVED_SEARCHES) {
            newSavedSearches = newSavedSearches.slice(-MAX_SAVED_SEARCHES);
          }

          return { savedSearches: newSavedSearches };
        });

        return id;
      },

      loadSavedSearch: (id: string) => {
        const savedSearch = get().savedSearches.find(
          search => search.id === id
        );
        if (!savedSearch) return;

        set({
          activeQuery: savedSearch.query.query,
          activeFilters: savedSearch.query.filters,
          sortConfig: savedSearch.query.sort,
        });
      },

      deleteSavedSearch: (id: string) => {
        set(state => ({
          savedSearches: state.savedSearches.filter(search => search.id !== id),
        }));
      },

      updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => {
        set(state => ({
          savedSearches: state.savedSearches.map(search =>
            search.id === id
              ? { ...search, ...updates, updatedAt: Date.now() }
              : search
          ),
        }));
      },

      setDefaultSearch: (id: string) => {
        set(state => ({
          savedSearches: state.savedSearches.map(search => ({
            ...search,
            isDefault: search.id === id,
          })),
        }));
      },

      setSuggestions: (suggestions: string[]) => {
        set({ suggestions });
      },

      clearSuggestions: () => {
        set({ suggestions: [] });
      },

      setIsSearching: (isSearching: boolean) => {
        set({ isSearching });
      },

      getCurrentSearchQuery: () => {
        const state = get();
        return {
          query: state.activeQuery,
          filters: state.activeFilters,
          sort: state.sortConfig,
          timestamp: Date.now(),
        };
      },

      hasActiveFilters: () => {
        return get().activeFilters.length > 0;
      },

      getFiltersByCategory: (category: string) => {
        return get().activeFilters.filter(
          filter => filter.category === category
        );
      },

      isFilterActive: (field: string, value: unknown) => {
        return get().activeFilters.some(
          filter => filter.field === field && filter.value === value
        );
      },

      exportSearchState: () => {
        const state = get();
        const exportData = {
          activeQuery: state.activeQuery,
          activeFilters: state.activeFilters,
          sortConfig: state.sortConfig,
          savedSearches: state.savedSearches,
        };
        return JSON.stringify(exportData);
      },

      importSearchState: (data: string) => {
        try {
          const importData = JSON.parse(data) as {
            activeQuery?: string;
            activeFilters?: Filter[];
            sortConfig?: { field: string; direction: SortDirection };
            savedSearches?: SavedSearch[];
          };
          set({
            activeQuery: importData.activeQuery ?? '',
            activeFilters: importData.activeFilters ?? [],
            sortConfig: importData.sortConfig ?? {
              field: '',
              direction: 'asc',
            },
            savedSearches: importData.savedSearches ?? [],
          });
        } catch (error) {
          console.error('Failed to import search state:', error);
        }
      },
    }),
    {
      name: 'search-filter-storage',
      partialize: state => ({
        searchHistory: state.searchHistory.slice(0, 10), // Limit persisted history
        savedSearches: state.savedSearches,
      }),
    }
  )
);
