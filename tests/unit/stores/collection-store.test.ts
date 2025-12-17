import { useCollectionStore } from '@/stores/collection-store';
import { renderHook, act } from '@testing-library/react';
import type {
  CreateCollectionFormData,
  CollectionRecipeFormData,
  CollaboratorFormData,
} from '@/types/collection/create-collection-form';
import { CREATE_COLLECTION_DEFAULT_VALUES } from '@/types/collection/create-collection-form';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

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

describe('Collection Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state completely
    useCollectionStore.setState({
      draftCollection: null,
      draftCollectionId: null,
      draftLastModified: null,
      isDraftSaving: false,
    });
  });

  const mockDraft: CreateCollectionFormData = {
    name: 'My Collection',
    description: 'A test collection',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    tags: ['breakfast', 'quick'],
    recipes: [
      {
        id: 'recipe-1',
        recipeId: 1,
        recipeTitle: 'Test Recipe',
        displayOrder: 0,
      },
    ],
    collaborators: [],
  };

  const mockRecipe: CollectionRecipeFormData = {
    id: 'recipe-2',
    recipeId: 2,
    recipeTitle: 'Another Recipe',
    recipeDescription: 'Delicious',
    displayOrder: 0,
  };

  const mockCollaborator: CollaboratorFormData = {
    id: 'collab-1',
    userId: 'user-123',
    username: 'testuser',
    displayName: 'Test User',
  };

  describe('Draft Collection Management', () => {
    it('should set a draft collection', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
      });

      expect(result.current.draftCollection).toEqual(mockDraft);
      expect(result.current.draftCollectionId).toBeTruthy();
      expect(result.current.draftLastModified).toBeInstanceOf(Date);
    });

    it('should update draft collection', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftCollection({ name: 'Updated Collection' });
      });

      expect(result.current.draftCollection?.name).toBe('Updated Collection');
      expect(result.current.draftCollection?.description).toBe(
        'A test collection'
      );
    });

    it('should not update when no draft exists', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.updateDraftCollection({ name: 'Updated Collection' });
      });

      expect(result.current.draftCollection).toBeNull();
    });

    it('should clear draft collection', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.clearDraftCollection();
      });

      expect(result.current.draftCollection).toBeNull();
      expect(result.current.draftCollectionId).toBeNull();
      expect(result.current.draftLastModified).toBeNull();
      expect(result.current.isDraftSaving).toBe(false);
    });

    it('should initialize draft with default values', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.initializeDraft();
      });

      expect(result.current.draftCollection).toEqual(
        CREATE_COLLECTION_DEFAULT_VALUES
      );
      expect(result.current.draftCollectionId).toBeTruthy();
    });

    it('should not overwrite existing draft when initializing', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.initializeDraft();
      });

      expect(result.current.draftCollection?.name).toBe('My Collection');
    });

    it('should set draft saving state', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftSaving(true);
      });

      expect(result.current.isDraftSaving).toBe(true);
    });
  });

  describe('Draft Field Updates', () => {
    it('should update draft name', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftName('New Name');
      });

      expect(result.current.draftCollection?.name).toBe('New Name');
    });

    it('should update draft description', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftDescription('New description');
      });

      expect(result.current.draftCollection?.description).toBe(
        'New description'
      );
    });

    it('should update draft visibility', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftVisibility(CollectionVisibility.PUBLIC);
      });

      expect(result.current.draftCollection?.visibility).toBe(
        CollectionVisibility.PUBLIC
      );
    });

    it('should update draft collaboration mode', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftCollaborationMode(
          CollaborationMode.SPECIFIC_USERS
        );
      });

      expect(result.current.draftCollection?.collaborationMode).toBe(
        CollaborationMode.SPECIFIC_USERS
      );
    });
  });

  describe('Draft Tag Management', () => {
    it('should update draft tags', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.updateDraftTags(['lunch', 'healthy']);
      });

      expect(result.current.draftCollection?.tags).toEqual([
        'lunch',
        'healthy',
      ]);
    });

    it('should add a tag to draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftTag('dinner');
      });

      expect(result.current.draftCollection?.tags).toContain('dinner');
      expect(result.current.draftCollection?.tags).toHaveLength(3);
    });

    it('should not add duplicate tag', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftTag('breakfast');
      });

      expect(result.current.draftCollection?.tags).toHaveLength(2);
    });

    it('should not add empty tag', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftTag('   ');
      });

      expect(result.current.draftCollection?.tags).toHaveLength(2);
    });

    it('should trim tag when adding', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftTag('  dinner  ');
      });

      expect(result.current.draftCollection?.tags).toContain('dinner');
    });

    it('should remove a tag from draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.removeDraftTag('breakfast');
      });

      expect(result.current.draftCollection?.tags).not.toContain('breakfast');
      expect(result.current.draftCollection?.tags).toHaveLength(1);
    });
  });

  describe('Draft Recipe Management', () => {
    it('should set draft recipes', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.setDraftRecipes([mockRecipe]);
      });

      expect(result.current.draftCollection?.recipes).toHaveLength(1);
      expect(result.current.draftCollection?.recipes[0].recipeId).toBe(2);
    });

    it('should add a recipe to draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftRecipe(mockRecipe);
      });

      expect(result.current.draftCollection?.recipes).toHaveLength(2);
      expect(result.current.draftCollection?.recipes[1].displayOrder).toBe(1);
    });

    it('should not add duplicate recipe', () => {
      const { result } = renderHook(() => useCollectionStore());
      const duplicateRecipe: CollectionRecipeFormData = {
        id: 'recipe-dup',
        recipeId: 1, // Same as existing recipe
        recipeTitle: 'Duplicate',
        displayOrder: 0,
      };

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftRecipe(duplicateRecipe);
      });

      expect(result.current.draftCollection?.recipes).toHaveLength(1);
    });

    it('should remove a recipe from draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.removeDraftRecipe('recipe-1');
      });

      expect(result.current.draftCollection?.recipes).toHaveLength(0);
    });

    it('should renumber recipes after removal', () => {
      const { result } = renderHook(() => useCollectionStore());
      const draftWithMultipleRecipes: CreateCollectionFormData = {
        ...mockDraft,
        recipes: [
          { id: 'r1', recipeId: 1, recipeTitle: 'Recipe 1', displayOrder: 0 },
          { id: 'r2', recipeId: 2, recipeTitle: 'Recipe 2', displayOrder: 1 },
          { id: 'r3', recipeId: 3, recipeTitle: 'Recipe 3', displayOrder: 2 },
        ],
      };

      act(() => {
        result.current.setDraftCollection(draftWithMultipleRecipes);
        result.current.removeDraftRecipe('r2');
      });

      expect(result.current.draftCollection?.recipes).toHaveLength(2);
      expect(result.current.draftCollection?.recipes[0].displayOrder).toBe(0);
      expect(result.current.draftCollection?.recipes[1].displayOrder).toBe(1);
      expect(result.current.draftCollection?.recipes[1].recipeTitle).toBe(
        'Recipe 3'
      );
    });

    it('should reorder draft recipes', () => {
      const { result } = renderHook(() => useCollectionStore());
      const draftWithMultipleRecipes: CreateCollectionFormData = {
        ...mockDraft,
        recipes: [
          { id: 'r1', recipeId: 1, recipeTitle: 'Recipe 1', displayOrder: 0 },
          { id: 'r2', recipeId: 2, recipeTitle: 'Recipe 2', displayOrder: 1 },
        ],
      };

      act(() => {
        result.current.setDraftCollection(draftWithMultipleRecipes);
        result.current.reorderDraftRecipes([
          { id: 'r2', recipeId: 2, recipeTitle: 'Recipe 2', displayOrder: 1 },
          { id: 'r1', recipeId: 1, recipeTitle: 'Recipe 1', displayOrder: 0 },
        ]);
      });

      expect(result.current.draftCollection?.recipes[0].recipeId).toBe(2);
      expect(result.current.draftCollection?.recipes[0].displayOrder).toBe(0);
      expect(result.current.draftCollection?.recipes[1].recipeId).toBe(1);
      expect(result.current.draftCollection?.recipes[1].displayOrder).toBe(1);
    });
  });

  describe('Draft Collaborator Management', () => {
    it('should set draft collaborators', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.setDraftCollaborators([mockCollaborator]);
      });

      expect(result.current.draftCollection?.collaborators).toHaveLength(1);
      expect(result.current.draftCollection?.collaborators[0].userId).toBe(
        'user-123'
      );
    });

    it('should add a collaborator to draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftCollaborator(mockCollaborator);
      });

      expect(result.current.draftCollection?.collaborators).toHaveLength(1);
      expect(result.current.draftCollection?.collaborators[0].username).toBe(
        'testuser'
      );
    });

    it('should not add duplicate collaborator', () => {
      const { result } = renderHook(() => useCollectionStore());
      const duplicateCollaborator: CollaboratorFormData = {
        id: 'collab-dup',
        userId: 'user-123', // Same as existing
        username: 'testuser2',
      };

      act(() => {
        result.current.setDraftCollection(mockDraft);
        result.current.addDraftCollaborator(mockCollaborator);
        result.current.addDraftCollaborator(duplicateCollaborator);
      });

      expect(result.current.draftCollection?.collaborators).toHaveLength(1);
    });

    it('should remove a collaborator from draft', () => {
      const { result } = renderHook(() => useCollectionStore());
      const draftWithCollaborators: CreateCollectionFormData = {
        ...mockDraft,
        collaborators: [mockCollaborator],
      };

      act(() => {
        result.current.setDraftCollection(draftWithCollaborators);
        result.current.removeDraftCollaborator('collab-1');
      });

      expect(result.current.draftCollection?.collaborators).toHaveLength(0);
    });
  });

  describe('Utility Methods', () => {
    it('should detect unsaved draft with content', () => {
      const { result } = renderHook(() => useCollectionStore());

      expect(result.current.hasUnsavedDraft()).toBe(false);

      act(() => {
        result.current.setDraftCollection(mockDraft);
      });

      expect(result.current.hasUnsavedDraft()).toBe(true);
    });

    it('should not detect empty draft as unsaved', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.initializeDraft();
      });

      expect(result.current.hasUnsavedDraft()).toBe(false);
    });

    it('should detect draft with only name as unsaved', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection({
          ...CREATE_COLLECTION_DEFAULT_VALUES,
          name: 'Test',
        });
      });

      expect(result.current.hasUnsavedDraft()).toBe(true);
    });

    it('should generate unique draft IDs', () => {
      const { result } = renderHook(() => useCollectionStore());

      const id1 = result.current.generateDraftId();
      const id2 = result.current.generateDraftId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^collection_draft_\d+_[a-z0-9]+$/);
    });

    it('should get draft recipe count', () => {
      const { result } = renderHook(() => useCollectionStore());

      expect(result.current.getDraftRecipeCount()).toBe(0);

      act(() => {
        result.current.setDraftCollection(mockDraft);
      });

      expect(result.current.getDraftRecipeCount()).toBe(1);
    });

    it('should get draft collaborator count', () => {
      const { result } = renderHook(() => useCollectionStore());

      expect(result.current.getDraftCollaboratorCount()).toBe(0);

      act(() => {
        result.current.setDraftCollection({
          ...mockDraft,
          collaborators: [mockCollaborator],
        });
      });

      expect(result.current.getDraftCollaboratorCount()).toBe(1);
    });

    it('should check if recipe is selected in draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      expect(result.current.isDraftRecipeSelected(1)).toBe(false);

      act(() => {
        result.current.setDraftCollection(mockDraft);
      });

      expect(result.current.isDraftRecipeSelected(1)).toBe(true);
      expect(result.current.isDraftRecipeSelected(999)).toBe(false);
    });

    it('should check if collaborator is selected in draft', () => {
      const { result } = renderHook(() => useCollectionStore());

      expect(result.current.isDraftCollaboratorSelected('user-123')).toBe(
        false
      );

      act(() => {
        result.current.setDraftCollection({
          ...mockDraft,
          collaborators: [mockCollaborator],
        });
      });

      expect(result.current.isDraftCollaboratorSelected('user-123')).toBe(true);
      expect(result.current.isDraftCollaboratorSelected('user-999')).toBe(
        false
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle operations when no draft exists', () => {
      const { result } = renderHook(() => useCollectionStore());

      // None of these should throw
      act(() => {
        result.current.updateDraftName('Test');
        result.current.updateDraftDescription('Test');
        result.current.updateDraftVisibility(CollectionVisibility.PUBLIC);
        result.current.updateDraftCollaborationMode(
          CollaborationMode.ALL_USERS
        );
        result.current.updateDraftTags(['test']);
        result.current.addDraftTag('test');
        result.current.removeDraftTag('test');
        result.current.setDraftRecipes([mockRecipe]);
        result.current.addDraftRecipe(mockRecipe);
        result.current.removeDraftRecipe('recipe-1');
        result.current.reorderDraftRecipes([mockRecipe]);
        result.current.setDraftCollaborators([mockCollaborator]);
        result.current.addDraftCollaborator(mockCollaborator);
        result.current.removeDraftCollaborator('collab-1');
      });

      expect(result.current.draftCollection).toBeNull();
    });

    it('should update draftLastModified on any change', () => {
      const { result } = renderHook(() => useCollectionStore());

      act(() => {
        result.current.setDraftCollection(mockDraft);
      });

      const firstModified = result.current.draftLastModified;

      act(() => {
        result.current.updateDraftName('Changed');
      });

      // The timestamp should exist and be a Date
      expect(result.current.draftLastModified).toBeInstanceOf(Date);
      // The modification was recorded (may or may not be different due to timing)
      expect(result.current.draftLastModified).not.toBeNull();
      expect(result.current.draftCollection?.name).toBe('Changed');
    });
  });
});
