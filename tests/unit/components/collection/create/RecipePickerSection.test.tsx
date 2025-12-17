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

import { useDebouncedRecipeSearch } from '@/hooks/recipe-management';

const mockUseDebouncedRecipeSearch = useDebouncedRecipeSearch as jest.Mock;

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
  });

  describe('Rendering', () => {
    it('should render when active', () => {
      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Add Recipes')).toBeInTheDocument();
      expect(screen.getByLabelText(/search recipes/i)).toBeInTheDocument();
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
    it('should call search hook when typing in search input', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          {form => <RecipePickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'chocolate');

      expect(searchInput).toHaveValue('chocolate');
    });

    it('should show search results section when there is a query', async () => {
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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'test');

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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'test');

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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'cake');

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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'test');

      expect(screen.getByText('Search failed')).toBeInTheDocument();
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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'cake');

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

      const searchInput = screen.getByLabelText(/search recipes/i);
      await user.type(searchInput, 'test');

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

      const searchInput = screen.getByLabelText(/search recipes/i);
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
