import { revisionsApi } from '@/lib/api/recipe-management/revisions';
import { recipeManagementClient } from '@/lib/api/recipe-management/client';
import type {
  RecipeRevisionsResponse,
  StepRevisionsResponse,
  IngredientRevisionsResponse,
  RevisionDto,
} from '@/types/recipe-management';
import { RevisionType, RevisionCategory } from '@/types/recipe-management';

// Mock the client
jest.mock('@/lib/api/recipe-management/client', () => ({
  recipeManagementClient: {
    get: jest.fn(),
  },
  handleRecipeManagementApiError: jest.fn(error => {
    throw error;
  }),
}));

const mockedClient = recipeManagementClient as jest.Mocked<
  typeof recipeManagementClient
>;

describe('Revisions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRevision: RevisionDto = {
    revisionId: 2,
    revisionType: RevisionType.UPDATE,
    category: RevisionCategory.STEP,
    changes: {
      instruction: {
        from: 'Mix ingredients',
        to: 'Mix ingredients thoroughly',
      },
    },
    createdBy: 456,
    createdAt: '2023-01-02T10:00:00Z',
  };

  describe('getRecipeRevisions', () => {
    it('should get recipe revisions', async () => {
      const mockResponse: RecipeRevisionsResponse = {
        recipeId: 1,
        revisions: [mockRevision],
      };

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await revisionsApi.getRecipeRevisions(1);

      expect(mockedClient.get).toHaveBeenCalledWith('/recipes/1/revisions');
      expect(result).toEqual(mockResponse);
      expect(result.revisions).toHaveLength(1);
    });

    it('should handle empty revisions list', async () => {
      const emptyResponse: RecipeRevisionsResponse = {
        recipeId: 1,
        revisions: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await revisionsApi.getRecipeRevisions(1);

      expect(result).toEqual(emptyResponse);
      expect(result.revisions).toHaveLength(0);
    });

    it('should handle multiple revisions', async () => {
      const multipleRevisions: RecipeRevisionsResponse = {
        recipeId: 1,
        revisions: [
          mockRevision,
          {
            ...mockRevision,
            revisionId: 3,
            revisionType: RevisionType.DELETE,
            category: RevisionCategory.INGREDIENT,
            createdBy: 789,
            createdAt: '2023-01-03T10:00:00Z',
          },
        ],
      };

      mockedClient.get.mockResolvedValue({ data: multipleRevisions });

      const result = await revisionsApi.getRecipeRevisions(1);

      expect(result.revisions).toHaveLength(2);
      expect(result.revisions![0].revisionType).toBe(RevisionType.UPDATE);
      expect(result.revisions![1].revisionType).toBe(RevisionType.DELETE);
    });

    it('should handle recipe not found error', async () => {
      const error = new Error('Recipe not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(revisionsApi.getRecipeRevisions(999)).rejects.toThrow(
        'Recipe not found'
      );
    });
  });

  describe('getStepRevisions', () => {
    it('should get step revisions', async () => {
      const mockResponse: StepRevisionsResponse = {
        stepId: 1,
        revisions: [mockRevision],
      };

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await revisionsApi.getStepRevisions(1, 1);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/steps/1/revisions'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty step revisions', async () => {
      const emptyResponse: StepRevisionsResponse = {
        stepId: 1,
        revisions: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await revisionsApi.getStepRevisions(1, 1);

      expect(result.revisions).toHaveLength(0);
    });

    it('should handle step not found error', async () => {
      const error = new Error('Step not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(revisionsApi.getStepRevisions(1, 999)).rejects.toThrow(
        'Step not found'
      );
    });
  });

  describe('getIngredientRevisions', () => {
    it('should get ingredient revisions', async () => {
      const ingredientRevision: RevisionDto = {
        revisionId: 3,
        revisionType: RevisionType.UPDATE,
        category: RevisionCategory.INGREDIENT,
        changes: {
          amount: {
            from: 1,
            to: 1.5,
          },
          unit: {
            from: 'cup',
            to: 'cups',
          },
        },
        createdBy: 789,
        createdAt: '2023-01-04T10:00:00Z',
      };

      const mockResponse: IngredientRevisionsResponse = {
        ingredientId: 1,
        revisions: [ingredientRevision],
      };

      mockedClient.get.mockResolvedValue({ data: mockResponse });

      const result = await revisionsApi.getIngredientRevisions(1, 1);

      expect(mockedClient.get).toHaveBeenCalledWith(
        '/recipes/1/ingredients/1/revisions'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty ingredient revisions', async () => {
      const emptyResponse: IngredientRevisionsResponse = {
        ingredientId: 1,
        revisions: [],
      };

      mockedClient.get.mockResolvedValue({ data: emptyResponse });

      const result = await revisionsApi.getIngredientRevisions(1, 1);

      expect(result.revisions).toHaveLength(0);
    });

    it('should handle ingredient not found error', async () => {
      const error = new Error('Ingredient not found');
      mockedClient.get.mockRejectedValue(error);

      await expect(revisionsApi.getIngredientRevisions(1, 999)).rejects.toThrow(
        'Ingredient not found'
      );
    });
  });
});
