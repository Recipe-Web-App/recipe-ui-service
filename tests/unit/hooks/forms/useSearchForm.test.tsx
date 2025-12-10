import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchForm } from '@/hooks/forms/useSearchForm';
import { DifficultyLevel } from '@/types/recipe-management/common';
import React from 'react';

// Mock the search API
jest.mock('@/lib/api/recipe-management', () => ({
  searchApi: {
    searchRecipes: jest.fn(),
  },
}));

// Mock constants
jest.mock('@/constants', () => ({
  QUERY_KEYS: {
    RECIPE_MANAGEMENT: {
      SEARCH: ['recipe-management', 'search'] as const,
    },
  },
}));

describe('useSearchForm hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      const values = result.current.form.getValues();
      expect(values.query).toBe('');
      expect(values.ingredients).toEqual([]);
      expect(values.tags).toEqual([]);
      expect(values.difficulty).toBeUndefined();
      expect(values.maxPrepTime).toBeUndefined();
      expect(values.maxCookTime).toBeUndefined();
    });

    it('should initialize with custom initial filters', () => {
      const initialFilters = {
        query: 'pasta',
        ingredients: ['tomato'],
        tags: ['italian'],
      };

      const { result } = renderHook(() => useSearchForm({ initialFilters }), {
        wrapper,
      });

      const values = result.current.form.getValues();
      expect(values.query).toBe('pasta');
      expect(values.ingredients).toEqual(['tomato']);
      expect(values.tags).toEqual(['italian']);
    });

    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      expect(result.current.isSearching).toBe(false);
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
      expect(result.current.searchResults).toBeUndefined();
      expect(result.current.searchError).toBeNull();
    });
  });

  describe('form methods', () => {
    it('should provide all form methods', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      expect(typeof result.current.handleSubmit).toBe('function');
      expect(typeof result.current.resetForm).toBe('function');
      expect(typeof result.current.clearFilters).toBe('function');
      expect(typeof result.current.addIngredient).toBe('function');
      expect(typeof result.current.removeIngredient).toBe('function');
      expect(typeof result.current.addTag).toBe('function');
      expect(typeof result.current.removeTag).toBe('function');
      expect(typeof result.current.toggleDifficulty).toBe('function');
      expect(typeof result.current.getFieldError).toBe('function');
      expect(typeof result.current.validateField).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.clearErrors).toBe('function');
    });
  });

  describe('ingredient management', () => {
    it('should add ingredient', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addIngredient('tomato');
      });

      expect(result.current.form.getValues('ingredients')).toEqual(['tomato']);
    });

    it('should add multiple ingredients', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addIngredient('tomato');
        result.current.addIngredient('basil');
        result.current.addIngredient('mozzarella');
      });

      expect(result.current.form.getValues('ingredients')).toEqual([
        'tomato',
        'basil',
        'mozzarella',
      ]);
    });

    it('should remove ingredient by index', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addIngredient('tomato');
        result.current.addIngredient('basil');
        result.current.addIngredient('mozzarella');
      });

      act(() => {
        result.current.removeIngredient(1);
      });

      expect(result.current.form.getValues('ingredients')).toEqual([
        'tomato',
        'mozzarella',
      ]);
    });
  });

  describe('tag management', () => {
    it('should add tag', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addTag('italian');
      });

      expect(result.current.form.getValues('tags')).toEqual(['italian']);
    });

    it('should add multiple tags', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addTag('italian');
        result.current.addTag('quick');
        result.current.addTag('healthy');
      });

      expect(result.current.form.getValues('tags')).toEqual([
        'italian',
        'quick',
        'healthy',
      ]);
    });

    it('should remove tag by index', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.addTag('italian');
        result.current.addTag('quick');
        result.current.addTag('healthy');
      });

      act(() => {
        result.current.removeTag(1);
      });

      expect(result.current.form.getValues('tags')).toEqual([
        'italian',
        'healthy',
      ]);
    });
  });

  describe('difficulty management', () => {
    it('should set difficulty level', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.toggleDifficulty(DifficultyLevel.EASY);
      });

      expect(result.current.form.getValues('difficulty')).toBe(
        DifficultyLevel.EASY
      );
    });

    it('should toggle difficulty level off when same value', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.toggleDifficulty(DifficultyLevel.EASY);
      });

      expect(result.current.form.getValues('difficulty')).toBe(
        DifficultyLevel.EASY
      );

      act(() => {
        result.current.toggleDifficulty(DifficultyLevel.EASY);
      });

      expect(result.current.form.getValues('difficulty')).toBeUndefined();
    });

    it('should replace difficulty when different value selected', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.toggleDifficulty(DifficultyLevel.EASY);
      });

      act(() => {
        result.current.toggleDifficulty(DifficultyLevel.HARD);
      });

      expect(result.current.form.getValues('difficulty')).toBe(
        DifficultyLevel.HARD
      );
    });
  });

  describe('form state management', () => {
    it('should update query field', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.form.setValue('query', 'pasta');
      });

      expect(result.current.form.getValues('query')).toBe('pasta');
    });

    it('should update time constraints', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.form.setValue('maxPrepTime', 30);
        result.current.form.setValue('maxCookTime', 60);
      });

      expect(result.current.form.getValues('maxPrepTime')).toBe(30);
      expect(result.current.form.getValues('maxCookTime')).toBe(60);
    });
  });

  describe('active filters tracking', () => {
    it('should track active filters', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);

      act(() => {
        result.current.form.setValue('query', 'pasta');
      });

      expect(result.current.hasActiveFilters).toBe(true);
      expect(result.current.activeFilterCount).toBe(1);

      act(() => {
        result.current.addIngredient('tomato');
      });

      expect(result.current.activeFilterCount).toBe(2);
    });

    it('should count all active filters correctly', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.form.setValue('query', 'pasta');
        result.current.addIngredient('tomato');
        result.current.addTag('italian');
        result.current.toggleDifficulty(DifficultyLevel.EASY);
        result.current.form.setValue('maxPrepTime', 30);
        result.current.form.setValue('maxCookTime', 60);
      });

      expect(result.current.activeFilterCount).toBe(6);
    });
  });

  describe('clear filters', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.form.setValue('query', 'pasta');
        result.current.addIngredient('tomato');
        result.current.addTag('italian');
        result.current.form.setValue('maxPrepTime', 30);
      });

      expect(result.current.hasActiveFilters).toBe(true);

      act(() => {
        result.current.clearFilters();
      });

      const values = result.current.form.getValues();
      expect(values.query).toBe('');
      expect(values.ingredients).toEqual([]);
      expect(values.tags).toEqual([]);
      expect(values.maxPrepTime).toBeUndefined();
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('reset form', () => {
    it('should reset to initial values', () => {
      const initialFilters = { query: 'pasta', ingredients: ['tomato'] };
      const { result } = renderHook(() => useSearchForm({ initialFilters }), {
        wrapper,
      });

      act(() => {
        result.current.form.setValue('query', 'pizza');
        result.current.addIngredient('cheese');
      });

      act(() => {
        result.current.resetForm();
      });

      const values = result.current.form.getValues();
      expect(values.query).toBe('pasta');
      expect(values.ingredients).toEqual(['tomato']);
    });
  });

  describe('validation helpers', () => {
    it('should provide field error getter', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      expect(typeof result.current.getFieldError).toBe('function');
    });

    it('should provide validation methods', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      expect(typeof result.current.validateField).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.clearErrors).toBe('function');
    });

    it('should clear errors', () => {
      const { result } = renderHook(() => useSearchForm(), { wrapper });

      act(() => {
        result.current.clearErrors();
      });

      // Should not throw and errors should be cleared
      expect(Object.keys(result.current.form.formState.errors).length).toBe(0);
    });
  });

  describe('callbacks', () => {
    it('should accept onSearch callback', () => {
      const onSearch = jest.fn();
      const { result } = renderHook(() => useSearchForm({ onSearch }), {
        wrapper,
      });

      expect(result.current.handleSubmit).toBeDefined();
    });

    it('should accept onError callback', () => {
      const onError = jest.fn();
      const { result } = renderHook(() => useSearchForm({ onError }), {
        wrapper,
      });

      expect(result.current.handleSubmit).toBeDefined();
    });

    it('should accept onResultsChange callback', () => {
      const onResultsChange = jest.fn();
      const { result } = renderHook(() => useSearchForm({ onResultsChange }), {
        wrapper,
      });

      expect(result.current.handleSubmit).toBeDefined();
    });
  });
});
