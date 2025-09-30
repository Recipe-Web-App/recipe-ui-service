import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  IngredientForm,
  CreateIngredientForm,
  EditIngredientForm,
} from '@/components/forms/IngredientForm';
import { IngredientUnit } from '@/types/recipe-management/common';
import type { RecipeIngredientDto } from '@/types/recipe-management';

// Mock the hooks since they depend on API calls
jest.mock('@/hooks/forms/useIngredientForm', () => ({
  useCreateIngredientForm: jest.fn(),
  useEditIngredientForm: jest.fn(),
}));

// Mock API client
jest.mock('@/lib/api/recipe-management', () => ({
  ingredientsApi: {
    getRecipeIngredients: jest.fn(),
  },
}));

// Mock FormField components to avoid react-hook-form complexity
jest.mock('@/components/forms/FormField', () => ({
  FormInput: ({ label, name, ...props }: any) => (
    <div data-testid={`form-input-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
    </div>
  ),
  FormSelect: ({ label, name, options, ...props }: any) => (
    <div data-testid={`form-select-${name}`}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} {...props}>
        {options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
  FormCheckbox: ({ label, name, ...props }: any) => (
    <div data-testid={`form-checkbox-${name}`}>
      <label htmlFor={name}>
        <input id={name} type="checkbox" name={name} {...props} />
        {label}
      </label>
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

describe('IngredientForm', () => {
  let queryClient: QueryClient;
  let mockFormHook: any;

  const mockInitialData: RecipeIngredientDto = {
    ingredientId: 1,
    ingredientName: 'Salt',
    quantity: 1,
    unit: IngredientUnit.TSP,
    isOptional: false,
    recipeId: 123,
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
        handleSubmit: jest.fn(callback => (e: any) => {
          e?.preventDefault();
          callback({
            ingredientName: 'Test Ingredient',
            quantity: 2,
            unit: IngredientUnit.CUP,
            isOptional: false,
          });
        }),
        formState: {
          errors: {},
          isValid: true,
          isDirty: false,
          isSubmitting: false,
        },
        watch: jest.fn(),
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
    };

    // Mock the hooks
    const {
      useCreateIngredientForm,
      useEditIngredientForm,
    } = require('@/hooks/forms/useIngredientForm');
    useCreateIngredientForm.mockReturnValue(mockFormHook);
    useEditIngredientForm.mockReturnValue(mockFormHook);
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

  describe('CreateIngredientForm', () => {
    it('should render create form with correct elements', () => {
      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.getByRole('heading', { name: 'Add Ingredient' })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/ingredient name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/optional ingredient/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add ingredient/i })
      ).toBeInTheDocument();
    });

    it('should show reset button for create mode', () => {
      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /reset/i })
      ).toBeInTheDocument();
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCancel = jest.fn();

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('EditIngredientForm', () => {
    it('should render edit form with correct elements', () => {
      renderWithQueryClient(
        <EditIngredientForm
          recipeId={123}
          initialData={mockInitialData}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(screen.getByText('Edit Ingredient')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /update ingredient/i })
      ).toBeInTheDocument();
    });

    it('should not show reset button for edit mode', () => {
      renderWithQueryClient(
        <EditIngredientForm
          recipeId={123}
          initialData={mockInitialData}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.queryByRole('button', { name: /reset/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Form Behavior', () => {
    it('should disable submit button when form is invalid', () => {
      mockFormHook.isValid = false;

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      const submitButton = screen.getByRole('button', {
        name: /add ingredient/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should show loading state when submitting', () => {
      mockFormHook.isSubmitting = true;

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.getByRole('button', { name: /adding.../i })
      ).toBeInTheDocument();
    });

    it('should disable reset button when form has no changes', () => {
      mockFormHook.hasChanges = false;

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeDisabled();
    });

    it('should call resetForm when reset button is clicked', async () => {
      const user = userEvent.setup();
      mockFormHook.hasChanges = true;

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
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
        <CreateIngredientForm
          recipeId={123}
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
        <CreateIngredientForm
          recipeId={123}
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
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should use custom title', () => {
      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
          title="My Custom Title"
        />
      );

      expect(screen.getByText('My Custom Title')).toBeInTheDocument();
    });
  });

  describe('Form Validation Display', () => {
    it('should display form errors when present', () => {
      mockFormHook.form.formState.errors = {
        ingredientName: { message: 'Name is required' },
        quantity: { message: 'Quantity must be positive' },
      };
      mockFormHook.hasErrors = true;

      renderWithQueryClient(
        <CreateIngredientForm
          recipeId={123}
          onSuccess={jest.fn()}
          onError={jest.fn()}
        />
      );

      expect(
        screen.getByText('Please fix the following errors:')
      ).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Quantity must be positive')).toBeInTheDocument();
    });
  });
});
