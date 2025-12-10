import {
  recipeTitleSchema,
  recipeDescriptionSchema,
  recipeServingsSchema,
  recipePrepTimeSchema,
  recipeCookTimeSchema,
  recipeDifficultySchema,
  recipeIngredientSchema,
  recipeStepSchema,
  recipeTagSchema,
  createRecipeFormSchema,
  editRecipeFormSchema,
  updateRecipeFormSchema,
  convertToCreateRecipeRequest,
  convertToUpdateRecipeRequest,
  convertFromRecipeDto,
  convertFromRecipeDtoToUpdate,
  createRecipeDefaultValues,
  type RecipeFormData,
  type EditRecipeFormData,
  type UpdateRecipeFormData,
} from '@/lib/validation/recipe-schemas';
import {
  DifficultyLevel,
  IngredientUnit,
} from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management';

describe('Recipe Schemas', () => {
  describe('recipeTitleSchema', () => {
    it('should validate valid titles', () => {
      expect(recipeTitleSchema.parse('Delicious Pasta')).toBe(
        'Delicious Pasta'
      );
      expect(recipeTitleSchema.parse('  Spaced Title  ')).toBe('Spaced Title');
    });

    it('should reject invalid titles', () => {
      expect(() => recipeTitleSchema.parse('')).toThrow(
        'Recipe title is required'
      );
      expect(() => recipeTitleSchema.parse('ab')).toThrow(
        'Recipe title must be at least 3 characters'
      );
      expect(() => recipeTitleSchema.parse('a'.repeat(201))).toThrow(
        'Recipe title must not exceed 200 characters'
      );
    });
  });

  describe('recipeDescriptionSchema', () => {
    it('should validate valid descriptions', () => {
      expect(recipeDescriptionSchema.parse('A great recipe')).toBe(
        'A great recipe'
      );
      expect(recipeDescriptionSchema.parse(undefined)).toBeUndefined();
      expect(recipeDescriptionSchema.parse('')).toBe('');
    });

    it('should reject invalid descriptions', () => {
      expect(() => recipeDescriptionSchema.parse('a'.repeat(2001))).toThrow(
        'Description must not exceed 2000 characters'
      );
    });
  });

  describe('recipeServingsSchema', () => {
    it('should validate valid servings', () => {
      expect(recipeServingsSchema.parse(1)).toBe(1);
      expect(recipeServingsSchema.parse(50)).toBe(50);
      expect(recipeServingsSchema.parse(100)).toBe(100);
    });

    it('should reject invalid servings', () => {
      expect(() => recipeServingsSchema.parse(0)).toThrow(
        'Servings must be at least 1'
      );
      expect(() => recipeServingsSchema.parse(101)).toThrow(
        'Servings must not exceed 100'
      );
      expect(() => recipeServingsSchema.parse(1.5)).toThrow(
        'Servings must be a whole number'
      );
    });
  });

  describe('recipePrepTimeSchema', () => {
    it('should validate valid prep times', () => {
      expect(recipePrepTimeSchema.parse(0)).toBe(0);
      expect(recipePrepTimeSchema.parse(30)).toBe(30);
      expect(recipePrepTimeSchema.parse(1440)).toBe(1440);
      expect(recipePrepTimeSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid prep times', () => {
      expect(() => recipePrepTimeSchema.parse(-1)).toThrow(
        'Preparation time cannot be negative'
      );
      expect(() => recipePrepTimeSchema.parse(1441)).toThrow(
        'Preparation time must not exceed 1440 minutes'
      );
      expect(() => recipePrepTimeSchema.parse(15.5)).toThrow(
        'Preparation time must be a whole number'
      );
    });
  });

  describe('recipeCookTimeSchema', () => {
    it('should validate valid cook times', () => {
      expect(recipeCookTimeSchema.parse(0)).toBe(0);
      expect(recipeCookTimeSchema.parse(45)).toBe(45);
      expect(recipeCookTimeSchema.parse(1440)).toBe(1440);
      expect(recipeCookTimeSchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid cook times', () => {
      expect(() => recipeCookTimeSchema.parse(-1)).toThrow(
        'Cooking time cannot be negative'
      );
      expect(() => recipeCookTimeSchema.parse(1441)).toThrow(
        'Cooking time must not exceed 1440 minutes'
      );
      expect(() => recipeCookTimeSchema.parse(30.5)).toThrow(
        'Cooking time must be a whole number'
      );
    });
  });

  describe('recipeDifficultySchema', () => {
    it('should validate valid difficulty levels', () => {
      expect(recipeDifficultySchema.parse(DifficultyLevel.EASY)).toBe(
        DifficultyLevel.EASY
      );
      expect(recipeDifficultySchema.parse(DifficultyLevel.EXPERT)).toBe(
        DifficultyLevel.EXPERT
      );
      expect(recipeDifficultySchema.parse(undefined)).toBeUndefined();
    });

    it('should reject invalid difficulty levels', () => {
      expect(() => recipeDifficultySchema.parse('INVALID' as any)).toThrow();
    });
  });

  describe('recipeIngredientSchema', () => {
    it('should validate valid ingredients', () => {
      const validIngredient = {
        name: 'Flour',
        quantity: 2,
        unit: IngredientUnit.CUP,
      };
      expect(recipeIngredientSchema.parse(validIngredient)).toEqual(
        validIngredient
      );
    });

    it('should reject invalid ingredients', () => {
      expect(() =>
        recipeIngredientSchema.parse({
          name: '',
          quantity: 2,
          unit: IngredientUnit.CUP,
        })
      ).toThrow('Ingredient name is required');

      expect(() =>
        recipeIngredientSchema.parse({
          name: 'Flour',
          quantity: 0,
          unit: IngredientUnit.CUP,
        })
      ).toThrow('Quantity must be greater than 0');

      expect(() =>
        recipeIngredientSchema.parse({
          name: 'Flour',
          quantity: 2,
          unit: 'INVALID' as any,
        })
      ).toThrow();
    });
  });

  describe('recipeStepSchema', () => {
    it('should validate valid steps', () => {
      const validStep = {
        stepNumber: 1,
        instruction:
          'Mix the ingredients together carefully until well combined.',
        duration: 5,
      };
      expect(recipeStepSchema.parse(validStep)).toEqual(validStep);
    });

    it('should reject invalid steps', () => {
      expect(() =>
        recipeStepSchema.parse({
          stepNumber: 0,
          instruction: 'Valid instruction',
        })
      ).toThrow('Step number must be at least 1');

      expect(() =>
        recipeStepSchema.parse({
          stepNumber: 1,
          instruction: 'Short',
        })
      ).toThrow('Step instruction must be at least 10 characters');

      expect(() =>
        recipeStepSchema.parse({
          stepNumber: 1,
          instruction: 'a'.repeat(1001),
        })
      ).toThrow('Step instruction must not exceed 1000 characters');
    });
  });

  describe('recipeTagSchema', () => {
    it('should validate valid tags', () => {
      expect(recipeTagSchema.parse('vegetarian')).toBe('vegetarian');
      expect(recipeTagSchema.parse('quick-meal')).toBe('quick-meal');
      expect(recipeTagSchema.parse('30 minute')).toBe('30 minute');
    });

    it('should reject invalid tags', () => {
      expect(() => recipeTagSchema.parse('')).toThrow('Tag name is required');
      expect(() => recipeTagSchema.parse('a')).toThrow(
        'Tag must be at least 2 characters'
      );
      expect(() => recipeTagSchema.parse('a'.repeat(51))).toThrow(
        'Tag must not exceed 50 characters'
      );
      expect(() => recipeTagSchema.parse('tag@special')).toThrow(
        'Tag can only contain letters, numbers, spaces, and hyphens'
      );
    });
  });

  describe('createRecipeFormSchema', () => {
    it('should validate valid create form data', () => {
      const validData: RecipeFormData = {
        title: 'Test Recipe',
        description: 'A test recipe',
        servings: 4,
        prepTime: 15,
        cookTime: 30,
        difficulty: DifficultyLevel.EASY,
        ingredients: [
          {
            name: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction:
              'Mix the ingredients together carefully until well combined.',
            duration: 5,
          },
        ],
        tags: ['easy', 'vegetarian'],
      };

      expect(createRecipeFormSchema.parse(validData)).toEqual(validData);
    });

    it('should reject invalid create form data', () => {
      expect(() =>
        createRecipeFormSchema.parse({
          title: 'Test Recipe',
          servings: 4,
          ingredients: [],
          steps: [],
        })
      ).toThrow('At least one ingredient is required');

      expect(() =>
        createRecipeFormSchema.parse({
          title: 'Test Recipe',
          servings: 4,
          ingredients: Array(51).fill({
            name: 'Ingredient',
            quantity: 1,
            unit: IngredientUnit.UNIT,
          }),
          steps: [
            {
              stepNumber: 1,
              instruction: 'Valid instruction here',
            },
          ],
        })
      ).toThrow('Recipe cannot have more than 50 ingredients');
    });
  });

  describe('editRecipeFormSchema', () => {
    it('should validate valid edit form data', () => {
      const validData: EditRecipeFormData = {
        recipeId: 1,
        title: 'Updated Recipe',
        description: 'An updated recipe',
        servings: 6,
        prepTime: 20,
        cookTime: 45,
        difficulty: DifficultyLevel.MEDIUM,
        ingredients: [
          {
            name: 'Sugar',
            quantity: 1,
            unit: IngredientUnit.CUP,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction: 'Combine all ingredients in a large mixing bowl.',
            duration: 3,
          },
        ],
        tags: ['updated', 'medium'],
      };

      expect(editRecipeFormSchema.parse(validData)).toEqual(validData);
    });

    it('should reject invalid edit form data', () => {
      expect(() =>
        editRecipeFormSchema.parse({
          recipeId: -1,
          title: 'Test Recipe',
          servings: 4,
          ingredients: [],
          steps: [],
        })
      ).toThrow();
    });
  });

  describe('convertToCreateRecipeRequest', () => {
    it('should convert form data to create request', () => {
      const formData: RecipeFormData = {
        title: 'Test Recipe',
        description: 'A test recipe',
        servings: 4,
        prepTime: 15,
        cookTime: 30,
        difficulty: DifficultyLevel.EASY,
        ingredients: [
          {
            name: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction:
              'Mix the ingredients together carefully until well combined.',
            duration: 5,
          },
        ],
        tags: ['easy', 'vegetarian'],
      };

      const result = convertToCreateRecipeRequest(formData);

      expect(result).toEqual({
        title: 'Test Recipe',
        description: 'A test recipe',
        servings: 4,
        preparationTime: 15,
        cookingTime: 30,
        difficulty: DifficultyLevel.EASY,
        ingredients: [
          {
            ingredientName: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
            isOptional: undefined,
            notes: undefined,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction:
              'Mix the ingredients together carefully until well combined.',
            timerSeconds: 5,
            optional: undefined,
          },
        ],
        tags: [
          { name: 'easy', tagId: 0 },
          { name: 'vegetarian', tagId: 0 },
        ],
      });
    });
  });

  describe('convertFromRecipeDto', () => {
    it('should convert RecipeDto to edit form data', () => {
      const recipeDto: RecipeDto = {
        recipeId: 1,
        userId: 'user-123',
        title: 'Existing Recipe',
        description: 'An existing recipe',
        servings: 4,
        preparationTime: 15,
        cookingTime: 30,
        difficulty: DifficultyLevel.EASY,
        createdAt: '2023-01-01T00:00:00Z',
        ingredients: [
          {
            ingredientId: 1,
            ingredientName: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
            isOptional: false,
            recipeId: 1,
          },
        ],
        steps: [
          {
            stepId: 1,
            stepNumber: 1,
            instruction:
              'Mix the ingredients together carefully until well combined.',
            timerSeconds: 5,
          },
        ],
        tags: [
          {
            tagId: 1,
            name: 'easy',
          },
        ],
      };

      const result = convertFromRecipeDto(recipeDto);

      expect(result).toEqual({
        recipeId: 1,
        title: 'Existing Recipe',
        description: 'An existing recipe',
        servings: 4,
        prepTime: 15,
        cookTime: 30,
        difficulty: DifficultyLevel.EASY,
        ingredients: [
          {
            name: 'Flour',
            quantity: 2,
            unit: IngredientUnit.CUP,
            isOptional: false,
            notes: undefined,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction:
              'Mix the ingredients together carefully until well combined.',
            duration: 5,
            optional: undefined,
          },
        ],
        tags: ['easy'],
      });
    });
  });

  describe('createRecipeDefaultValues', () => {
    it('should provide sensible default values', () => {
      expect(createRecipeDefaultValues).toEqual({
        title: '',
        description: '',
        servings: 4,
        prepTime: undefined,
        cookTime: undefined,
        difficulty: undefined,
        ingredients: [
          {
            name: '',
            quantity: 1,
            unit: IngredientUnit.UNIT,
            isOptional: false,
            notes: undefined,
          },
        ],
        steps: [
          {
            stepNumber: 1,
            instruction: '',
            duration: undefined,
            optional: false,
          },
        ],
        tags: [],
      });
    });
  });
});
