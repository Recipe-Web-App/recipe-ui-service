// Search and Filter Types
export type SortDirection = 'asc' | 'desc';
export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'range'
  | 'in'
  | 'notIn'
  | 'greaterThan'
  | 'lessThan';

export interface SortConfig {
  field: string;
  direction: SortDirection;
  label?: string;
}

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: unknown;
  label: string;
  category?: string;
}

export interface SearchQuery {
  query: string;
  filters: Filter[];
  sort: SortConfig;
  timestamp: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SearchState {
  activeQuery: string;
  searchHistory: string[];
  activeFilters: Filter[];
  savedSearches: SavedSearch[];
  sortConfig: SortConfig;
  suggestions: string[];
  isSearching: boolean;
}
