import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { revisionsApi } from '@/lib/api/recipe-management';
import {
  useRecipeRevisions,
  useStepRevisions,
  useIngredientRevisions,
  useAllRecipeRevisions,
  useLatestRevision,
  useRevisionComparison,
} from '@/hooks/recipe-management/useRevisions';
import type {
  RecipeRevisionsResponse,
  StepRevisionsResponse,
  IngredientRevisionsResponse,
  RevisionDto,
} from '@/types/recipe-management';
import { RevisionType, RevisionCategory } from '@/types/recipe-management';

jest.mock('@/lib/api/recipe-management', () => ({
  revisionsApi: {
    getRecipeRevisions: jest.fn(),
    getStepRevisions: jest.fn(),
    getIngredientRevisions: jest.fn(),
  },
}));

const mockedRevisionsApi = revisionsApi as jest.Mocked<typeof revisionsApi>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useRevisions hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRecipeRevisions', () => {
    it('should fetch recipe revisions successfully', async () => {
      const mockResponse: RecipeRevisionsResponse = {
        revisions: [
          {
            revisionId: 1,
            revisionType: 'UPDATE' as any,
            category: 'RECIPE' as any,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { title: 'Updated Recipe' },
          },
        ],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRecipeRevisions(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRevisionsApi.getRecipeRevisions).toHaveBeenCalledWith(1);
    });

    it('should handle disabled state when recipeId is 0', () => {
      const { result } = renderHook(() => useRecipeRevisions(0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRevisionsApi.getRecipeRevisions).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch revisions');
      mockedRevisionsApi.getRecipeRevisions.mockRejectedValue(error);

      const { result } = renderHook(() => useRecipeRevisions(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useStepRevisions', () => {
    it('should fetch step revisions successfully', async () => {
      const mockResponse: StepRevisionsResponse = {
        stepId: 1,
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { instruction: 'Mix ingredients' },
          },
        ],
      };

      mockedRevisionsApi.getStepRevisions.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useStepRevisions(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRevisionsApi.getStepRevisions).toHaveBeenCalledWith(1, 1);
    });

    it('should handle disabled state when ids are 0', () => {
      const { result } = renderHook(() => useStepRevisions(0, 0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRevisionsApi.getStepRevisions).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch step revisions');
      mockedRevisionsApi.getStepRevisions.mockRejectedValue(error);

      const { result } = renderHook(() => useStepRevisions(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useIngredientRevisions', () => {
    it('should fetch ingredient revisions successfully', async () => {
      const mockResponse: IngredientRevisionsResponse = {
        ingredientId: 1,
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.UPDATE,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { quantity: '2 cups' },
          },
        ],
      };

      mockedRevisionsApi.getIngredientRevisions.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useIngredientRevisions(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
      expect(mockedRevisionsApi.getIngredientRevisions).toHaveBeenCalledWith(
        1,
        1
      );
    });

    it('should handle disabled state when ids are 0', () => {
      const { result } = renderHook(() => useIngredientRevisions(0, 0), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockedRevisionsApi.getIngredientRevisions).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch ingredient revisions');
      mockedRevisionsApi.getIngredientRevisions.mockRejectedValue(error);

      const { result } = renderHook(() => useIngredientRevisions(1, 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useAllRecipeRevisions', () => {
    it('should fetch all recipe revisions successfully', async () => {
      const mockRevisions: RecipeRevisionsResponse = {
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { title: 'New Recipe' },
          },
        ],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(() => useAllRecipeRevisions(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.recipeRevisions.isSuccess).toBe(true);
      });

      expect(result.current.recipeRevisions.data).toEqual(mockRevisions);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() => useAllRecipeRevisions(1, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.recipeRevisions.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch all revisions');
      mockedRevisionsApi.getRecipeRevisions.mockRejectedValue(error);

      const { result } = renderHook(() => useAllRecipeRevisions(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useLatestRevision', () => {
    it('should get latest recipe revision', async () => {
      const mockRevisions: RecipeRevisionsResponse = {
        revisions: [
          {
            revisionId: 2,
            revisionType: RevisionType.UPDATE,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T01:00:00Z',
            createdBy: 1,
            changes: { title: 'Updated Recipe' },
          },
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { title: 'New Recipe' },
          },
        ],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(() => useLatestRevision(1, 'recipe'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.latestRevision).not.toBeNull();
      });

      expect(result.current.latestRevision).toEqual(
        mockRevisions.revisions![0]
      );
      expect(result.current.lastModifiedAt).toBe('2024-01-01T01:00:00Z');
      expect(result.current.lastModifiedBy).toBe(1);
    });

    it('should get latest step revision', async () => {
      const mockRevisions: StepRevisionsResponse = {
        stepId: 1,
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.STEP,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { instruction: 'Mix well' },
          },
        ],
      };

      mockedRevisionsApi.getStepRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(() => useLatestRevision(1, 'step', 1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.latestRevision).not.toBeNull();
      });

      expect(result.current.latestRevision).toEqual(
        mockRevisions.revisions![0]
      );
    });

    it('should handle no revisions', async () => {
      const mockRevisions: RecipeRevisionsResponse = {
        revisions: [],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(() => useLatestRevision(1, 'recipe'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.latestRevision).toBeNull();
      });

      expect(result.current.latestRevision).toBeNull();
      expect(result.current.lastModifiedAt).toBeNull();
      expect(result.current.lastModifiedBy).toBeNull();
    });
  });

  describe('useRevisionComparison', () => {
    it('should compare recipe revisions', async () => {
      const mockRevisions: RecipeRevisionsResponse = {
        revisions: [
          {
            revisionId: 2,
            revisionType: RevisionType.UPDATE,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T01:00:00Z',
            createdBy: 1,
            changes: { title: 'Updated Recipe' },
          },
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { title: 'New Recipe' },
          },
        ],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(
        () => useRevisionComparison(1, 'recipe', undefined, 1, 2),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.hasValidComparison).toBe(true);
      });

      expect(result.current.fromRevision).toEqual(mockRevisions.revisions![1]);
      expect(result.current.toRevision).toEqual(mockRevisions.revisions![0]);
      expect(result.current.hasValidComparison).toBe(true);
      expect(result.current.changes).toEqual({ title: 'Updated Recipe' });
    });

    it('should handle invalid revision comparison', async () => {
      const mockRevisions: RecipeRevisionsResponse = {
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { title: 'New Recipe' },
          },
        ],
      };

      mockedRevisionsApi.getRecipeRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(
        () => useRevisionComparison(1, 'recipe', undefined, 1, 999),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.fromRevision).toBeDefined();
      });

      expect(result.current.fromRevision).toEqual(mockRevisions.revisions![0]);
      expect(result.current.toRevision).toBeUndefined();
      expect(result.current.hasValidComparison).toBe(false);
    });

    it('should handle step revision comparison', async () => {
      const mockRevisions: StepRevisionsResponse = {
        stepId: 1,
        revisions: [
          {
            revisionId: 1,
            revisionType: RevisionType.ADD,
            category: RevisionCategory.INGREDIENT,
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 1,
            changes: { instruction: 'Mix ingredients' },
          },
        ],
      };

      mockedRevisionsApi.getStepRevisions.mockResolvedValue(mockRevisions);

      const { result } = renderHook(
        () => useRevisionComparison(1, 'step', 1, 1, 1),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.fromRevision).toBeDefined();
      });

      expect(result.current.fromRevision).toEqual(mockRevisions.revisions![0]);
      expect(result.current.toRevision).toEqual(mockRevisions.revisions![0]);
    });
  });
});
