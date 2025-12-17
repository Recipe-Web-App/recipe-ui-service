import {
  collectionNameSchema,
  collectionDescriptionSchema,
  collectionVisibilitySchema,
  collectionCollaborationModeSchema,
  collectionTagSchema,
  collectionTagsSchema,
  collectionRecipeSchema,
  collectionRecipesSchema,
  collaboratorSchema,
  collaboratorsSchema,
  basicInfoSectionSchema,
  recipesSectionSchema,
  collaboratorsSectionSchema,
  createCollectionFormSchema,
  validateSection,
  isSectionComplete,
  validateForm,
  sectionFields,
} from '@/lib/validation/create-collection-schemas';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import {
  CreateCollectionSection,
  CREATE_COLLECTION_LIMITS,
} from '@/types/collection/create-collection-form';
import type { CreateCollectionFormData } from '@/types/collection/create-collection-form';

// Test fixtures
const validRecipe = {
  id: 'recipe-1',
  recipeId: 1,
  recipeTitle: 'Test Recipe',
  recipeDescription: 'A test recipe',
  displayOrder: 0,
};

const validCollaborator = {
  id: 'collab-1',
  userId: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
};

const validFormData: CreateCollectionFormData = {
  name: 'Test Collection',
  description: 'A test collection',
  visibility: CollectionVisibility.PRIVATE,
  collaborationMode: CollaborationMode.OWNER_ONLY,
  tags: ['tag1', 'tag2'],
  recipes: [validRecipe],
  collaborators: [],
};

describe('Create Collection Schemas', () => {
  describe('collectionNameSchema', () => {
    it('should validate a valid name', () => {
      const result = collectionNameSchema.safeParse('My Collection');
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = collectionNameSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject name that is too short', () => {
      const result = collectionNameSchema.safeParse('ab');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 3');
      }
    });

    it('should reject name that is too long', () => {
      const result = collectionNameSchema.safeParse(
        'a'.repeat(CREATE_COLLECTION_LIMITS.NAME_MAX_LENGTH + 1)
      );
      expect(result.success).toBe(false);
    });

    it('should trim whitespace', () => {
      const result = collectionNameSchema.safeParse('  My Collection  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('My Collection');
      }
    });
  });

  describe('collectionDescriptionSchema', () => {
    it('should validate a valid description', () => {
      const result = collectionDescriptionSchema.safeParse(
        'This is a description'
      );
      expect(result.success).toBe(true);
    });

    it('should allow empty description', () => {
      const result = collectionDescriptionSchema.safeParse('');
      expect(result.success).toBe(true);
    });

    it('should allow undefined description', () => {
      const result = collectionDescriptionSchema.safeParse(undefined);
      expect(result.success).toBe(true);
    });

    it('should reject description that is too long', () => {
      const result = collectionDescriptionSchema.safeParse(
        'a'.repeat(CREATE_COLLECTION_LIMITS.DESCRIPTION_MAX_LENGTH + 1)
      );
      expect(result.success).toBe(false);
    });
  });

  describe('collectionVisibilitySchema', () => {
    it('should validate PUBLIC visibility', () => {
      const result = collectionVisibilitySchema.safeParse(
        CollectionVisibility.PUBLIC
      );
      expect(result.success).toBe(true);
    });

    it('should validate PRIVATE visibility', () => {
      const result = collectionVisibilitySchema.safeParse(
        CollectionVisibility.PRIVATE
      );
      expect(result.success).toBe(true);
    });

    it('should validate FRIENDS_ONLY visibility', () => {
      const result = collectionVisibilitySchema.safeParse(
        CollectionVisibility.FRIENDS_ONLY
      );
      expect(result.success).toBe(true);
    });

    it('should reject invalid visibility', () => {
      const result = collectionVisibilitySchema.safeParse('INVALID');
      expect(result.success).toBe(false);
    });
  });

  describe('collectionCollaborationModeSchema', () => {
    it('should validate OWNER_ONLY mode', () => {
      const result = collectionCollaborationModeSchema.safeParse(
        CollaborationMode.OWNER_ONLY
      );
      expect(result.success).toBe(true);
    });

    it('should validate ALL_USERS mode', () => {
      const result = collectionCollaborationModeSchema.safeParse(
        CollaborationMode.ALL_USERS
      );
      expect(result.success).toBe(true);
    });

    it('should validate SPECIFIC_USERS mode', () => {
      const result = collectionCollaborationModeSchema.safeParse(
        CollaborationMode.SPECIFIC_USERS
      );
      expect(result.success).toBe(true);
    });

    it('should reject invalid mode', () => {
      const result = collectionCollaborationModeSchema.safeParse('INVALID');
      expect(result.success).toBe(false);
    });
  });

  describe('collectionTagSchema', () => {
    it('should validate a valid tag', () => {
      const result = collectionTagSchema.safeParse('desserts');
      expect(result.success).toBe(true);
    });

    it('should reject empty tag', () => {
      const result = collectionTagSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject tag that is too long', () => {
      const result = collectionTagSchema.safeParse(
        'a'.repeat(CREATE_COLLECTION_LIMITS.MAX_TAG_LENGTH + 1)
      );
      expect(result.success).toBe(false);
    });
  });

  describe('collectionTagsSchema', () => {
    it('should validate valid tags array', () => {
      const result = collectionTagsSchema.safeParse(['tag1', 'tag2', 'tag3']);
      expect(result.success).toBe(true);
    });

    it('should allow empty tags array', () => {
      const result = collectionTagsSchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('should default to empty array when undefined', () => {
      const result = collectionTagsSchema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it('should reject too many tags', () => {
      const tags = Array.from(
        { length: CREATE_COLLECTION_LIMITS.MAX_TAGS + 1 },
        (_, i) => `tag${i}`
      );
      const result = collectionTagsSchema.safeParse(tags);
      expect(result.success).toBe(false);
    });

    it('should reject duplicate tags (case-insensitive)', () => {
      const result = collectionTagsSchema.safeParse(['Tag1', 'tag1']);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('unique');
      }
    });
  });

  describe('collectionRecipeSchema', () => {
    it('should validate a valid recipe', () => {
      const result = collectionRecipeSchema.safeParse(validRecipe);
      expect(result.success).toBe(true);
    });

    it('should reject missing recipeId', () => {
      const result = collectionRecipeSchema.safeParse({
        ...validRecipe,
        recipeId: undefined,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative recipeId', () => {
      const result = collectionRecipeSchema.safeParse({
        ...validRecipe,
        recipeId: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing recipeTitle', () => {
      const result = collectionRecipeSchema.safeParse({
        ...validRecipe,
        recipeTitle: '',
      });
      expect(result.success).toBe(false);
    });

    it('should allow optional recipeDescription', () => {
      const result = collectionRecipeSchema.safeParse({
        ...validRecipe,
        recipeDescription: undefined,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('collectionRecipesSchema', () => {
    it('should validate valid recipes array', () => {
      const result = collectionRecipesSchema.safeParse([validRecipe]);
      expect(result.success).toBe(true);
    });

    it('should reject empty recipes array', () => {
      const result = collectionRecipesSchema.safeParse([]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message.toLowerCase()).toContain(
          'at least 1'
        );
      }
    });

    it('should reject too many recipes', () => {
      const recipes = Array.from(
        { length: CREATE_COLLECTION_LIMITS.MAX_RECIPES + 1 },
        (_, i) => ({
          ...validRecipe,
          id: `recipe-${i}`,
          recipeId: i + 1,
          displayOrder: i,
        })
      );
      const result = collectionRecipesSchema.safeParse(recipes);
      expect(result.success).toBe(false);
    });

    it('should reject duplicate recipe IDs', () => {
      const recipes = [
        { ...validRecipe, id: 'recipe-1', recipeId: 1 },
        { ...validRecipe, id: 'recipe-2', recipeId: 1 }, // Duplicate recipeId
      ];
      const result = collectionRecipesSchema.safeParse(recipes);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Duplicate');
      }
    });
  });

  describe('collaboratorSchema', () => {
    it('should validate a valid collaborator', () => {
      const result = collaboratorSchema.safeParse(validCollaborator);
      expect(result.success).toBe(true);
    });

    it('should reject missing userId', () => {
      const result = collaboratorSchema.safeParse({
        ...validCollaborator,
        userId: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing username', () => {
      const result = collaboratorSchema.safeParse({
        ...validCollaborator,
        username: '',
      });
      expect(result.success).toBe(false);
    });

    it('should allow optional displayName', () => {
      const result = collaboratorSchema.safeParse({
        ...validCollaborator,
        displayName: undefined,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('collaboratorsSchema', () => {
    it('should validate valid collaborators array', () => {
      const result = collaboratorsSchema.safeParse([validCollaborator]);
      expect(result.success).toBe(true);
    });

    it('should allow empty collaborators array', () => {
      const result = collaboratorsSchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('should default to empty array when undefined', () => {
      const result = collaboratorsSchema.safeParse(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it('should reject too many collaborators', () => {
      const collaborators = Array.from(
        { length: CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS + 1 },
        (_, i) => ({
          ...validCollaborator,
          id: `collab-${i}`,
          userId: `user-${i}`,
        })
      );
      const result = collaboratorsSchema.safeParse(collaborators);
      expect(result.success).toBe(false);
    });

    it('should reject duplicate user IDs', () => {
      const collaborators = [
        { ...validCollaborator, id: 'collab-1', userId: 'user-1' },
        { ...validCollaborator, id: 'collab-2', userId: 'user-1' }, // Duplicate
      ];
      const result = collaboratorsSchema.safeParse(collaborators);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Duplicate');
      }
    });
  });

  describe('basicInfoSectionSchema', () => {
    it('should validate valid basic info section', () => {
      const result = basicInfoSectionSchema.safeParse({
        name: 'My Collection',
        description: 'A great collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: ['tag1'],
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing name', () => {
      const result = basicInfoSectionSchema.safeParse({
        description: 'A great collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('recipesSectionSchema', () => {
    it('should validate valid recipes section', () => {
      const result = recipesSectionSchema.safeParse({
        recipes: [validRecipe],
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty recipes', () => {
      const result = recipesSectionSchema.safeParse({
        recipes: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe('collaboratorsSectionSchema', () => {
    it('should validate valid collaborators section', () => {
      const result = collaboratorsSectionSchema.safeParse({
        collaborators: [validCollaborator],
      });
      expect(result.success).toBe(true);
    });

    it('should allow empty collaborators', () => {
      const result = collaboratorsSectionSchema.safeParse({
        collaborators: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('createCollectionFormSchema', () => {
    it('should validate valid form data', () => {
      const result = createCollectionFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should reject form with missing name', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        name: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject form with no recipes', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        recipes: [],
      });
      expect(result.success).toBe(false);
    });

    it('should require collaborators when SPECIFIC_USERS mode', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        collaborators: [],
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('collaborator');
      }
    });

    it('should accept SPECIFIC_USERS mode with collaborators', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        collaborators: [validCollaborator],
      });
      expect(result.success).toBe(true);
    });

    it('should not require collaborators for OWNER_ONLY mode', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        collaborators: [],
      });
      expect(result.success).toBe(true);
    });

    it('should not require collaborators for ALL_USERS mode', () => {
      const result = createCollectionFormSchema.safeParse({
        ...validFormData,
        collaborationMode: CollaborationMode.ALL_USERS,
        collaborators: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('validateSection', () => {
    it('should validate BASIC_INFO section', () => {
      const result = validateSection(CreateCollectionSection.BASIC_INFO, {
        name: 'My Collection',
        description: 'A great collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
      });
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid BASIC_INFO section', () => {
      const result = validateSection(CreateCollectionSection.BASIC_INFO, {
        name: '',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
      });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should validate RECIPES section', () => {
      const result = validateSection(CreateCollectionSection.RECIPES, {
        recipes: [validRecipe],
      });
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid RECIPES section', () => {
      const result = validateSection(CreateCollectionSection.RECIPES, {
        recipes: [],
      });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should return success for REVIEW section (no validation)', () => {
      const result = validateSection(CreateCollectionSection.REVIEW, {});
      expect(result.success).toBe(true);
    });
  });

  describe('isSectionComplete', () => {
    it('should return true for complete BASIC_INFO section', () => {
      const result = isSectionComplete(CreateCollectionSection.BASIC_INFO, {
        name: 'My Collection',
        description: 'A great collection',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
      });
      expect(result).toBe(true);
    });

    it('should return false for incomplete BASIC_INFO section', () => {
      const result = isSectionComplete(CreateCollectionSection.BASIC_INFO, {
        name: '',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
      });
      expect(result).toBe(false);
    });

    it('should return true for complete RECIPES section', () => {
      const result = isSectionComplete(CreateCollectionSection.RECIPES, {
        recipes: [validRecipe],
      });
      expect(result).toBe(true);
    });

    it('should return false for incomplete RECIPES section', () => {
      const result = isSectionComplete(CreateCollectionSection.RECIPES, {
        recipes: [],
      });
      expect(result).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should validate valid form data', () => {
      const result = validateForm(validFormData);
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid form data', () => {
      const result = validateForm({
        ...validFormData,
        name: '',
      });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('sectionFields', () => {
    it('should have correct fields for BASIC_INFO section', () => {
      expect(sectionFields[CreateCollectionSection.BASIC_INFO]).toEqual([
        'name',
        'description',
        'visibility',
        'collaborationMode',
        'tags',
      ]);
    });

    it('should have correct fields for RECIPES section', () => {
      expect(sectionFields[CreateCollectionSection.RECIPES]).toEqual([
        'recipes',
      ]);
    });

    it('should have correct fields for COLLABORATORS section', () => {
      expect(sectionFields[CreateCollectionSection.COLLABORATORS]).toEqual([
        'collaborators',
      ]);
    });

    it('should have empty fields for REVIEW section', () => {
      expect(sectionFields[CreateCollectionSection.REVIEW]).toEqual([]);
    });
  });
});
