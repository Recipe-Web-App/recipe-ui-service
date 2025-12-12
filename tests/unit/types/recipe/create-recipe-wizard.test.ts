// Mock crypto before importing modules that use it
let mockUuidCounter = 100;
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `mock-uuid-${mockUuidCounter++}`,
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
    },
  },
  writable: true,
  configurable: true,
});

import {
  CreateRecipeWizardStep,
  WIZARD_STEPS,
  CREATE_RECIPE_DEFAULT_VALUES,
  convertFormDataToRequest,
  createEmptyIngredient,
  createEmptyInstruction,
  getStepIndex,
  getStepById,
  stepHasErrors,
  type CreateRecipeFormData,
} from '@/types/recipe/create-recipe-wizard';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { FieldErrors } from 'react-hook-form';

describe('Create Recipe Wizard Types', () => {
  describe('CreateRecipeWizardStep enum', () => {
    it('should have all 5 steps', () => {
      expect(CreateRecipeWizardStep.BASIC_INFO).toBe('basic-info');
      expect(CreateRecipeWizardStep.TIMING).toBe('timing');
      expect(CreateRecipeWizardStep.INGREDIENTS).toBe('ingredients');
      expect(CreateRecipeWizardStep.INSTRUCTIONS).toBe('instructions');
      expect(CreateRecipeWizardStep.REVIEW).toBe('review');
    });
  });

  describe('WIZARD_STEPS', () => {
    it('should have 5 step configurations', () => {
      expect(WIZARD_STEPS).toHaveLength(5);
    });

    it('should have correct step order', () => {
      expect(WIZARD_STEPS[0]?.id).toBe(CreateRecipeWizardStep.BASIC_INFO);
      expect(WIZARD_STEPS[1]?.id).toBe(CreateRecipeWizardStep.TIMING);
      expect(WIZARD_STEPS[2]?.id).toBe(CreateRecipeWizardStep.INGREDIENTS);
      expect(WIZARD_STEPS[3]?.id).toBe(CreateRecipeWizardStep.INSTRUCTIONS);
      expect(WIZARD_STEPS[4]?.id).toBe(CreateRecipeWizardStep.REVIEW);
    });

    it('should have title and description for each step', () => {
      WIZARD_STEPS.forEach(step => {
        expect(step.title).toBeDefined();
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.description).toBeDefined();
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CREATE_RECIPE_DEFAULT_VALUES', () => {
    it('should have empty title', () => {
      expect(CREATE_RECIPE_DEFAULT_VALUES.title).toBe('');
    });

    it('should have default servings of 4', () => {
      expect(CREATE_RECIPE_DEFAULT_VALUES.servings).toBe(4);
    });

    it('should have one empty ingredient', () => {
      expect(CREATE_RECIPE_DEFAULT_VALUES.ingredients).toHaveLength(1);
      expect(CREATE_RECIPE_DEFAULT_VALUES.ingredients[0]?.name).toBe('');
      expect(CREATE_RECIPE_DEFAULT_VALUES.ingredients[0]?.quantity).toBe(1);
      expect(CREATE_RECIPE_DEFAULT_VALUES.ingredients[0]?.unit).toBe('UNIT');
    });

    it('should have one empty step', () => {
      expect(CREATE_RECIPE_DEFAULT_VALUES.steps).toHaveLength(1);
      expect(CREATE_RECIPE_DEFAULT_VALUES.steps[0]?.stepNumber).toBe(1);
      expect(CREATE_RECIPE_DEFAULT_VALUES.steps[0]?.instruction).toBe('');
    });

    it('should have empty tags array', () => {
      expect(CREATE_RECIPE_DEFAULT_VALUES.tags).toEqual([]);
    });
  });

  describe('convertFormDataToRequest', () => {
    const validFormData: CreateRecipeFormData = {
      title: 'Test Recipe',
      description: 'A test description',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      difficulty: DifficultyLevel.MEDIUM,
      ingredients: [
        { id: '1', name: 'Flour', quantity: 2, unit: 'CUP', notes: 'sifted' },
        { id: '2', name: 'Sugar', quantity: 1, unit: 'CUP' },
      ],
      steps: [
        { id: '1', stepNumber: 1, instruction: 'Mix ingredients', duration: 5 },
        { id: '2', stepNumber: 2, instruction: 'Bake at 350F', duration: 30 },
      ],
      tags: ['dessert', 'baking'],
    };

    it('should convert form data to API request format', () => {
      const request = convertFormDataToRequest(validFormData);

      expect(request.title).toBe('Test Recipe');
      expect(request.description).toBe('A test description');
      expect(request.servings).toBe(4);
      expect(request.preparationTime).toBe(15);
      expect(request.cookingTime).toBe(30);
      expect(request.difficulty).toBe(DifficultyLevel.MEDIUM);
    });

    it('should convert ingredients without id field', () => {
      const request = convertFormDataToRequest(validFormData);

      expect(request.ingredients).toHaveLength(2);
      expect(request.ingredients[0]).toEqual({
        ingredientName: 'Flour',
        quantity: 2,
        unit: 'CUP',
        notes: 'sifted',
      });
      expect(request.ingredients[1]).toEqual({
        ingredientName: 'Sugar',
        quantity: 1,
        unit: 'CUP',
        notes: undefined,
      });
    });

    it('should auto-number steps based on order', () => {
      const request = convertFormDataToRequest(validFormData);

      expect(request.steps).toHaveLength(2);
      expect(request.steps[0]?.stepNumber).toBe(1);
      expect(request.steps[1]?.stepNumber).toBe(2);
    });

    it('should handle empty tags', () => {
      const dataWithNoTags = { ...validFormData, tags: [] };
      const request = convertFormDataToRequest(dataWithNoTags);

      expect(request.tags).toBeUndefined();
    });

    it('should handle undefined tags', () => {
      const dataWithNoTags = { ...validFormData, tags: undefined };
      const request = convertFormDataToRequest(dataWithNoTags);

      expect(request.tags).toBeUndefined();
    });

    it('should include tags when present', () => {
      const request = convertFormDataToRequest(validFormData);

      expect(request.tags).toEqual([
        { tagId: 0, name: 'dessert' },
        { tagId: 0, name: 'baking' },
      ]);
    });

    it('should preserve empty description as is (nullish coalescing)', () => {
      const dataWithEmptyDesc = { ...validFormData, description: '' };
      const request = convertFormDataToRequest(dataWithEmptyDesc);

      // Empty string is NOT nullish, so it's preserved
      expect(request.description).toBe('');
    });

    it('should convert undefined description to empty string', () => {
      const dataWithNoDesc = { ...validFormData, description: undefined };
      const request = convertFormDataToRequest(dataWithNoDesc);

      expect(request.description).toBe('');
    });
  });

  describe('createEmptyIngredient', () => {
    it('should create ingredient with unique id', () => {
      const ingredient1 = createEmptyIngredient();
      const ingredient2 = createEmptyIngredient();

      // crypto.randomUUID is mocked in jest.setup.js to return test-uuid-{n}
      expect(typeof ingredient1.id).toBe('string');
      expect(typeof ingredient2.id).toBe('string');
      expect(ingredient1.id.length).toBeGreaterThan(0);
      expect(ingredient2.id.length).toBeGreaterThan(0);
      expect(ingredient1.id).not.toBe(ingredient2.id);
    });

    it('should create ingredient with default values', () => {
      const ingredient = createEmptyIngredient();

      expect(ingredient.name).toBe('');
      expect(ingredient.quantity).toBe(1);
      expect(ingredient.unit).toBe('UNIT');
      expect(ingredient.notes).toBe('');
    });
  });

  describe('createEmptyInstruction', () => {
    it('should create instruction with unique id', () => {
      const instruction1 = createEmptyInstruction(1);
      const instruction2 = createEmptyInstruction(2);

      // crypto.randomUUID is mocked in jest.setup.js to return test-uuid-{n}
      expect(typeof instruction1.id).toBe('string');
      expect(typeof instruction2.id).toBe('string');
      expect(instruction1.id.length).toBeGreaterThan(0);
      expect(instruction2.id.length).toBeGreaterThan(0);
      expect(instruction1.id).not.toBe(instruction2.id);
    });

    it('should create instruction with provided step number', () => {
      const instruction = createEmptyInstruction(5);

      expect(instruction.stepNumber).toBe(5);
    });

    it('should create instruction with empty values', () => {
      const instruction = createEmptyInstruction(1);

      expect(instruction.instruction).toBe('');
      expect(instruction.duration).toBeUndefined();
    });
  });

  describe('getStepIndex', () => {
    it('should return correct index for each step', () => {
      expect(getStepIndex(CreateRecipeWizardStep.BASIC_INFO)).toBe(0);
      expect(getStepIndex(CreateRecipeWizardStep.TIMING)).toBe(1);
      expect(getStepIndex(CreateRecipeWizardStep.INGREDIENTS)).toBe(2);
      expect(getStepIndex(CreateRecipeWizardStep.INSTRUCTIONS)).toBe(3);
      expect(getStepIndex(CreateRecipeWizardStep.REVIEW)).toBe(4);
    });
  });

  describe('getStepById', () => {
    it('should return correct step config', () => {
      const basicInfoStep = getStepById(CreateRecipeWizardStep.BASIC_INFO);

      expect(basicInfoStep).toBeDefined();
      expect(basicInfoStep?.id).toBe(CreateRecipeWizardStep.BASIC_INFO);
      expect(basicInfoStep?.title).toBe('Basic Info');
    });

    it('should return undefined for invalid step', () => {
      const invalidStep = getStepById('invalid' as CreateRecipeWizardStep);
      expect(invalidStep).toBeUndefined();
    });
  });

  describe('stepHasErrors', () => {
    it('should return true when basic info has title error', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {
        title: { type: 'required', message: 'Title is required' },
      };

      expect(stepHasErrors(CreateRecipeWizardStep.BASIC_INFO, errors)).toBe(
        true
      );
    });

    it('should return false when basic info has no errors', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {};

      expect(stepHasErrors(CreateRecipeWizardStep.BASIC_INFO, errors)).toBe(
        false
      );
    });

    it('should return true when timing has servings error', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {
        servings: { type: 'min', message: 'Must be at least 1' },
      };

      expect(stepHasErrors(CreateRecipeWizardStep.TIMING, errors)).toBe(true);
    });

    it('should return true when ingredients have errors', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {
        ingredients: {
          type: 'min',
          message: 'At least one ingredient required',
        },
      };

      expect(stepHasErrors(CreateRecipeWizardStep.INGREDIENTS, errors)).toBe(
        true
      );
    });

    it('should return true when steps have errors', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {
        steps: { type: 'min', message: 'At least one step required' },
      };

      expect(stepHasErrors(CreateRecipeWizardStep.INSTRUCTIONS, errors)).toBe(
        true
      );
    });

    it('should always return false for review step', () => {
      const errors: FieldErrors<CreateRecipeFormData> = {
        title: { type: 'required', message: 'Title is required' },
      };

      expect(stepHasErrors(CreateRecipeWizardStep.REVIEW, errors)).toBe(false);
    });
  });
});
