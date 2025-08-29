import { render, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { recipesApi } from '@/lib/api/recipes';
// Mock component for testing
const RecipeCreatePage = () => <div>Recipe Create Page</div>;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock API
jest.mock('@/lib/api/recipes');

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

const mockRecipesApi = recipesApi as jest.Mocked<typeof recipesApi>;

describe('Recipe Creation Workflow (Frontend Integration)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('should handle complete recipe creation workflow', async () => {
    // Mock successful API response
    const mockRecipe = {
      data: {
        id: '123',
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['flour', 'sugar'],
        instructions: ['Mix ingredients', 'Bake'],
        cookingTime: 30,
        servings: 4,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      success: true,
      message: 'Recipe created successfully',
    };

    mockRecipesApi.createRecipe.mockResolvedValue(mockRecipe);

    // This component doesn't exist yet, but shows the integration test pattern
    render(<RecipeCreatePage />);

    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    await user.type(screen.getByLabelText(/ingredients/i), 'flour, sugar');
    await user.type(
      screen.getByLabelText(/instructions/i),
      'Mix ingredients\\nBake'
    );
    await user.type(screen.getByLabelText(/cooking time/i), '30');
    await user.type(screen.getByLabelText(/servings/i), '4');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create recipe/i }));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockRecipesApi.createRecipe).toHaveBeenCalledWith({
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: ['flour', 'sugar'],
        instructions: ['Mix ingredients', 'Bake'],
        cookingTime: 30,
        servings: 4,
      });
    });

    // Verify success feedback and navigation
    await waitFor(() => {
      expect(
        screen.getByText(/recipe created successfully/i)
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/recipes/123');
    });
  });

  test('should handle form validation errors', async () => {
    render(<RecipeCreatePage />);

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /create recipe/i }));

    // Should show validation errors
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();

    // API should not be called
    expect(mockRecipesApi.createRecipe).not.toHaveBeenCalled();
  });

  test('should handle API errors gracefully', async () => {
    // Mock API error
    mockRecipesApi.createRecipe.mockRejectedValue(
      new Error('Recipe creation failed')
    );

    render(<RecipeCreatePage />);

    // Fill minimal form
    await user.type(screen.getByLabelText(/title/i), 'Test Recipe');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');

    // Submit form
    await user.click(screen.getByRole('button', { name: /create recipe/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to create recipe/i)).toBeInTheDocument();
    });

    // Should not navigate
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test('should allow adding and removing ingredients dynamically', async () => {
    render(<RecipeCreatePage />);

    // Add ingredients
    await user.click(screen.getByText(/add ingredient/i));
    await user.type(screen.getByLabelText(/ingredient 1/i), 'flour');

    await user.click(screen.getByText(/add ingredient/i));
    await user.type(screen.getByLabelText(/ingredient 2/i), 'sugar');

    // Remove first ingredient
    await user.click(screen.getAllByText(/remove/i)[0]);

    // Should only have sugar left
    expect(screen.getByDisplayValue('sugar')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('flour')).not.toBeInTheDocument();
  });
});
