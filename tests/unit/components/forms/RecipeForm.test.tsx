import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RecipeForm,
  CreateRecipeForm,
  EditRecipeForm,
  UpdateRecipeForm,
} from '@/components/forms/RecipeForm';
import {
  DifficultyLevel,
  IngredientUnit,
} from '@/types/recipe-management/common';
import type { RecipeDto } from '@/types/recipe-management';

// Mock the hooks since they depend on API calls
jest.mock('@/hooks/forms/useRecipeForm', () => ({
  useCreateRecipeForm: jest.fn(),
  useEditRecipeForm: jest.fn(),
  useUpdateRecipeForm: jest.fn(),
}));

// Mock API client
jest.mock('@/lib/api/recipe-management', () => ({
  recipesApi: {
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
  },
}));

// Mock FormField components to avoid react-hook-form complexity
jest.mock('@/components/forms/FormField', () => ({
  FormInput: ({ label, name, type, ...props }: any) => (
    <div data-testid={`form-input-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} {...props} />
    </div>
  ),
  FormSelect: ({ label, name, options, ...props }: any) => (
    <div data-testid={`form-select-${name}`}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} {...props}>
        {options?.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  FormTextarea: ({ label, name, type, ...props }: any) => (
    <div data-testid={`form-textarea-${name}`}>
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} data-type={type} {...props} />
    </div>
  ),
  FormErrors: ({ form }: any) => {
    const errors = form?.formState?.errors || {};
    const errorKeys = Object.keys(errors);

    if (errorKeys.length === 0) {
      return <div data-testid="form-errors" />;
    }

    return (
      <div data-testid="form-errors">
        <div>
          <h3>Please fix the following errors:</h3>
          <div>
            <ul>
              {errorKeys.map((key: string) => {
                const error = errors[key];
                const message = error?.message;
                return (
                  <li key={key}>
                    {typeof message === 'string'
                      ? message
                      : `Invalid value for ${key}`}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  },
}));

describe('RecipeForm', () => {
  let queryClient: QueryClient;
  let mockFormHook: any;

  const mockRecipeDto: RecipeDto = {
    recipeId: 1,
    userId: 'user-123',
    title: 'Test Recipe',
    description: 'A test recipe',
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
        duration: 5,
        order: 1,
      },
    ],
    tags: [
      {
        tagId: 1,
        name: 'easy',
        category: 'difficulty',
      },
    ],
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockFormHook = {
      form: {
        watch: jest.fn((field?: string) => {
          const data = {
            ingredients: [
              {
                name: '',
                quantity: 1,
                unit: IngredientUnit.UNIT,
                notes: '',
              },
            ],
            steps: [
              {
                stepNumber: 1,
                instruction: '',
                duration: undefined,
              },
            ],
            tags: [],
          };
          return field ? data[field as keyof typeof data] : data;
        }),
        handleSubmit: jest.fn(callback => (e: any) => {
          e?.preventDefault();
          callback({
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
                notes: '',
              },
            ],
            steps: [
              {
                stepNumber: 1,
                instruction: 'Mix ingredients together',
                duration: 5,
              },
            ],
            tags: ['easy'],
          });
        }),
        formState: {
          errors: {},
          isValid: true,
          isDirty: false,
          isSubmitting: false,
        },
        setValue: jest.fn(),
        clearErrors: jest.fn(),
        trigger: jest.fn(),
        reset: jest.fn(),
      },
      handleSubmit: jest.fn(e => e?.preventDefault()),
      resetForm: jest.fn(),
      isSubmitting: false,
      hasErrors: false,
      isValid: true,
      hasChanges: false,
      addIngredient: jest.fn(),
      removeIngredient: jest.fn(),
      addStep: jest.fn(),
      removeStep: jest.fn(),
      addTag: jest.fn(),
      removeTag: jest.fn(),
    };

    // Mock the hooks
    const {
      useCreateRecipeForm,
      useEditRecipeForm,
      useUpdateRecipeForm,
    } = require('@/hooks/forms/useRecipeForm');
    useCreateRecipeForm.mockReturnValue(mockFormHook);
    useEditRecipeForm.mockReturnValue(mockFormHook);
    useUpdateRecipeForm.mockReturnValue(mockFormHook);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  describe('CreateRecipeForm', () => {
    it('should render create form with correct elements', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(
        screen.getByRole('heading', { name: 'Create Recipe' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/recipe title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prep time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cook time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/difficulty level/i)).toBeInTheDocument();
    });

    it('should show ingredients section for create mode', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add ingredient/i })
      ).toBeInTheDocument();
    });

    it('should show steps section for create mode', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add step/i })
      ).toBeInTheDocument();
    });

    it('should show tags section for create mode', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add tag/i })
      ).toBeInTheDocument();
    });

    it('should show reset button for create mode', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(
        screen.getByRole('button', { name: /reset/i })
      ).toBeInTheDocument();
    });

    it('should call addIngredient when add ingredient button is clicked', async () => {
      const user = userEvent.setup();

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      const addButton = screen.getByRole('button', { name: /add ingredient/i });
      await user.click(addButton);

      expect(mockFormHook.addIngredient).toHaveBeenCalled();
    });

    it('should call addStep when add step button is clicked', async () => {
      const user = userEvent.setup();

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      const addButton = screen.getByRole('button', { name: /add step/i });
      await user.click(addButton);

      expect(mockFormHook.addStep).toHaveBeenCalled();
    });
  });

  describe('EditRecipeForm', () => {
    it('should render edit form with correct elements', () => {
      renderWithQueryClient(
        <EditRecipeForm
          recipeId={1}
          initialData={mockRecipeDto}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(screen.getByText('Edit Recipe')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /update recipe/i })
      ).toBeInTheDocument();
    });

    it('should show ingredients and steps sections for edit mode', () => {
      renderWithQueryClient(
        <EditRecipeForm
          recipeId={1}
          initialData={mockRecipeDto}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });

    it('should not show reset button for edit mode', () => {
      renderWithQueryClient(
        <EditRecipeForm
          recipeId={1}
          initialData={mockRecipeDto}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.queryByRole('button', { name: /reset/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('UpdateRecipeForm', () => {
    it('should render update form with basic fields only', () => {
      // For update mode, ingredients/steps should not be shown
      mockFormHook.addIngredient = undefined;
      mockFormHook.addStep = undefined;
      mockFormHook.addTag = undefined;

      renderWithQueryClient(
        <UpdateRecipeForm
          recipeId={1}
          initialData={mockRecipeDto}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(screen.getByText('Update Recipe')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /save changes/i })
      ).toBeInTheDocument();

      // Should not show ingredients/steps/tags sections
      expect(screen.queryByText('Ingredients')).not.toBeInTheDocument();
      expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
      expect(screen.queryByText('Tags')).not.toBeInTheDocument();
    });
  });

  describe('Form Behavior', () => {
    it('should disable submit button when form is invalid', () => {
      mockFormHook.isValid = false;

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      const submitButton = screen.getByRole('button', {
        name: /create recipe/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state when submitting', () => {
      mockFormHook.isSubmitting = true;

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(
        screen.getByRole('button', { name: /creating.../i })
      ).toBeInTheDocument();
    });

    it('should disable reset button when form has no changes', () => {
      mockFormHook.hasChanges = false;

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeDisabled();
    });

    it('should call resetForm when reset button is clicked', async () => {
      const user = userEvent.setup();
      mockFormHook.hasChanges = true;

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      const resetButton = screen.getByRole('button', { name: /reset/i });
      await user.click(resetButton);

      expect(mockFormHook.resetForm).toHaveBeenCalled();
    });

    it('should show confirmation dialog when canceling with changes', async () => {
      const user = userEvent.setup();
      mockFormHook.hasChanges = true;

      // Mock window.confirm
      const mockConfirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
      const mockOnCancel = jest.fn();

      renderWithQueryClient(
        <CreateRecipeForm
          onSuccess={jest.fn()}
          onError={jest.fn()}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockConfirm).toHaveBeenCalledWith(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      expect(mockOnCancel).toHaveBeenCalled();

      mockConfirm.mockRestore();
    });
  });

  describe('Custom Props', () => {
    it('should render without card wrapper when showCard is false', () => {
      renderWithQueryClient(
        <CreateRecipeForm
          onSuccess={jest.fn()}
          onError={jest.fn()}
          showCard={false}
          title="Custom Title"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      // Card elements should not be present
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = renderWithQueryClient(
        <CreateRecipeForm
          onSuccess={jest.fn()}
          onError={jest.fn()}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should use custom title', () => {
      renderWithQueryClient(
        <CreateRecipeForm
          onSuccess={jest.fn()}
          onError={jest.fn()}
          title="My Custom Recipe Form"
        />
      );

      expect(screen.getByText('My Custom Recipe Form')).toBeInTheDocument();
    });
  });

  describe('Form Validation Display', () => {
    it('should display form errors when present', () => {
      mockFormHook.form.formState.errors = {
        title: { message: 'Title is required' },
        servings: { message: 'Servings must be positive' },
      };
      mockFormHook.hasErrors = true;

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(
        screen.getByText('Please fix the following errors:')
      ).toBeInTheDocument();
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Servings must be positive')).toBeInTheDocument();
    });
  });

  describe('Tag Management', () => {
    it('should handle tag input and addition', async () => {
      const user = userEvent.setup();

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      // Find the tag input (it's a special case with manual form handling)
      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      const addTagButton = screen.getByRole('button', { name: /add tag/i });

      // Initially, add tag button should be disabled
      expect(addTagButton).toBeDisabled();

      // Type in tag input
      await user.type(tagInput, 'vegetarian');

      // Button should now be enabled
      expect(addTagButton).not.toBeDisabled();

      // Click add tag
      await user.click(addTagButton);

      expect(mockFormHook.addTag).toHaveBeenCalledWith('vegetarian');
    });

    it('should display existing tags with remove buttons', () => {
      // Mock tags in form state
      mockFormHook.form.watch.mockImplementation((field?: string) => {
        const data = {
          ingredients: [],
          steps: [],
          tags: ['vegetarian', 'quick'],
        };
        return field ? data[field as keyof typeof data] : data;
      });

      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      expect(screen.getByText('vegetarian')).toBeInTheDocument();
      expect(screen.getByText('quick')).toBeInTheDocument();

      // Each tag should have a remove button
      const removeButtons = screen.getAllByText('×');
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels and structure', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      // Check for proper labeling
      expect(screen.getByLabelText(/recipe title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/servings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/difficulty level/i)).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      renderWithQueryClient(
        <CreateRecipeForm onSuccess={jest.fn()} onError={jest.fn()} />
      );

      // Check for proper heading hierarchy
      expect(
        screen.getByRole('heading', { name: 'Create Recipe' })
      ).toBeInTheDocument();
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
    });
  });
});
