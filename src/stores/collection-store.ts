import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CreateCollectionFormData,
  CollectionRecipeFormData,
  CollaboratorFormData,
} from '@/types/collection/create-collection-form';
import { CREATE_COLLECTION_DEFAULT_VALUES } from '@/types/collection/create-collection-form';
import type {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

/**
 * State interface for the collection store.
 * Manages draft collection form state with persistence.
 */
interface CollectionStoreState {
  // Draft collection state
  draftCollection: CreateCollectionFormData | null;
  draftCollectionId: string | null;
  draftLastModified: Date | null;
  isDraftSaving: boolean;

  // Actions - Draft management
  setDraftCollection: (draft: CreateCollectionFormData) => void;
  updateDraftCollection: (updates: Partial<CreateCollectionFormData>) => void;
  updateDraftName: (name: string) => void;
  updateDraftDescription: (description: string) => void;
  updateDraftVisibility: (visibility: CollectionVisibility) => void;
  updateDraftCollaborationMode: (mode: CollaborationMode) => void;
  updateDraftTags: (tags: string[]) => void;
  addDraftTag: (tag: string) => void;
  removeDraftTag: (tag: string) => void;

  // Actions - Recipe management
  setDraftRecipes: (recipes: CollectionRecipeFormData[]) => void;
  addDraftRecipe: (recipe: CollectionRecipeFormData) => void;
  removeDraftRecipe: (recipeId: string) => void;
  reorderDraftRecipes: (recipes: CollectionRecipeFormData[]) => void;

  // Actions - Collaborator management
  setDraftCollaborators: (collaborators: CollaboratorFormData[]) => void;
  addDraftCollaborator: (collaborator: CollaboratorFormData) => void;
  removeDraftCollaborator: (collaboratorId: string) => void;

  // Actions - Draft state management
  clearDraftCollection: () => void;
  setDraftSaving: (saving: boolean) => void;
  initializeDraft: () => void;

  // Utility methods
  hasUnsavedDraft: () => boolean;
  generateDraftId: () => string;
  getDraftRecipeCount: () => number;
  getDraftCollaboratorCount: () => number;
  isDraftRecipeSelected: (recipeId: number) => boolean;
  isDraftCollaboratorSelected: (userId: string) => boolean;
}

export const useCollectionStore = create<CollectionStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      draftCollection: null,
      draftCollectionId: null,
      draftLastModified: null,
      isDraftSaving: false,

      // Actions - Draft management
      setDraftCollection: (draft: CreateCollectionFormData) => {
        const draftId = get().generateDraftId();
        set({
          draftCollection: draft,
          draftCollectionId: draftId,
          draftLastModified: new Date(),
        });
      },

      updateDraftCollection: (updates: Partial<CreateCollectionFormData>) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, ...updates },
          draftLastModified: new Date(),
        });
      },

      updateDraftName: (name: string) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, name },
          draftLastModified: new Date(),
        });
      },

      updateDraftDescription: (description: string) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, description },
          draftLastModified: new Date(),
        });
      },

      updateDraftVisibility: (visibility: CollectionVisibility) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, visibility },
          draftLastModified: new Date(),
        });
      },

      updateDraftCollaborationMode: (collaborationMode: CollaborationMode) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, collaborationMode },
          draftLastModified: new Date(),
        });
      },

      updateDraftTags: (tags: string[]) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, tags },
          draftLastModified: new Date(),
        });
      },

      addDraftTag: (tag: string) => {
        const current = get().draftCollection;
        if (!current) return;

        const trimmedTag = tag.trim();
        if (!trimmedTag || current.tags.includes(trimmedTag)) return;

        set({
          draftCollection: { ...current, tags: [...current.tags, trimmedTag] },
          draftLastModified: new Date(),
        });
      },

      removeDraftTag: (tag: string) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: {
            ...current,
            tags: current.tags.filter(t => t !== tag),
          },
          draftLastModified: new Date(),
        });
      },

      // Actions - Recipe management
      setDraftRecipes: (recipes: CollectionRecipeFormData[]) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, recipes },
          draftLastModified: new Date(),
        });
      },

      addDraftRecipe: (recipe: CollectionRecipeFormData) => {
        const current = get().draftCollection;
        if (!current) return;

        // Don't add duplicates
        if (current.recipes.some(r => r.recipeId === recipe.recipeId)) return;

        const newRecipe = {
          ...recipe,
          displayOrder: current.recipes.length,
        };

        set({
          draftCollection: {
            ...current,
            recipes: [...current.recipes, newRecipe],
          },
          draftLastModified: new Date(),
        });
      },

      removeDraftRecipe: (recipeId: string) => {
        const current = get().draftCollection;
        if (!current) return;

        const updatedRecipes = current.recipes
          .filter(r => r.id !== recipeId)
          .map((r, index) => ({ ...r, displayOrder: index }));

        set({
          draftCollection: { ...current, recipes: updatedRecipes },
          draftLastModified: new Date(),
        });
      },

      reorderDraftRecipes: (recipes: CollectionRecipeFormData[]) => {
        const current = get().draftCollection;
        if (!current) return;

        // Update display order based on new positions
        const reorderedRecipes = recipes.map((r, index) => ({
          ...r,
          displayOrder: index,
        }));

        set({
          draftCollection: { ...current, recipes: reorderedRecipes },
          draftLastModified: new Date(),
        });
      },

      // Actions - Collaborator management
      setDraftCollaborators: (collaborators: CollaboratorFormData[]) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: { ...current, collaborators },
          draftLastModified: new Date(),
        });
      },

      addDraftCollaborator: (collaborator: CollaboratorFormData) => {
        const current = get().draftCollection;
        if (!current) return;

        // Don't add duplicates
        if (current.collaborators.some(c => c.userId === collaborator.userId))
          return;

        set({
          draftCollection: {
            ...current,
            collaborators: [...current.collaborators, collaborator],
          },
          draftLastModified: new Date(),
        });
      },

      removeDraftCollaborator: (collaboratorId: string) => {
        const current = get().draftCollection;
        if (!current) return;

        set({
          draftCollection: {
            ...current,
            collaborators: current.collaborators.filter(
              c => c.id !== collaboratorId
            ),
          },
          draftLastModified: new Date(),
        });
      },

      // Actions - Draft state management
      clearDraftCollection: () => {
        set({
          draftCollection: null,
          draftCollectionId: null,
          draftLastModified: null,
          isDraftSaving: false,
        });
      },

      setDraftSaving: (saving: boolean) => {
        set({ isDraftSaving: saving });
      },

      initializeDraft: () => {
        const current = get().draftCollection;
        if (current) return; // Don't overwrite existing draft

        const draftId = get().generateDraftId();
        set({
          draftCollection: { ...CREATE_COLLECTION_DEFAULT_VALUES },
          draftCollectionId: draftId,
          draftLastModified: new Date(),
        });
      },

      // Utility methods
      hasUnsavedDraft: () => {
        const { draftCollection, draftLastModified } = get();
        if (!draftCollection || !draftLastModified) return false;

        // Check if draft has meaningful content beyond defaults
        const hasName = draftCollection.name.trim().length > 0;
        const hasDescription = draftCollection.description.trim().length > 0;
        const hasRecipes = draftCollection.recipes.length > 0;
        const hasTags = draftCollection.tags.length > 0;
        const hasCollaborators = draftCollection.collaborators.length > 0;

        return (
          hasName || hasDescription || hasRecipes || hasTags || hasCollaborators
        );
      },

      generateDraftId: () => {
        return `collection_draft_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      },

      getDraftRecipeCount: () => {
        return get().draftCollection?.recipes.length ?? 0;
      },

      getDraftCollaboratorCount: () => {
        return get().draftCollection?.collaborators.length ?? 0;
      },

      isDraftRecipeSelected: (recipeId: number) => {
        const { draftCollection } = get();
        if (!draftCollection) return false;
        return draftCollection.recipes.some(r => r.recipeId === recipeId);
      },

      isDraftCollaboratorSelected: (userId: string) => {
        const { draftCollection } = get();
        if (!draftCollection) return false;
        return draftCollection.collaborators.some(c => c.userId === userId);
      },
    }),
    {
      name: 'collection-draft-storage',
      partialize: state => ({
        draftCollection: state.draftCollection,
        draftCollectionId: state.draftCollectionId,
        draftLastModified: state.draftLastModified,
      }),
    }
  )
);
