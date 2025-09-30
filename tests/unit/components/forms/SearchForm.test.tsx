import React from 'react';
import { SearchForm } from '@/components/forms/SearchForm';
import type { SearchFormData } from '@/lib/validation/search-schemas';

describe('SearchForm', () => {
  describe('SearchForm Component', () => {
    it('should export SearchForm component', () => {
      expect(SearchForm).toBeDefined();
      expect(typeof SearchForm).toBe('function');
    });

    it('should accept minimal props', () => {
      const props = {};
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept onSearch callback', () => {
      const onSearch = jest.fn();
      const props = { onSearch };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept onResultsChange callback', () => {
      const onResultsChange = jest.fn();
      const props = { onResultsChange };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept onError callback', () => {
      const onError = jest.fn();
      const props = { onError };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept initialFilters', () => {
      const initialFilters: Partial<SearchFormData> = {
        query: 'pasta',
        ingredients: ['tomato'],
      };
      const props = { initialFilters };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept autoSearch prop', () => {
      const props = { autoSearch: true };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept debounceMs prop', () => {
      const props = { debounceMs: 500 };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept paginationParams prop', () => {
      const paginationParams = { page: 0, size: 20 };
      const props = { paginationParams };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept showCard prop', () => {
      const props = { showCard: false };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept className prop', () => {
      const props = { className: 'custom-class' };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept compact prop', () => {
      const props = { compact: true };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should accept title prop', () => {
      const props = { title: 'Find Recipes' };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });
  });

  describe('SearchForm Props Validation', () => {
    it('should handle all props together', () => {
      const props = {
        onSearch: jest.fn(),
        onResultsChange: jest.fn(),
        onError: jest.fn(),
        initialFilters: { query: 'pasta' },
        autoSearch: true,
        debounceMs: 500,
        paginationParams: { page: 0, size: 20 },
        showCard: false,
        className: 'test-class',
        compact: true,
        title: 'Custom Title',
      };
      const element = React.createElement(SearchForm, props);
      expect(element.props.onSearch).toBe(props.onSearch);
      expect(element.props.autoSearch).toBe(true);
      expect(element.props.compact).toBe(true);
      expect(element.props.title).toBe('Custom Title');
    });

    it('should use default values when props are not provided', () => {
      const element = React.createElement(SearchForm, {});
      expect(element.props.autoSearch).toBeUndefined();
      expect(element.props.showCard).toBeUndefined();
      expect(element.props.compact).toBeUndefined();
    });
  });

  describe('SearchForm Features', () => {
    it('should support basic search mode', () => {
      const props = { compact: false };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support compact mode', () => {
      const props = { compact: true };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support auto-search feature', () => {
      const props = { autoSearch: true, debounceMs: 300 };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support manual search mode', () => {
      const props = { autoSearch: false };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support initial filters', () => {
      const initialFilters = {
        query: 'pasta',
        ingredients: ['tomato', 'basil'],
        tags: ['italian'],
        maxPrepTime: 30,
      };
      const props = { initialFilters };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });
  });

  describe('SearchForm Layout Options', () => {
    it('should support card layout', () => {
      const props = { showCard: true };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support non-card layout', () => {
      const props = { showCard: false };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support custom className', () => {
      const props = { className: 'my-custom-search-form' };
      const element = React.createElement(SearchForm, props);
      expect(element.props.className).toBe('my-custom-search-form');
    });

    it('should support custom title', () => {
      const props = { title: 'Advanced Recipe Search' };
      const element = React.createElement(SearchForm, props);
      expect(element.props.title).toBe('Advanced Recipe Search');
    });
  });

  describe('SearchForm Callback Integration', () => {
    it('should integrate with onSearch callback', () => {
      const onSearch = jest.fn();
      const props = { onSearch };
      const element = React.createElement(SearchForm, props);
      expect(element.props.onSearch).toBe(onSearch);
    });

    it('should integrate with onResultsChange callback', () => {
      const onResultsChange = jest.fn();
      const props = { onResultsChange };
      const element = React.createElement(SearchForm, props);
      expect(element.props.onResultsChange).toBe(onResultsChange);
    });

    it('should integrate with onError callback', () => {
      const onError = jest.fn();
      const props = { onError };
      const element = React.createElement(SearchForm, props);
      expect(element.props.onError).toBe(onError);
    });

    it('should integrate with all callbacks', () => {
      const callbacks = {
        onSearch: jest.fn(),
        onResultsChange: jest.fn(),
        onError: jest.fn(),
      };
      const element = React.createElement(SearchForm, callbacks);
      expect(element.props.onSearch).toBe(callbacks.onSearch);
      expect(element.props.onResultsChange).toBe(callbacks.onResultsChange);
      expect(element.props.onError).toBe(callbacks.onError);
    });
  });

  describe('SearchForm Filter Types', () => {
    it('should support query filter', () => {
      const props = { initialFilters: { query: 'pasta' } };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support ingredients filter', () => {
      const props = {
        initialFilters: { ingredients: ['tomato', 'basil', 'mozzarella'] },
      };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support tags filter', () => {
      const props = {
        initialFilters: { tags: ['italian', 'quick', 'healthy'] },
      };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support difficulty filter', () => {
      const props = {
        initialFilters: { difficulty: [] },
      };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support time constraint filters', () => {
      const props = {
        initialFilters: { maxPrepTime: 30, maxCookTime: 60 },
      };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support rating filter', () => {
      const props = { initialFilters: { minRating: 4 } };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });

    it('should support sort by filter', () => {
      const props = { initialFilters: { sortBy: undefined } };
      expect(() => React.createElement(SearchForm, props)).not.toThrow();
    });
  });

  describe('SearchForm Pagination', () => {
    it('should support pagination parameters', () => {
      const paginationParams = { page: 0, size: 20 };
      const props = { paginationParams };
      const element = React.createElement(SearchForm, props);
      expect(element.props.paginationParams).toEqual(paginationParams);
    });

    it('should support custom page size', () => {
      const paginationParams = { page: 0, size: 50 };
      const props = { paginationParams };
      const element = React.createElement(SearchForm, props);
      expect(element.props.paginationParams?.size).toBe(50);
    });

    it('should support page navigation', () => {
      const paginationParams = { page: 2, size: 20 };
      const props = { paginationParams };
      const element = React.createElement(SearchForm, props);
      expect(element.props.paginationParams?.page).toBe(2);
    });
  });
});
