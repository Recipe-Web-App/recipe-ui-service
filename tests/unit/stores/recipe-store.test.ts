import { useRecipeStore } from '@/stores/recipe-store';
import { renderHook, act } from '@testing-library/react';
import type {
  RecipeDto,
  CreateRecipeRequest,
  CreateRecipeIngredientRequest,
  CreateRecipeStepRequest,
} from '@/types/recipe-management';
import { DifficultyLevel } from '@/types/recipe-management';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Recipe Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state completely
    useRecipeStore.setState({
      recentlyViewedRecipes: [],
      maxRecentlyViewed: 20,
      draftRecipe: null,
      draftRecipeId: null,
      draftLastModified: null,
      isDraftSaving: false,
      favoriteRecipeIds: [],
      collections: [],
      activeFilters: {},
      sortPreference: 'newest',
      viewPreference: 'grid',
      isLoading: false,
      isSync: true,
      lastSyncedAt: null,
    });
  });

  const mockRecipe: RecipeDto = {
    recipeId: 1,
    userId: 'user123',
    title: 'Test Recipe',
    description: 'A test recipe',
    servings: 4,
    preparationTime: 15,
    cookingTime: 30,
    difficulty: DifficultyLevel.MEDIUM,
    createdAt: '2023-01-01T00:00:00Z',
    ingredients: [],
    steps: [],
    tags: [],
  };

  const mockRecipe2: RecipeDto = {
    ...mockRecipe,
    recipeId: 2,
    title: 'Another Recipe',
  };

  describe('Recently Viewed Recipes', () => {
    it('should add a recipe to recently viewed', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
      });

      expect(result.current.recentlyViewedRecipes).toHaveLength(1);
      expect(result.current.recentlyViewedRecipes[0]).toEqual(mockRecipe);
    });

    it('should not duplicate recipes in recently viewed', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
        result.current.addRecentlyViewed(mockRecipe);
      });

      expect(result.current.recentlyViewedRecipes).toHaveLength(1);
    });

    it('should move recipe to top when viewed again', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
        result.current.addRecentlyViewed(mockRecipe2);
        result.current.addRecentlyViewed(mockRecipe);
      });

      expect(result.current.recentlyViewedRecipes[0].recipeId).toBe(1);
      expect(result.current.recentlyViewedRecipes[1].recipeId).toBe(2);
    });

    it('should limit recently viewed to max count', () => {
      const { result } = renderHook(() => useRecipeStore());

      // Create 25 mock recipes
      const recipes = Array.from({ length: 25 }, (_, i) => ({
        ...mockRecipe,
        recipeId: i + 1,
        title: `Recipe ${i + 1}`,
      }));

      act(() => {
        recipes.forEach(recipe => {
          result.current.addRecentlyViewed(recipe);
        });
      });

      expect(result.current.recentlyViewedRecipes).toHaveLength(20);
      expect(result.current.recentlyViewedRecipes[0].recipeId).toBe(25);
    });

    it('should clear recently viewed recipes', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
        result.current.clearRecentlyViewed();
      });

      expect(result.current.recentlyViewedRecipes).toHaveLength(0);
    });

    it('should remove specific recipe from recently viewed', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
        result.current.addRecentlyViewed(mockRecipe2);
        result.current.removeFromRecentlyViewed(1);
      });

      expect(result.current.recentlyViewedRecipes).toHaveLength(1);
      expect(result.current.recentlyViewedRecipes[0].recipeId).toBe(2);
    });

    it('should get recent recipe IDs', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.addRecentlyViewed(mockRecipe);
        result.current.addRecentlyViewed(mockRecipe2);
      });

      const ids = result.current.getRecentRecipeIds();
      expect(ids).toEqual([2, 1]);
    });
  });

  describe('Draft Recipe Management', () => {
    const mockDraft: Partial<CreateRecipeRequest> = {
      title: 'Draft Recipe',
      description: 'A draft recipe',
      servings: 2,
      ingredients: [
        { ingredientName: 'Ingredient 1', quantity: 1, unit: 'cup' },
      ],
      steps: [{ stepNumber: 1, instruction: 'Step 1' }],
    };

    it('should set a draft recipe', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
      });

      expect(result.current.draftRecipe).toEqual(mockDraft);
      expect(result.current.draftRecipeId).toBeTruthy();
      expect(result.current.draftLastModified).toBeInstanceOf(Date);
    });

    it('should update draft recipe', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.updateDraftRecipe({ title: 'Updated Title' });
      });

      expect(result.current.draftRecipe?.title).toBe('Updated Title');
      expect(result.current.draftRecipe?.description).toBe('A draft recipe');
    });

    it('should add ingredient to draft', () => {
      const { result } = renderHook(() => useRecipeStore());
      const newIngredient: CreateRecipeIngredientRequest = {
        ingredientName: 'New Ingredient',
        quantity: 2,
        unit: 'tbsp',
      };

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.addDraftIngredient(newIngredient);
      });

      expect(result.current.draftRecipe?.ingredients).toHaveLength(2);
      expect(result.current.draftRecipe?.ingredients?.[1]).toEqual(
        newIngredient
      );
    });

    it('should update draft ingredient', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.updateDraftIngredient(0, { quantity: 3 });
      });

      expect(result.current.draftRecipe?.ingredients?.[0].quantity).toBe(3);
    });

    it('should remove draft ingredient', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.removeDraftIngredient(0);
      });

      expect(result.current.draftRecipe?.ingredients).toHaveLength(0);
    });

    it('should add step to draft', () => {
      const { result } = renderHook(() => useRecipeStore());
      const newStep: CreateRecipeStepRequest = {
        stepNumber: 2,
        instruction: 'Step 2',
      };

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.addDraftStep(newStep);
      });

      expect(result.current.draftRecipe?.steps).toHaveLength(2);
      expect(result.current.draftRecipe?.steps?.[1]).toEqual(newStep);
    });

    it('should update draft step', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.updateDraftStep(0, { instruction: 'Updated Step' });
      });

      expect(result.current.draftRecipe?.steps?.[0].instruction).toBe(
        'Updated Step'
      );
    });

    it('should remove and renumber draft steps', () => {
      const { result } = renderHook(() => useRecipeStore());
      const draft: Partial<CreateRecipeRequest> = {
        ...mockDraft,
        steps: [
          { stepNumber: 1, instruction: 'Step 1' },
          { stepNumber: 2, instruction: 'Step 2' },
          { stepNumber: 3, instruction: 'Step 3' },
        ],
      };

      act(() => {
        result.current.setDraftRecipe(draft);
        result.current.removeDraftStep(1);
      });

      expect(result.current.draftRecipe?.steps).toHaveLength(2);
      expect(result.current.draftRecipe?.steps?.[0].stepNumber).toBe(1);
      expect(result.current.draftRecipe?.steps?.[1].stepNumber).toBe(2);
      expect(result.current.draftRecipe?.steps?.[1].instruction).toBe('Step 3');
    });

    it('should clear draft recipe', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftRecipe(mockDraft);
        result.current.clearDraftRecipe();
      });

      expect(result.current.draftRecipe).toBeNull();
      expect(result.current.draftRecipeId).toBeNull();
      expect(result.current.draftLastModified).toBeNull();
      expect(result.current.isDraftSaving).toBe(false);
    });

    it('should set draft saving state', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setDraftSaving(true);
      });

      expect(result.current.isDraftSaving).toBe(true);
    });

    it('should detect unsaved draft', () => {
      const { result } = renderHook(() => useRecipeStore());

      expect(result.current.hasUnsavedDraft()).toBe(false);

      act(() => {
        result.current.setDraftRecipe(mockDraft);
      });

      expect(result.current.hasUnsavedDraft()).toBe(true);
    });
  });

  describe('Favorites Management', () => {
    it('should toggle favorite recipe', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.toggleFavorite('recipe1');
      });

      expect(result.current.favoriteRecipeIds).toContain('recipe1');
      expect(result.current.isFavorite('recipe1')).toBe(true);

      act(() => {
        result.current.toggleFavorite('recipe1');
      });

      expect(result.current.favoriteRecipeIds).not.toContain('recipe1');
      expect(result.current.isFavorite('recipe1')).toBe(false);
    });

    it('should set favorites list', () => {
      const { result } = renderHook(() => useRecipeStore());
      const favorites = ['recipe1', 'recipe2', 'recipe3'];

      act(() => {
        result.current.setFavorites(favorites);
      });

      expect(result.current.favoriteRecipeIds).toEqual(favorites);
      expect(result.current.isSync).toBe(true);
    });
  });

  describe('Collections Management', () => {
    it('should create a collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.createCollection('My Collection', 'Description');
      });

      expect(result.current.collections).toHaveLength(1);
      expect(result.current.collections[0].name).toBe('My Collection');
      expect(result.current.collections[0].description).toBe('Description');
      expect(result.current.collections[0].recipeIds).toEqual([]);
    });

    it('should update a collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.updateCollection(collection.id, {
          name: 'Updated Collection',
        });
      });

      expect(result.current.collections[0].name).toBe('Updated Collection');
    });

    it('should delete a collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.deleteCollection(collection.id);
      });

      expect(result.current.collections).toHaveLength(0);
    });

    it('should add recipe to collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.addToCollection(collection.id, 'recipe1');
        result.current.addToCollection(collection.id, 'recipe2');
      });

      expect(result.current.collections[0].recipeIds).toEqual([
        'recipe1',
        'recipe2',
      ]);
    });

    it('should not duplicate recipes in collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.addToCollection(collection.id, 'recipe1');
        result.current.addToCollection(collection.id, 'recipe1');
      });

      expect(result.current.collections[0].recipeIds).toEqual(['recipe1']);
    });

    it('should remove recipe from collection', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.addToCollection(collection.id, 'recipe1');
        result.current.addToCollection(collection.id, 'recipe2');
        result.current.removeFromCollection(collection.id, 'recipe1');
      });

      expect(result.current.collections[0].recipeIds).toEqual(['recipe2']);
    });

    it('should get collection recipes', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        const collection = result.current.createCollection('My Collection');
        result.current.addToCollection(collection.id, 'recipe1');
        result.current.addToCollection(collection.id, 'recipe2');
      });

      const recipes = result.current.getCollectionRecipes(
        result.current.collections[0].id
      );
      expect(recipes).toEqual(['recipe1', 'recipe2']);
    });
  });

  describe('Filters and Preferences', () => {
    it('should set active filters', () => {
      const { result } = renderHook(() => useRecipeStore());
      const filters = {
        difficulty: DifficultyLevel.EASY,
        maxCookTime: 30,
        tags: ['vegetarian'],
      };

      act(() => {
        result.current.setActiveFilters(filters);
      });

      expect(result.current.activeFilters).toEqual(filters);
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setActiveFilters({ difficulty: DifficultyLevel.EASY });
        result.current.clearFilters();
      });

      expect(result.current.activeFilters).toEqual({});
    });

    it('should set sort preference', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setSortPreference('title');
      });

      expect(result.current.sortPreference).toBe('title');
    });

    it('should set view preference', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setViewPreference('list');
      });

      expect(result.current.viewPreference).toBe('list');
    });
  });

  describe('Sync Management', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should mark as synced', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.markSynced();
      });

      expect(result.current.isSync).toBe(true);
      expect(result.current.lastSyncedAt).toBeInstanceOf(Date);
    });

    it('should mark as out of sync', () => {
      const { result } = renderHook(() => useRecipeStore());

      act(() => {
        result.current.markOutOfSync();
      });

      expect(result.current.isSync).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should generate unique draft IDs', () => {
      const { result } = renderHook(() => useRecipeStore());

      const id1 = result.current.generateDraftId();
      const id2 = result.current.generateDraftId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^draft_\d+_[a-z0-9]+$/);
    });
  });
});
