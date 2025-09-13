import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RecipeDto,
  CreateRecipeRequest,
  CreateRecipeIngredientRequest,
  CreateRecipeStepRequest,
  DifficultyLevel,
} from '@/types/recipe-management';

// Types for recipe collections and filtering
export interface RecipeCollection {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeFilters {
  difficulty?: DifficultyLevel;
  maxCookTime?: number;
  maxPrepTime?: number;
  tags?: string[];
  searchQuery?: string;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'title'
  | 'cookTime'
  | 'difficulty';
export type ViewPreference = 'grid' | 'list';

interface RecipeStoreState {
  // Recently viewed recipes
  recentlyViewedRecipes: RecipeDto[];
  maxRecentlyViewed: number;

  // Draft recipe management
  draftRecipe: Partial<CreateRecipeRequest> | null;
  draftRecipeId: string | null;
  draftLastModified: Date | null;
  isDraftSaving: boolean;

  // Favorites and collections (ready for future expansion)
  favoriteRecipeIds: string[];
  collections: RecipeCollection[];

  // UI preferences
  activeFilters: RecipeFilters;
  sortPreference: SortOption;
  viewPreference: ViewPreference;

  // Sync state
  isLoading: boolean;
  isSync: boolean;
  lastSyncedAt: Date | null;

  // Actions - Recently viewed
  addRecentlyViewed: (recipe: RecipeDto) => void;
  clearRecentlyViewed: () => void;
  removeFromRecentlyViewed: (recipeId: number) => void;

  // Actions - Draft management
  setDraftRecipe: (draft: Partial<CreateRecipeRequest>) => void;
  updateDraftRecipe: (updates: Partial<CreateRecipeRequest>) => void;
  updateDraftIngredient: (
    index: number,
    ingredient: Partial<CreateRecipeIngredientRequest>
  ) => void;
  addDraftIngredient: (ingredient: CreateRecipeIngredientRequest) => void;
  removeDraftIngredient: (index: number) => void;
  updateDraftStep: (
    index: number,
    step: Partial<CreateRecipeStepRequest>
  ) => void;
  addDraftStep: (step: CreateRecipeStepRequest) => void;
  removeDraftStep: (index: number) => void;
  clearDraftRecipe: () => void;
  setDraftSaving: (saving: boolean) => void;

  // Actions - Favorites
  toggleFavorite: (recipeId: string) => void;
  setFavorites: (recipeIds: string[]) => void;
  isFavorite: (recipeId: string) => boolean;

  // Actions - Collections
  createCollection: (name: string, description?: string) => RecipeCollection;
  updateCollection: (id: string, updates: Partial<RecipeCollection>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, recipeId: string) => void;
  removeFromCollection: (collectionId: string, recipeId: string) => void;

  // Actions - Filters and preferences
  setActiveFilters: (filters: RecipeFilters) => void;
  clearFilters: () => void;
  setSortPreference: (sort: SortOption) => void;
  setViewPreference: (view: ViewPreference) => void;

  // Actions - Sync management
  setLoading: (loading: boolean) => void;
  markSynced: () => void;
  markOutOfSync: () => void;

  // Utility methods
  getRecentRecipeIds: () => number[];
  getCollectionRecipes: (collectionId: string) => string[];
  hasUnsavedDraft: () => boolean;
  generateDraftId: () => string;
}

export const useRecipeStore = create<RecipeStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
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

      // Actions - Recently viewed
      addRecentlyViewed: (recipe: RecipeDto) => {
        const current = get().recentlyViewedRecipes;
        const filtered = current.filter(r => r.recipeId !== recipe.recipeId);
        const updated = [recipe, ...filtered].slice(0, get().maxRecentlyViewed);
        set({ recentlyViewedRecipes: updated });
      },

      clearRecentlyViewed: () => {
        set({ recentlyViewedRecipes: [] });
      },

      removeFromRecentlyViewed: (recipeId: number) => {
        const current = get().recentlyViewedRecipes;
        set({
          recentlyViewedRecipes: current.filter(r => r.recipeId !== recipeId),
        });
      },

      // Actions - Draft management
      setDraftRecipe: (draft: Partial<CreateRecipeRequest>) => {
        const draftId = get().generateDraftId();
        set({
          draftRecipe: draft,
          draftRecipeId: draftId,
          draftLastModified: new Date(),
        });
      },

      updateDraftRecipe: (updates: Partial<CreateRecipeRequest>) => {
        const current = get().draftRecipe;
        set({
          draftRecipe: { ...current, ...updates },
          draftLastModified: new Date(),
        });
      },

      updateDraftIngredient: (
        index: number,
        ingredient: Partial<CreateRecipeIngredientRequest>
      ) => {
        const current = get().draftRecipe;
        if (!current?.ingredients) return;

        const updatedIngredients = [...current.ingredients];
        // eslint-disable-next-line security/detect-object-injection
        const existingIngredient = updatedIngredients[index];
        if (existingIngredient) {
          // eslint-disable-next-line security/detect-object-injection
          updatedIngredients[index] = {
            ...existingIngredient,
            ...ingredient,
          };
        }

        set({
          draftRecipe: { ...current, ingredients: updatedIngredients },
          draftLastModified: new Date(),
        });
      },

      addDraftIngredient: (ingredient: CreateRecipeIngredientRequest) => {
        const current = get().draftRecipe;
        const ingredients = current?.ingredients ?? [];

        set({
          draftRecipe: {
            ...current,
            ingredients: [...ingredients, ingredient],
          },
          draftLastModified: new Date(),
        });
      },

      removeDraftIngredient: (index: number) => {
        const current = get().draftRecipe;
        if (!current?.ingredients) return;

        const updatedIngredients = current.ingredients.filter(
          (_, i) => i !== index
        );

        set({
          draftRecipe: { ...current, ingredients: updatedIngredients },
          draftLastModified: new Date(),
        });
      },

      updateDraftStep: (
        index: number,
        step: Partial<CreateRecipeStepRequest>
      ) => {
        const current = get().draftRecipe;
        if (!current?.steps) return;

        const updatedSteps = [...current.steps];
        // eslint-disable-next-line security/detect-object-injection
        const existingStep = updatedSteps[index];
        if (existingStep) {
          // eslint-disable-next-line security/detect-object-injection
          updatedSteps[index] = { ...existingStep, ...step };
        }

        set({
          draftRecipe: { ...current, steps: updatedSteps },
          draftLastModified: new Date(),
        });
      },

      addDraftStep: (step: CreateRecipeStepRequest) => {
        const current = get().draftRecipe;
        const steps = current?.steps ?? [];

        set({
          draftRecipe: {
            ...current,
            steps: [...steps, step],
          },
          draftLastModified: new Date(),
        });
      },

      removeDraftStep: (index: number) => {
        const current = get().draftRecipe;
        if (!current?.steps) return;

        const updatedSteps = current.steps.filter((_, i) => i !== index);
        // Renumber remaining steps
        const renumberedSteps = updatedSteps.map((step, i) => ({
          ...step,
          stepNumber: i + 1,
        }));

        set({
          draftRecipe: { ...current, steps: renumberedSteps },
          draftLastModified: new Date(),
        });
      },

      clearDraftRecipe: () => {
        set({
          draftRecipe: null,
          draftRecipeId: null,
          draftLastModified: null,
          isDraftSaving: false,
        });
      },

      setDraftSaving: (saving: boolean) => {
        set({ isDraftSaving: saving });
      },

      // Actions - Favorites
      toggleFavorite: (recipeId: string) => {
        const current = get().favoriteRecipeIds;
        const isFav = current.includes(recipeId);

        set({
          favoriteRecipeIds: isFav
            ? current.filter(id => id !== recipeId)
            : [...current, recipeId],
          isSync: false,
        });
      },

      setFavorites: (recipeIds: string[]) => {
        set({ favoriteRecipeIds: recipeIds, isSync: true });
      },

      isFavorite: (recipeId: string) => {
        return get().favoriteRecipeIds.includes(recipeId);
      },

      // Actions - Collections
      createCollection: (name: string, description?: string) => {
        const collection: RecipeCollection = {
          id: get().generateDraftId(),
          name,
          description,
          recipeIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set({
          collections: [...get().collections, collection],
          isSync: false,
        });

        return collection;
      },

      updateCollection: (id: string, updates: Partial<RecipeCollection>) => {
        const current = get().collections;
        const collections = current.map(col =>
          col.id === id ? { ...col, ...updates, updatedAt: new Date() } : col
        );

        set({ collections, isSync: false });
      },

      deleteCollection: (id: string) => {
        const current = get().collections;
        set({
          collections: current.filter(col => col.id !== id),
          isSync: false,
        });
      },

      addToCollection: (collectionId: string, recipeId: string) => {
        const current = get().collections;
        const collections = current.map(col =>
          col.id === collectionId
            ? {
                ...col,
                recipeIds: [...new Set([...col.recipeIds, recipeId])],
                updatedAt: new Date(),
              }
            : col
        );

        set({ collections, isSync: false });
      },

      removeFromCollection: (collectionId: string, recipeId: string) => {
        const current = get().collections;
        const collections = current.map(col =>
          col.id === collectionId
            ? {
                ...col,
                recipeIds: col.recipeIds.filter(id => id !== recipeId),
                updatedAt: new Date(),
              }
            : col
        );

        set({ collections, isSync: false });
      },

      // Actions - Filters and preferences
      setActiveFilters: (filters: RecipeFilters) => {
        set({ activeFilters: filters });
      },

      clearFilters: () => {
        set({ activeFilters: {} });
      },

      setSortPreference: (sort: SortOption) => {
        set({ sortPreference: sort });
      },

      setViewPreference: (view: ViewPreference) => {
        set({ viewPreference: view });
      },

      // Actions - Sync management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      markSynced: () => {
        set({ isSync: true, lastSyncedAt: new Date() });
      },

      markOutOfSync: () => {
        set({ isSync: false });
      },

      // Utility methods
      getRecentRecipeIds: () => {
        return get().recentlyViewedRecipes.map(r => r.recipeId);
      },

      getCollectionRecipes: (collectionId: string) => {
        const collection = get().collections.find(
          col => col.id === collectionId
        );
        return collection?.recipeIds ?? [];
      },

      hasUnsavedDraft: () => {
        const { draftRecipe, draftLastModified } = get();
        return !!draftRecipe && !!draftLastModified;
      },

      generateDraftId: () => {
        return `draft_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      },
    }),
    {
      name: 'recipe-storage',
      partialize: state => ({
        recentlyViewedRecipes: state.recentlyViewedRecipes,
        draftRecipe: state.draftRecipe,
        draftRecipeId: state.draftRecipeId,
        draftLastModified: state.draftLastModified,
        favoriteRecipeIds: state.favoriteRecipeIds,
        collections: state.collections,
        sortPreference: state.sortPreference,
        viewPreference: state.viewPreference,
        lastSyncedAt: state.lastSyncedAt,
      }),
    }
  )
);
