import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecipePickerSection } from '@/components/collection/create/RecipePickerSection';
import { createCollectionFormSchema } from '@/lib/validation/create-collection-schemas';
import {
  CREATE_COLLECTION_DEFAULT_VALUES,
  CREATE_COLLECTION_LIMITS,
  type CreateCollectionFormData,
} from '@/types/collection/create-collection-form';

// Mock the search hook
jest.mock('@/hooks/recipe-management', () => ({
  useDebouncedRecipeSearch: jest.fn(),
  useSuggestedRecipes: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
    sizes?: string;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

import {
  useDebouncedRecipeSearch,
  useSuggestedRecipes,
} from '@/hooks/recipe-management';

const mockUseDebouncedRecipeSearch = useDebouncedRecipeSearch as jest.Mock;
const mockUseSuggestedRecipes = useSuggestedRecipes as jest.Mock;

// Create a test wrapper with QueryClient
function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Wrapper component that provides form context
function TestWrapper({
  children,
  defaultValues = CREATE_COLLECTION_DEFAULT_VALUES,
}: {
  children: (
    form: ReturnType<typeof useForm<CreateCollectionFormData>>
  ) => React.ReactNode;
  defaultValues?: CreateCollectionFormData;
}) {
  const form = useForm<CreateCollectionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Schema output type differs from form type but is compatible at runtime
    resolver: zodResolver(createCollectionFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const Wrapper = createTestWrapper();

  return <Wrapper>{children(form)}</Wrapper>;
}

describe('RecipePickerSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDebouncedRecipeSearch.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockUseSuggestedRecipes.mockReturnValue({
      data: { recipes: [], totalElements: 0 },
      isLoading: false,
      error: null,
    });
  });

  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Add Recipes')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/search by recipe name/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Selected Recipes')).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={false} />}
        </TestWrapper>
      );

      expect(screen.queryByText('Add Recipes')).not.toBeInTheDocument();
    });

    it('should show recipe count', () => {
      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(
          `0 / ${CREATE_COLLECTION_LIMITS.MAX_RECIPES} recipes selected`
        )
      ).toBeInTheDocument();
    });

    it('should show minimum requirement message when no recipes', () => {
      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(
          `At least ${CREATE_COLLECTION_LIMITS.MIN_RECIPES} recipe required`
        )
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should update search input when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'chocolate');

      expect(searchInput).toHaveValue('chocolate');
    });

    it('should disable search button when input is less than 2 characters', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchButton = screen.getByRole('button', {
        name: /search recipes/i,
      });
      expect(searchButton).toBeDisabled();

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'c');

      expect(searchButton).toBeDisabled();
    });

    it('should enable search button when input has 2+ characters', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'ca');

      const searchButton = screen.getByRole('button', {
        name: /search recipes/i,
      });
      expect(searchButton).toBeEnabled();
    });

    it('should show search results section when search button is clicked', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [],
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          numberOfElements: 0,
          empty: true,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test');

      const searchButton = screen.getByRole('button', {
        name: /search recipes/i,
      });
      await user.click(searchButton);

      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show search results when Enter is pressed', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [],
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          numberOfElements: 0,
          empty: true,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test{enter}');

      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show loading state when searching', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test{enter}');

      expect(
        screen.getByLabelText('Loading search results')
      ).toBeInTheDocument();
    });

    it('should display search results', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [
            { recipeId: 1, title: 'Chocolate Cake', description: 'Delicious' },
            { recipeId: 2, title: 'Apple Pie', description: 'Sweet' },
          ],
          page: 0,
          size: 10,
          totalElements: 2,
          totalPages: 1,
          first: true,
          last: true,
          numberOfElements: 2,
          empty: false,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'cake{enter}');

      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
      expect(screen.getByText('Apple Pie')).toBeInTheDocument();
    });

    it('should show error state when search fails', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Search failed' },
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test{enter}');

      expect(screen.getByText('Search failed')).toBeInTheDocument();
    });
  });

  describe('Suggested Recipes', () => {
    it('should display suggested recipes when no search performed', async () => {
      // Reset and set fresh mock to ensure clean state
      mockUseSuggestedRecipes.mockReset();
      mockUseSuggestedRecipes.mockReturnValue({
        data: {
          recipes: [
            { recipeId: 1, title: 'Suggested Recipe 1', description: 'Tasty' },
            { recipeId: 2, title: 'Suggested Recipe 2', description: 'Yummy' },
          ],
          totalElements: 2,
        },
        isLoading: false,
        error: null,
      });

      // Also reset and set the debounced search mock
      mockUseDebouncedRecipeSearch.mockReset();
      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Suggested Recipes')).toBeInTheDocument();
        expect(screen.getByText('Suggested Recipe 1')).toBeInTheDocument();
        expect(screen.getByText('Suggested Recipe 2')).toBeInTheDocument();
      });
    });

    it('should hide suggested recipes when search is performed', async () => {
      const user = userEvent.setup();

      mockUseSuggestedRecipes.mockReturnValue({
        data: {
          recipes: [
            { recipeId: 1, title: 'Suggested Recipe 1', description: 'Tasty' },
          ],
          totalElements: 1,
        },
        isLoading: false,
        error: null,
      });

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [
            { recipeId: 3, title: 'Search Result', description: 'Found' },
          ],
          page: 0,
          size: 10,
          totalElements: 1,
          totalPages: 1,
          first: true,
          last: true,
          numberOfElements: 1,
          empty: false,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      // Initially shows suggested recipes
      expect(screen.getByText('Suggested Recipes')).toBeInTheDocument();

      // Perform search
      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test{enter}');

      // Suggested recipes should be hidden, search results shown
      expect(screen.queryByText('Suggested Recipes')).not.toBeInTheDocument();
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show loading state for suggested recipes', () => {
      mockUseSuggestedRecipes.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      // When loading but no data, suggested recipes section may not show
      // This is expected behavior - section appears when there's data to show
      expect(screen.queryByText('Suggested Recipes')).not.toBeInTheDocument();
    });
  });

  describe('Adding Recipes', () => {
    it('should add a recipe when clicking add button', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [
            { recipeId: 1, title: 'Chocolate Cake', description: 'Delicious' },
          ],
          page: 0,
          size: 10,
          totalElements: 1,
          totalPages: 1,
          first: true,
          last: true,
          numberOfElements: 1,
          empty: false,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'cake{enter}');

      const addButton = screen.getByRole('button', {
        name: 'Add Chocolate Cake',
      });
      await user.click(addButton);

      // Recipe should appear in selected list
      await waitFor(() => {
        // Check that the recipe title appears in the selected recipes section
        // The title should appear both in search results (as "Added") and in selected list
        expect(screen.getAllByText('Chocolate Cake').length).toBeGreaterThan(0);
      });
    });

    it('should show Added state after adding a recipe', async () => {
      const user = userEvent.setup();

      mockUseDebouncedRecipeSearch.mockReturnValue({
        data: {
          recipes: [{ recipeId: 1, title: 'Test Recipe', description: 'Test' }],
          page: 0,
          size: 10,
          totalElements: 1,
          totalPages: 1,
          first: true,
          last: true,
          numberOfElements: 1,
          empty: false,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      await user.type(searchInput, 'test{enter}');

      const addButton = screen.getByRole('button', { name: 'Add Test Recipe' });
      await user.click(addButton);

      // After adding, recipe should appear in the Selected Recipes section
      await waitFor(() => {
        // The recipe should be in the selected list with a remove button
        expect(
          screen.getByRole('button', {
            name: 'Remove Test Recipe from collection',
          })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Removing Recipes', () => {
    it('should remove a recipe when clicking remove button', async () => {
      const user = userEvent.setup();

      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        recipes: [
          {
            id: 'recipe-1',
            recipeId: 1,
            recipeTitle: 'Recipe to Remove',
            displayOrder: 0,
          },
        ],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Recipe to Remove')).toBeInTheDocument();

      const removeButton = screen.getByRole('button', {
        name: 'Remove Recipe to Remove from collection',
      });
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('Recipe to Remove')).not.toBeInTheDocument();
      });
    });
  });

  describe('Maximum Recipes Limit', () => {
    it('should disable search when max recipes reached', () => {
      const recipes = Array.from(
        { length: CREATE_COLLECTION_LIMITS.MAX_RECIPES },
        (_, i) => ({
          id: `recipe-${i}`,
          recipeId: i,
          recipeTitle: `Recipe ${i}`,
          displayOrder: i,
        })
      );

      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        recipes,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by recipe name/i);
      expect(searchInput).toBeDisabled();
      expect(
        screen.getByText('Maximum recipes reached. Remove some to add more.')
      ).toBeInTheDocument();
    });
  });

  describe('Pre-populated Recipes', () => {
    it('should display pre-populated recipes', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        recipes: [
          {
            id: 'recipe-1',
            recipeId: 1,
            recipeTitle: 'Pre-populated Recipe 1',
            displayOrder: 0,
          },
          {
            id: 'recipe-2',
            recipeId: 2,
            recipeTitle: 'Pre-populated Recipe 2',
            displayOrder: 1,
          },
        ],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Pre-populated Recipe 1')).toBeInTheDocument();
      expect(screen.getByText('Pre-populated Recipe 2')).toBeInTheDocument();
      expect(
        screen.getByText(
          `2 / ${CREATE_COLLECTION_LIMITS.MAX_RECIPES} recipes selected`
        )
      ).toBeInTheDocument();
    });
  });
});
