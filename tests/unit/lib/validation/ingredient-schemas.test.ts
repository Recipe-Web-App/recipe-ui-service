import {
  ingredientUnitSchema,
  ingredientQuantitySchema,
  ingredientNameSchema,
  ingredientFormSchema,
  editIngredientFormSchema,
  convertToRecipeIngredientDto,
  convertFromRecipeIngredientDto,
} from '@/lib/validation/ingredient-schemas';
import { IngredientUnit } from '@/types/recipe-management/common';

describe('Ingredient Validation Schemas', () => {
  describe('ingredientUnitSchema', () => {
    it('should accept valid ingredient units', () => {
      Object.values(IngredientUnit).forEach(unit => {
        const result = ingredientUnitSchema.safeParse(unit);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid ingredient units', () => {
      const result = ingredientUnitSchema.safeParse('INVALID_UNIT');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please select a valid unit'
        );
      }
    });
  });

  describe('ingredientQuantitySchema', () => {
    it('should accept valid positive numbers', () => {
      const validQuantities = [1, 0.5, 100, 999999];
      validQuantities.forEach(quantity => {
        const result = ingredientQuantitySchema.safeParse(quantity);
        expect(result.success).toBe(true);
      });
    });

    it('should reject zero and negative numbers', () => {
      const invalidQuantities = [0, -1, -0.5];
      invalidQuantities.forEach(quantity => {
        const result = ingredientQuantitySchema.safeParse(quantity);
        expect(result.success).toBe(false);
      });
    });

    it('should reject quantities exceeding maximum', () => {
      const result = ingredientQuantitySchema.safeParse(1000000);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Quantity cannot exceed 999,999'
        );
      }
    });

    it('should reject non-numeric values', () => {
      const result = ingredientQuantitySchema.safeParse('not a number');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Quantity must be a number'
        );
      }
    });
  });

  describe('ingredientNameSchema', () => {
    it('should accept valid ingredient names', () => {
      const validNames = [
        'Salt',
        'Chicken breast',
        'Extra virgin olive oil',
        'Fresh basil leaves',
      ];
      validNames.forEach(name => {
        const result = ingredientNameSchema.safeParse(name);
        expect(result.success).toBe(true);
      });
    });

    it('should reject empty strings', () => {
      const result = ingredientNameSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Ingredient name cannot be empty'
        );
      }
    });

    it('should reject whitespace-only strings', () => {
      const result = ingredientNameSchema.safeParse('   ');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Ingredient name cannot be only whitespace'
        );
      }
    });

    it('should reject names exceeding maximum length', () => {
      const longName = 'a'.repeat(256);
      const result = ingredientNameSchema.safeParse(longName);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Ingredient name cannot exceed 255 characters'
        );
      }
    });

    it('should trim whitespace from names', () => {
      const result = ingredientNameSchema.safeParse('  Salt  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Salt');
      }
    });
  });

  describe('ingredientFormSchema', () => {
    it('should validate complete valid form data', () => {
      const validData = {
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      };
      const result = ingredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject incomplete form data', () => {
      const incompleteData = {
        ingredientName: 'Salt',
        // Missing quantity and unit
      };
      const result = ingredientFormSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });

    it('should handle optional isOptional field', () => {
      const dataWithoutOptional = {
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
      };
      const result = ingredientFormSchema.safeParse(dataWithoutOptional);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isOptional).toBe(false);
      }
    });
  });

  describe('editIngredientFormSchema', () => {
    it('should validate complete edit form data', () => {
      const validData = {
        ingredientId: 1,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
        recipeId: 123,
      };
      const result = editIngredientFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require ingredientId for editing', () => {
      const dataWithoutId = {
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      };
      const result = editIngredientFormSchema.safeParse(dataWithoutId);
      expect(result.success).toBe(false);
    });

    it('should allow optional recipeId', () => {
      const dataWithoutRecipeId = {
        ingredientId: 1,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      };
      const result = editIngredientFormSchema.safeParse(dataWithoutRecipeId);
      expect(result.success).toBe(true);
    });
  });

  describe('convertToRecipeIngredientDto', () => {
    it('should convert form data to API format', () => {
      const formData = {
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      };
      const result = convertToRecipeIngredientDto(formData, 123, 456);
      expect(result).toEqual({
        recipeId: 123,
        ingredientId: 456,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      });
    });

    it('should handle missing optional parameters', () => {
      const formData = {
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      };
      const result = convertToRecipeIngredientDto(formData);
      expect(result).toEqual({
        recipeId: undefined,
        ingredientId: 0,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: false,
      });
    });
  });

  describe('convertFromRecipeIngredientDto', () => {
    it('should convert API data to form format', () => {
      const apiData = {
        ingredientId: 456,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: true,
        recipeId: 123,
      };
      const result = convertFromRecipeIngredientDto(apiData);
      expect(result).toEqual({
        ingredientId: 456,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
        isOptional: true,
        recipeId: 123,
      });
    });

    it('should default isOptional to false when missing', () => {
      const apiData = {
        ingredientId: 456,
        ingredientName: 'Salt',
        quantity: 1,
        unit: IngredientUnit.TSP,
      };
      const result = convertFromRecipeIngredientDto(apiData);
      expect(result.isOptional).toBe(false);
    });
  });
});
