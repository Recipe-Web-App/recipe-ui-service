import { describe, it, expect } from '@jest/globals';
import {
  type MealPlanFilterValues,
  DEFAULT_MEAL_PLAN_FILTER_VALUES,
  MEAL_PLAN_FILTER_CONSTANTS,
  DURATION_OPTIONS,
  STATUS_OPTIONS,
  getDurationOptions,
  getStatusOptions,
  getMealTypeOptions,
  formatRecipeCount,
  mealPlanFiltersToFilterValues,
  filterValuesToMealPlanFilters,
} from '@/types/meal-plan/filters';
import { MealType } from '@/types/meal-plan-management/common';

describe('MealPlanFilterValues', () => {
  describe('DEFAULT_MEAL_PLAN_FILTER_VALUES', () => {
    it('should have expected default values', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES).toEqual({
        search: '',
        duration: [],
        recipeCountRange: [0, 50],
        status: [],
        mealTypes: [],
        showMyMealPlans: false,
        showOnlyFavorited: false,
      });
    });

    it('should have empty search by default', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES.search).toBe('');
    });

    it('should have empty duration array by default', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES.duration).toEqual([]);
    });

    it('should have max recipe count range by default', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES.recipeCountRange).toEqual([0, 50]);
    });

    it('should have showMyMealPlans as false by default', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES.showMyMealPlans).toBe(false);
    });

    it('should have showOnlyFavorited as false by default', () => {
      expect(DEFAULT_MEAL_PLAN_FILTER_VALUES.showOnlyFavorited).toBe(false);
    });
  });

  describe('MEAL_PLAN_FILTER_CONSTANTS', () => {
    it('should have MAX_RECIPE_COUNT of 50', () => {
      expect(MEAL_PLAN_FILTER_CONSTANTS.MAX_RECIPE_COUNT).toBe(50);
    });

    it('should have RECIPE_COUNT_STEP of 5', () => {
      expect(MEAL_PLAN_FILTER_CONSTANTS.RECIPE_COUNT_STEP).toBe(5);
    });

    it('should have SEARCH_DEBOUNCE_DELAY of 300', () => {
      expect(MEAL_PLAN_FILTER_CONSTANTS.SEARCH_DEBOUNCE_DELAY).toBe(300);
    });
  });

  describe('DURATION_OPTIONS', () => {
    it('should have ONE_WEEK option', () => {
      expect(DURATION_OPTIONS.ONE_WEEK).toBe('1 week');
    });

    it('should have TWO_WEEKS option', () => {
      expect(DURATION_OPTIONS.TWO_WEEKS).toBe('2 weeks');
    });

    it('should have ONE_MONTH option', () => {
      expect(DURATION_OPTIONS.ONE_MONTH).toBe('1 month');
    });

    it('should have CUSTOM option', () => {
      expect(DURATION_OPTIONS.CUSTOM).toBe('Custom');
    });
  });

  describe('STATUS_OPTIONS', () => {
    it('should have CURRENT option', () => {
      expect(STATUS_OPTIONS.CURRENT).toBe('Current');
    });

    it('should have UPCOMING option', () => {
      expect(STATUS_OPTIONS.UPCOMING).toBe('Upcoming');
    });

    it('should have COMPLETED option', () => {
      expect(STATUS_OPTIONS.COMPLETED).toBe('Completed');
    });
  });
});

describe('getDurationOptions', () => {
  it('should return array of duration options', () => {
    const options = getDurationOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options).toHaveLength(4);
  });

  it('should return 1 Week option', () => {
    const options = getDurationOptions();
    const oneWeek = options.find(opt => opt.id === DURATION_OPTIONS.ONE_WEEK);
    expect(oneWeek).toBeDefined();
    expect(oneWeek?.label).toBe('1 Week');
    expect(oneWeek?.description).toBe('Meal plans lasting one week (7 days)');
  });

  it('should return 2 Weeks option', () => {
    const options = getDurationOptions();
    const twoWeeks = options.find(opt => opt.id === DURATION_OPTIONS.TWO_WEEKS);
    expect(twoWeeks).toBeDefined();
    expect(twoWeeks?.label).toBe('2 Weeks');
    expect(twoWeeks?.description).toBe(
      'Meal plans lasting two weeks (14 days)'
    );
  });

  it('should return 1 Month option', () => {
    const options = getDurationOptions();
    const oneMonth = options.find(opt => opt.id === DURATION_OPTIONS.ONE_MONTH);
    expect(oneMonth).toBeDefined();
    expect(oneMonth?.label).toBe('1 Month');
    expect(oneMonth?.description).toBe(
      'Meal plans lasting one month (28-31 days)'
    );
  });

  it('should return Custom option', () => {
    const options = getDurationOptions();
    const custom = options.find(opt => opt.id === DURATION_OPTIONS.CUSTOM);
    expect(custom).toBeDefined();
    expect(custom?.label).toBe('Custom');
    expect(custom?.description).toBe('Meal plans with custom duration');
  });
});

describe('getStatusOptions', () => {
  it('should return array of status options', () => {
    const options = getStatusOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options).toHaveLength(3);
  });

  it('should return Current option', () => {
    const options = getStatusOptions();
    const current = options.find(opt => opt.id === STATUS_OPTIONS.CURRENT);
    expect(current).toBeDefined();
    expect(current?.label).toBe('Current');
    expect(current?.description).toBe('Meal plans currently active');
  });

  it('should return Upcoming option', () => {
    const options = getStatusOptions();
    const upcoming = options.find(opt => opt.id === STATUS_OPTIONS.UPCOMING);
    expect(upcoming).toBeDefined();
    expect(upcoming?.label).toBe('Upcoming');
    expect(upcoming?.description).toBe('Meal plans scheduled for the future');
  });

  it('should return Completed option', () => {
    const options = getStatusOptions();
    const completed = options.find(opt => opt.id === STATUS_OPTIONS.COMPLETED);
    expect(completed).toBeDefined();
    expect(completed?.label).toBe('Completed');
    expect(completed?.description).toBe('Meal plans that have ended');
  });
});

describe('getMealTypeOptions', () => {
  it('should return array of meal type options', () => {
    const options = getMealTypeOptions();
    expect(Array.isArray(options)).toBe(true);
    expect(options).toHaveLength(5);
  });

  it('should return Breakfast option', () => {
    const options = getMealTypeOptions();
    const breakfast = options.find(opt => opt.id === MealType.BREAKFAST);
    expect(breakfast).toBeDefined();
    expect(breakfast?.label).toBe('Breakfast');
    expect(breakfast?.description).toBe('Morning meals');
  });

  it('should return Lunch option', () => {
    const options = getMealTypeOptions();
    const lunch = options.find(opt => opt.id === MealType.LUNCH);
    expect(lunch).toBeDefined();
    expect(lunch?.label).toBe('Lunch');
    expect(lunch?.description).toBe('Midday meals');
  });

  it('should return Dinner option', () => {
    const options = getMealTypeOptions();
    const dinner = options.find(opt => opt.id === MealType.DINNER);
    expect(dinner).toBeDefined();
    expect(dinner?.label).toBe('Dinner');
    expect(dinner?.description).toBe('Evening meals');
  });

  it('should return Snack option', () => {
    const options = getMealTypeOptions();
    const snack = options.find(opt => opt.id === MealType.SNACK);
    expect(snack).toBeDefined();
    expect(snack?.label).toBe('Snack');
    expect(snack?.description).toBe('Light snacks between meals');
  });

  it('should return Dessert option', () => {
    const options = getMealTypeOptions();
    const dessert = options.find(opt => opt.id === MealType.DESSERT);
    expect(dessert).toBeDefined();
    expect(dessert?.label).toBe('Dessert');
    expect(dessert?.description).toBe('Sweet treats and desserts');
  });

  it('should map all MealType enum values', () => {
    const options = getMealTypeOptions();
    const optionIds = options.map(opt => opt.id);
    expect(optionIds).toContain(MealType.BREAKFAST);
    expect(optionIds).toContain(MealType.LUNCH);
    expect(optionIds).toContain(MealType.DINNER);
    expect(optionIds).toContain(MealType.SNACK);
    expect(optionIds).toContain(MealType.DESSERT);
  });
});

describe('formatRecipeCount', () => {
  it('should format 0 as "0 recipes"', () => {
    expect(formatRecipeCount(0)).toBe('0 recipes');
  });

  it('should format 1 as "1 recipe" (singular)', () => {
    expect(formatRecipeCount(1)).toBe('1 recipe');
  });

  it('should format small numbers correctly', () => {
    expect(formatRecipeCount(5)).toBe('5 recipes');
    expect(formatRecipeCount(10)).toBe('10 recipes');
    expect(formatRecipeCount(25)).toBe('25 recipes');
  });

  it('should format 50 as "50+ recipes"', () => {
    expect(formatRecipeCount(50)).toBe('50+ recipes');
  });

  it('should format numbers > 50 as "50+ recipes"', () => {
    expect(formatRecipeCount(51)).toBe('50+ recipes');
    expect(formatRecipeCount(100)).toBe('50+ recipes');
    expect(formatRecipeCount(1000)).toBe('50+ recipes');
  });
});

describe('mealPlanFiltersToFilterValues', () => {
  it('should convert MealPlanFilterValues to generic FilterValues', () => {
    const mealPlanFilters: MealPlanFilterValues = {
      search: 'keto',
      duration: [DURATION_OPTIONS.ONE_WEEK],
      recipeCountRange: [10, 30],
      status: [STATUS_OPTIONS.CURRENT],
      mealTypes: [MealType.DINNER],
      showMyMealPlans: true,
      showOnlyFavorited: false,
    };

    const result = mealPlanFiltersToFilterValues(mealPlanFilters);

    expect(result).toEqual({
      search: 'keto',
      duration: [DURATION_OPTIONS.ONE_WEEK],
      recipeCountRange: [10, 30],
      status: [STATUS_OPTIONS.CURRENT],
      mealTypes: [MealType.DINNER],
      showMyMealPlans: true,
      showOnlyFavorited: false,
    });
  });

  it('should use defaults for undefined values', () => {
    const mealPlanFilters: MealPlanFilterValues = {};

    const result = mealPlanFiltersToFilterValues(mealPlanFilters);

    expect(result).toEqual({
      search: '',
      duration: [],
      recipeCountRange: [0, 50],
      status: [],
      mealTypes: [],
      showMyMealPlans: false,
      showOnlyFavorited: false,
    });
  });

  it('should handle partial values', () => {
    const mealPlanFilters: MealPlanFilterValues = {
      search: 'test',
      showMyMealPlans: true,
    };

    const result = mealPlanFiltersToFilterValues(mealPlanFilters);

    expect(result.search).toBe('test');
    expect(result.showMyMealPlans).toBe(true);
    expect(result.duration).toEqual([]);
    expect(result.showOnlyFavorited).toBe(false);
  });
});

describe('filterValuesToMealPlanFilters', () => {
  it('should convert generic FilterValues to MealPlanFilterValues', () => {
    const filterValues = {
      search: 'vegan',
      duration: [DURATION_OPTIONS.ONE_MONTH],
      recipeCountRange: [20, 40],
      status: [STATUS_OPTIONS.UPCOMING],
      mealTypes: [MealType.BREAKFAST, MealType.LUNCH],
      showMyMealPlans: false,
      showOnlyFavorited: true,
    };

    const result = filterValuesToMealPlanFilters(filterValues);

    expect(result).toEqual({
      search: 'vegan',
      duration: [DURATION_OPTIONS.ONE_MONTH],
      recipeCountRange: [20, 40],
      status: [STATUS_OPTIONS.UPCOMING],
      mealTypes: [MealType.BREAKFAST, MealType.LUNCH],
      showMyMealPlans: false,
      showOnlyFavorited: true,
    });
  });

  it('should handle string search value', () => {
    const result = filterValuesToMealPlanFilters({ search: 'hello' });
    expect(result.search).toBe('hello');
  });

  it('should handle non-string search value as undefined', () => {
    const result = filterValuesToMealPlanFilters({ search: 123 });
    expect(result.search).toBeUndefined();
  });

  it('should handle array duration value', () => {
    const result = filterValuesToMealPlanFilters({
      duration: [DURATION_OPTIONS.ONE_WEEK],
    });
    expect(result.duration).toEqual([DURATION_OPTIONS.ONE_WEEK]);
  });

  it('should handle non-array duration value as undefined', () => {
    const result = filterValuesToMealPlanFilters({ duration: 'not-array' });
    expect(result.duration).toBeUndefined();
  });

  it('should handle array recipeCountRange value', () => {
    const result = filterValuesToMealPlanFilters({
      recipeCountRange: [5, 25],
    });
    expect(result.recipeCountRange).toEqual([5, 25]);
  });

  it('should handle boolean showMyMealPlans value', () => {
    const result = filterValuesToMealPlanFilters({ showMyMealPlans: true });
    expect(result.showMyMealPlans).toBe(true);
  });

  it('should handle non-boolean showMyMealPlans value as undefined', () => {
    const result = filterValuesToMealPlanFilters({ showMyMealPlans: 'true' });
    expect(result.showMyMealPlans).toBeUndefined();
  });

  it('should handle boolean showOnlyFavorited value', () => {
    const result = filterValuesToMealPlanFilters({ showOnlyFavorited: false });
    expect(result.showOnlyFavorited).toBe(false);
  });

  it('should handle empty object', () => {
    const result = filterValuesToMealPlanFilters({});
    expect(result).toEqual({
      search: undefined,
      duration: undefined,
      recipeCountRange: undefined,
      status: undefined,
      mealTypes: undefined,
      showMyMealPlans: undefined,
      showOnlyFavorited: undefined,
    });
  });
});

describe('Round-trip conversions', () => {
  it('should preserve data through round-trip conversion', () => {
    const original: MealPlanFilterValues = {
      search: 'test meal plan',
      duration: [DURATION_OPTIONS.TWO_WEEKS, DURATION_OPTIONS.ONE_MONTH],
      recipeCountRange: [15, 35],
      status: [STATUS_OPTIONS.CURRENT, STATUS_OPTIONS.UPCOMING],
      mealTypes: [MealType.BREAKFAST, MealType.DINNER],
      showMyMealPlans: true,
      showOnlyFavorited: false,
    };

    const genericValues = mealPlanFiltersToFilterValues(original);
    const restored = filterValuesToMealPlanFilters(genericValues);

    expect(restored).toEqual(original);
  });

  it('should preserve default values through round-trip', () => {
    const original = DEFAULT_MEAL_PLAN_FILTER_VALUES;

    const genericValues = mealPlanFiltersToFilterValues(original);
    const restored = filterValuesToMealPlanFilters(genericValues);

    expect(restored).toEqual({
      search: '',
      duration: [],
      recipeCountRange: [0, 50],
      status: [],
      mealTypes: [],
      showMyMealPlans: false,
      showOnlyFavorited: false,
    });
  });

  it('should handle partial values in round-trip', () => {
    const original: MealPlanFilterValues = {
      search: 'partial',
      showMyMealPlans: true,
    };

    const genericValues = mealPlanFiltersToFilterValues(original);
    const restored = filterValuesToMealPlanFilters(genericValues);

    expect(restored.search).toBe('partial');
    expect(restored.showMyMealPlans).toBe(true);
    // Other values should use defaults
    expect(restored.duration).toEqual([]);
    expect(restored.showOnlyFavorited).toBe(false);
  });
});
