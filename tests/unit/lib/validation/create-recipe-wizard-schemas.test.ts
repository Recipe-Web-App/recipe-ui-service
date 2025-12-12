import {
  basicInfoStepSchema,
  timingStepSchema,
  ingredientsStepSchema,
  instructionsStepSchema,
  wizardIngredientSchema,
  wizardInstructionSchema,
  createRecipeWizardFormSchema,
  validateStep,
  validateStepsUpTo,
  getStepErrorMessages,
  isStepComplete,
  stepFields,
  ingredientUnitOptions,
} from '@/lib/validation/create-recipe-wizard-schemas';
import {
  CreateRecipeWizardStep,
  type CreateRecipeFormData,
} from '@/types/recipe/create-recipe-wizard';
import { DifficultyLevel } from '@/types/recipe-management/common';

describe('Create Recipe Wizard Schemas', () => {
  describe('basicInfoStepSchema', () => {
    it('should validate valid basic info', () => {
      const result = basicInfoStepSchema.safeParse({
        title: 'Delicious Pasta',
        description: 'A wonderful pasta recipe',
      });
      expect(result.success).toBe(true);
    });

    it('should validate with optional description', () => {
      const result = basicInfoStepSchema.safeParse({
        title: 'Delicious Pasta',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const result = basicInfoStepSchema.safeParse({
        title: '',
        description: 'A wonderful pasta recipe',
      });
      expect(result.success).toBe(false);
    });

    it('should reject title that is too short', () => {
      const result = basicInfoStepSchema.safeParse({
        title: 'ab',
      });
      expect(result.success).toBe(false);
    });

    it('should reject title that is too long', () => {
      const result = basicInfoStepSchema.safeParse({
        title: 'a'.repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });

  describe('timingStepSchema', () => {
    it('should validate valid timing data', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 15,
        cookTime: 30,
        difficulty: DifficultyLevel.MEDIUM,
      });
      expect(result.success).toBe(true);
    });

    it('should validate with optional difficulty', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 15,
        cookTime: 30,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing prepTime', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        cookTime: 30,
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing cookTime', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 15,
      });
      expect(result.success).toBe(false);
    });

    it('should accept zero prepTime and cookTime', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 0,
        cookTime: 0,
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid servings', () => {
      const result = timingStepSchema.safeParse({
        servings: 0,
        prepTime: 15,
        cookTime: 30,
      });
      expect(result.success).toBe(false);
    });

    it('should reject servings over 100', () => {
      const result = timingStepSchema.safeParse({
        servings: 101,
        prepTime: 15,
        cookTime: 30,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative prep time', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: -1,
        cookTime: 30,
      });
      expect(result.success).toBe(false);
    });

    it('should reject prep time over 1440 minutes', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 1441,
        cookTime: 30,
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative cook time', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 15,
        cookTime: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject cook time over 1440 minutes', () => {
      const result = timingStepSchema.safeParse({
        servings: 4,
        prepTime: 15,
        cookTime: 1441,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('wizardIngredientSchema', () => {
    it('should validate valid ingredient', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: 'Flour',
        quantity: 2,
        unit: 'CUP',
        notes: 'sifted',
      });
      expect(result.success).toBe(true);
    });

    it('should validate ingredient without notes', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: 'Salt',
        quantity: 1,
        unit: 'TSP',
      });
      expect(result.success).toBe(true);
    });

    it('should reject ingredient with empty name', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: '',
        quantity: 1,
        unit: 'CUP',
      });
      expect(result.success).toBe(false);
    });

    it('should reject ingredient with name too short', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: 'a',
        quantity: 1,
        unit: 'CUP',
      });
      expect(result.success).toBe(false);
    });

    it('should reject ingredient with zero quantity', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: 'Flour',
        quantity: 0,
        unit: 'CUP',
      });
      expect(result.success).toBe(false);
    });

    it('should reject ingredient with quantity over 10000', () => {
      const result = wizardIngredientSchema.safeParse({
        id: 'test-id',
        name: 'Flour',
        quantity: 10001,
        unit: 'CUP',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ingredientsStepSchema', () => {
    it('should validate valid ingredients list', () => {
      const result = ingredientsStepSchema.safeParse({
        ingredients: [
          { id: '1', name: 'Flour', quantity: 2, unit: 'CUP' },
          { id: '2', name: 'Sugar', quantity: 1, unit: 'CUP' },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty ingredients list', () => {
      const result = ingredientsStepSchema.safeParse({
        ingredients: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 50 ingredients', () => {
      const ingredients = Array.from({ length: 51 }, (_, i) => ({
        id: `id-${i}`,
        name: `Ingredient ${i}`,
        quantity: 1,
        unit: 'UNIT',
      }));
      const result = ingredientsStepSchema.safeParse({ ingredients });
      expect(result.success).toBe(false);
    });
  });

  describe('wizardInstructionSchema', () => {
    it('should validate valid instruction', () => {
      const result = wizardInstructionSchema.safeParse({
        id: 'test-id',
        stepNumber: 1,
        instruction: 'Preheat the oven to 350F',
        duration: 5,
      });
      expect(result.success).toBe(true);
    });

    it('should validate instruction without duration', () => {
      const result = wizardInstructionSchema.safeParse({
        id: 'test-id',
        stepNumber: 1,
        instruction: 'Mix all ingredients together thoroughly',
      });
      expect(result.success).toBe(true);
    });

    it('should reject instruction that is too short', () => {
      const result = wizardInstructionSchema.safeParse({
        id: 'test-id',
        stepNumber: 1,
        instruction: 'Mix',
      });
      expect(result.success).toBe(false);
    });

    it('should reject instruction over 1000 characters', () => {
      const result = wizardInstructionSchema.safeParse({
        id: 'test-id',
        stepNumber: 1,
        instruction: 'a'.repeat(1001),
      });
      expect(result.success).toBe(false);
    });

    it('should reject negative duration', () => {
      const result = wizardInstructionSchema.safeParse({
        id: 'test-id',
        stepNumber: 1,
        instruction: 'Preheat the oven to 350F',
        duration: -1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('instructionsStepSchema', () => {
    it('should validate valid instructions list', () => {
      const result = instructionsStepSchema.safeParse({
        steps: [
          { id: '1', stepNumber: 1, instruction: 'Preheat the oven to 350F' },
          {
            id: '2',
            stepNumber: 2,
            instruction: 'Mix all ingredients together',
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty instructions list', () => {
      const result = instructionsStepSchema.safeParse({
        steps: [],
      });
      expect(result.success).toBe(false);
    });

    it('should reject more than 100 steps', () => {
      const steps = Array.from({ length: 101 }, (_, i) => ({
        id: `id-${i}`,
        stepNumber: i + 1,
        instruction: `Step ${i + 1}: Do something important here`,
      }));
      const result = instructionsStepSchema.safeParse({ steps });
      expect(result.success).toBe(false);
    });
  });

  describe('createRecipeWizardFormSchema', () => {
    const validFormData: CreateRecipeFormData = {
      title: 'Test Recipe',
      description: 'A test recipe',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      difficulty: DifficultyLevel.EASY,
      ingredients: [
        { id: '1', name: 'Test ingredient', quantity: 1, unit: 'CUP' },
      ],
      steps: [{ id: '1', stepNumber: 1, instruction: 'Test instruction step' }],
      tags: ['test'],
    };

    it('should validate complete form data', () => {
      const result = createRecipeWizardFormSchema.safeParse(validFormData);
      expect(result.success).toBe(true);
    });

    it('should validate form with minimal data', () => {
      const minimalData = {
        title: 'Test Recipe',
        servings: 4,
        prepTime: 0,
        cookTime: 0,
        ingredients: [
          { id: '1', name: 'Test ingredient', quantity: 1, unit: 'CUP' },
        ],
        steps: [
          { id: '1', stepNumber: 1, instruction: 'Test instruction step' },
        ],
      };
      const result = createRecipeWizardFormSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });

    it('should reject more than 20 tags', () => {
      const data = {
        ...validFormData,
        tags: Array.from({ length: 21 }, (_, i) => `tag${i}`),
      };
      const result = createRecipeWizardFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('validateStep', () => {
    it('should validate basic info step', () => {
      const data = { title: 'Test Recipe', description: 'Description' };
      const result = validateStep(CreateRecipeWizardStep.BASIC_INFO, data);
      expect(result.success).toBe(true);
    });

    it('should return errors for invalid basic info step', () => {
      const data = { title: '', description: 'Description' };
      const result = validateStep(CreateRecipeWizardStep.BASIC_INFO, data);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should validate timing step', () => {
      const data = { servings: 4, prepTime: 15, cookTime: 30 };
      const result = validateStep(CreateRecipeWizardStep.TIMING, data);
      expect(result.success).toBe(true);
    });

    it('should validate ingredients step', () => {
      const data = {
        ingredients: [{ id: '1', name: 'Test', quantity: 1, unit: 'CUP' }],
      };
      const result = validateStep(CreateRecipeWizardStep.INGREDIENTS, data);
      expect(result.success).toBe(true);
    });

    it('should validate instructions step', () => {
      const data = {
        steps: [
          { id: '1', stepNumber: 1, instruction: 'Test instruction here' },
        ],
      };
      const result = validateStep(CreateRecipeWizardStep.INSTRUCTIONS, data);
      expect(result.success).toBe(true);
    });

    it('should always pass review step', () => {
      const result = validateStep(CreateRecipeWizardStep.REVIEW, {});
      expect(result.success).toBe(true);
    });
  });

  describe('validateStepsUpTo', () => {
    const validData: Partial<CreateRecipeFormData> = {
      title: 'Test Recipe',
      servings: 4,
      prepTime: 15,
      cookTime: 30,
      ingredients: [{ id: '1', name: 'Test', quantity: 1, unit: 'CUP' }],
      steps: [{ id: '1', stepNumber: 1, instruction: 'Test instruction here' }],
    };

    it('should validate all steps up to review', () => {
      const result = validateStepsUpTo(
        CreateRecipeWizardStep.REVIEW,
        validData
      );
      expect(result.success).toBe(true);
    });

    it('should return first invalid step', () => {
      const invalidData = { title: '' };
      const result = validateStepsUpTo(
        CreateRecipeWizardStep.REVIEW,
        invalidData
      );
      expect(result.success).toBe(false);
      expect(result.firstInvalidStep).toBe(CreateRecipeWizardStep.BASIC_INFO);
    });

    it('should validate partial progress', () => {
      const partialData = {
        title: 'Test Recipe',
        servings: 4,
        prepTime: 15,
        cookTime: 30,
      };
      const result = validateStepsUpTo(
        CreateRecipeWizardStep.TIMING,
        partialData
      );
      expect(result.success).toBe(true);
    });
  });

  describe('getStepErrorMessages', () => {
    it('should return empty array for valid step', () => {
      const data = { title: 'Test Recipe' };
      const errors = getStepErrorMessages(
        CreateRecipeWizardStep.BASIC_INFO,
        data
      );
      expect(errors).toEqual([]);
    });

    it('should return error messages for invalid step', () => {
      const data = { title: '' };
      const errors = getStepErrorMessages(
        CreateRecipeWizardStep.BASIC_INFO,
        data
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('title'))).toBe(true);
    });
  });

  describe('isStepComplete', () => {
    it('should return true for complete step', () => {
      const data = { title: 'Test Recipe' };
      expect(isStepComplete(CreateRecipeWizardStep.BASIC_INFO, data)).toBe(
        true
      );
    });

    it('should return false for incomplete step', () => {
      const data = { title: '' };
      expect(isStepComplete(CreateRecipeWizardStep.BASIC_INFO, data)).toBe(
        false
      );
    });
  });

  describe('stepFields', () => {
    it('should have correct fields for each step', () => {
      expect(stepFields[CreateRecipeWizardStep.BASIC_INFO]).toEqual([
        'title',
        'description',
      ]);
      expect(stepFields[CreateRecipeWizardStep.TIMING]).toEqual([
        'servings',
        'prepTime',
        'cookTime',
        'difficulty',
      ]);
      expect(stepFields[CreateRecipeWizardStep.INGREDIENTS]).toEqual([
        'ingredients',
      ]);
      expect(stepFields[CreateRecipeWizardStep.INSTRUCTIONS]).toEqual([
        'steps',
      ]);
      expect(stepFields[CreateRecipeWizardStep.REVIEW]).toEqual(['tags']);
    });
  });

  describe('ingredientUnitOptions', () => {
    it('should have all unit options', () => {
      expect(ingredientUnitOptions.length).toBeGreaterThan(0);
      expect(
        ingredientUnitOptions.every(
          opt => typeof opt.value === 'string' && typeof opt.label === 'string'
        )
      ).toBe(true);
    });

    it('should include common units', () => {
      const values = ingredientUnitOptions.map(opt => opt.value);
      expect(values).toContain('CUP');
      expect(values).toContain('TBSP');
      expect(values).toContain('TSP');
      expect(values).toContain('G');
      expect(values).toContain('KG');
    });
  });
});
