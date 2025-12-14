import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeViewPage } from '@/components/recipe/view/RecipeViewPage';
import {
  useRecipeWithDetails,
  useIsRecipeFavorited,
  useFavoriteRecipe,
  useUnfavoriteRecipe,
} from '@/hooks/recipe-management';
import { useAuthStore } from '@/stores/auth-store';
import { useToastStore } from '@/stores/ui/toast-store';
import { useSessionStorage } from '@/hooks/use-session-storage';
import type { RecipeDto } from '@/types/recipe-management/recipe';
import type { RecipeIngredientDto } from '@/types/recipe-management/ingredient';
import type { RecipeStepDto } from '@/types/recipe-management/step';
import type { RecipeTagDto } from '@/types/recipe-management/tag';
import type { ReviewDto } from '@/types/recipe-management/review';
import {
  DifficultyLevel,
  IngredientUnit,
} from '@/types/recipe-management/common';

// Mock Next.js router
const mockRouterBack = jest.fn();
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    back: mockRouterBack,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock hooks - mock the entire barrel export
jest.mock('@/hooks/recipe-management', () => ({
  useRecipeWithDetails: jest.fn(),
  useIsRecipeFavorited: jest.fn(),
  useFavoriteRecipe: jest.fn(),
  useUnfavoriteRecipe: jest.fn(),
}));

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/stores/ui/toast-store', () => ({
  useToastStore: jest.fn(),
}));

jest.mock('@/hooks/use-session-storage', () => ({
  useSessionStorage: jest.fn(),
}));

// Mock ReviewModal component
jest.mock('@/components/recipe/view/ReviewModal', () => ({
  ReviewModal: ({
    open,
    recipeId,
    existingReview,
  }: {
    open: boolean;
    recipeId: number;
    existingReview?: ReviewDto;
  }) =>
    open ? (
      <div data-testid="review-modal">
        <span data-testid="modal-recipe-id">{recipeId}</span>
        {existingReview && <span data-testid="modal-edit-mode">edit</span>}
      </div>
    ) : null,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronRight: () => <span data-testid="chevron-right">›</span>,
  Home: () => <span data-testid="home-icon">Home</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Users: () => <span data-testid="users-icon">Users</span>,
  ChefHat: () => <span data-testid="chef-icon">Chef</span>,
  Heart: () => <span data-testid="heart-icon">Heart</span>,
  Share2: () => <span data-testid="share-icon">Share</span>,
  Bookmark: () => <span data-testid="bookmark-icon">Bookmark</span>,
  Star: () => <span data-testid="star-icon">Star</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
  Minus: () => <span data-testid="minus-icon">-</span>,
  Plus: () => <span data-testid="plus-icon">+</span>,
}));

// Sample data
const mockRecipe: RecipeDto = {
  recipeId: 1,
  userId: 'user-123',
  title: 'Delicious Pasta',
  description: 'A wonderful pasta recipe',
  servings: 4,
  preparationTime: 15,
  cookingTime: 30,
  difficulty: DifficultyLevel.MEDIUM,
  createdAt: '2024-01-01T10:00:00Z',
};

const mockIngredients: RecipeIngredientDto[] = [
  {
    recipeId: 1,
    ingredientId: 1,
    ingredientName: 'Pasta',
    quantity: 500,
    unit: IngredientUnit.G,
    isOptional: false,
  },
  {
    recipeId: 1,
    ingredientId: 2,
    ingredientName: 'Olive Oil',
    quantity: 2,
    unit: IngredientUnit.TBSP,
    isOptional: false,
  },
];

const mockSteps: RecipeStepDto[] = [
  {
    stepId: 1,
    recipeId: 1,
    stepNumber: 1,
    instruction: 'Boil water in a large pot',
    optional: false,
    timerSeconds: 600,
  },
  {
    stepId: 2,
    recipeId: 1,
    stepNumber: 2,
    instruction: 'Add pasta and cook until al dente',
    optional: false,
  },
];

const mockTags: RecipeTagDto[] = [
  { tagId: 1, name: 'Italian' },
  { tagId: 2, name: 'Quick' },
];

const mockReviews: ReviewDto[] = [
  {
    reviewId: 1,
    recipeId: 1,
    userId: 'reviewer-1',
    rating: 5,
    comment: 'Amazing recipe!',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    reviewId: 2,
    recipeId: 1,
    userId: 'reviewer-2',
    rating: 4,
    createdAt: '2024-01-20T10:00:00Z',
  },
];

describe('RecipeViewPage', () => {
  let mockAddSuccessToast: jest.Mock;
  let mockAddErrorToast: jest.Mock;
  let mockFavoriteMutate: jest.Mock;
  let mockUnfavoriteMutate: jest.Mock;
  let mockSetScaledServings: jest.Mock;
  let mockSetCheckedIngredients: jest.Mock;
  let mockSetCompletedSteps: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock toast store
    mockAddSuccessToast = jest.fn();
    mockAddErrorToast = jest.fn();
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      addSuccessToast: mockAddSuccessToast,
      addErrorToast: mockAddErrorToast,
    });

    // Mock auth store
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      authUser: { user_id: 'current-user' },
      isAuthenticated: true,
    });

    // Mock session storage
    mockSetScaledServings = jest.fn();
    mockSetCheckedIngredients = jest.fn();
    mockSetCompletedSteps = jest.fn();

    (useSessionStorage as jest.Mock).mockImplementation(
      (key: string, initialValue: unknown) => {
        if (key.includes('servings')) {
          return [4, mockSetScaledServings];
        }
        if (key.includes('checked-ingredients')) {
          return [new Set(), mockSetCheckedIngredients];
        }
        if (key.includes('completed-steps')) {
          return [new Set(), mockSetCompletedSteps];
        }
        return [initialValue, jest.fn()];
      }
    );

    // Mock favorite hooks
    (useIsRecipeFavorited as jest.Mock).mockReturnValue({
      data: false,
      isLoading: false,
    });

    mockFavoriteMutate = jest.fn().mockResolvedValue({});
    mockUnfavoriteMutate = jest.fn().mockResolvedValue({});

    (useFavoriteRecipe as jest.Mock).mockReturnValue({
      mutateAsync: mockFavoriteMutate,
      isPending: false,
    });

    (useUnfavoriteRecipe as jest.Mock).mockReturnValue({
      mutateAsync: mockUnfavoriteMutate,
      isPending: false,
    });

    // Mock recipe with details - success state
    // Data must be wrapped in response format expected by the component
    (useRecipeWithDetails as jest.Mock).mockReturnValue({
      recipe: { data: mockRecipe, isLoading: false, isError: false },
      ingredients: {
        data: { recipeId: 1, ingredients: mockIngredients },
        isLoading: false,
        isError: false,
      },
      steps: {
        data: { recipeId: 1, steps: mockSteps },
        isLoading: false,
        isError: false,
      },
      tags: {
        data: { tags: mockTags },
        isLoading: false,
        isError: false,
      },
      reviews: {
        data: { reviews: mockReviews },
        isLoading: false,
        isError: false,
      },
      media: { data: [], isLoading: false, isError: false },
      isLoading: false,
      hasError: false,
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when loading', () => {
      (useRecipeWithDetails as jest.Mock).mockReturnValue({
        recipe: { data: null, isLoading: true, isError: false },
        ingredients: { data: null, isLoading: true, isError: false },
        steps: { data: null, isLoading: true, isError: false },
        tags: { data: null, isLoading: true, isError: false },
        reviews: { data: null, isLoading: true, isError: false },
        media: { data: null, isLoading: true, isError: false },
        isLoading: true,
        hasError: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      // Multiple skeleton elements have role="status", check for container
      const statusElements = screen.getAllByRole('status');
      expect(statusElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Loading recipe details...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should render error state when recipe fails to load', () => {
      (useRecipeWithDetails as jest.Mock).mockReturnValue({
        recipe: { data: null, isLoading: false, isError: true },
        ingredients: { data: null, isLoading: false, isError: false },
        steps: { data: null, isLoading: false, isError: false },
        tags: { data: null, isLoading: false, isError: false },
        reviews: { data: null, isLoading: false, isError: false },
        media: { data: null, isLoading: false, isError: false },
        isLoading: false,
        hasError: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('Failed to load recipe')).toBeInTheDocument();
      expect(screen.getByText(/could not be found/)).toBeInTheDocument();
    });

    it('should have Go Back button that navigates back', async () => {
      (useRecipeWithDetails as jest.Mock).mockReturnValue({
        recipe: { data: null, isLoading: false, isError: true },
        ingredients: { data: null, isLoading: false, isError: false },
        steps: { data: null, isLoading: false, isError: false },
        tags: { data: null, isLoading: false, isError: false },
        reviews: { data: null, isLoading: false, isError: false },
        media: { data: null, isLoading: false, isError: false },
        isLoading: false,
        hasError: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      const goBackButton = screen.getByRole('button', { name: /go back/i });
      await userEvent.click(goBackButton);

      expect(mockRouterBack).toHaveBeenCalled();
    });
  });

  describe('Success State - Header', () => {
    it('should render recipe title', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('heading', { name: 'Delicious Pasta' })
      ).toBeInTheDocument();
    });

    it('should render breadcrumb navigation', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('link', { name: /recipes/i })
      ).toBeInTheDocument();
      // Title appears in both breadcrumb and heading
      expect(
        screen.getAllByText('Delicious Pasta').length
      ).toBeGreaterThanOrEqual(1);
    });

    it('should render metadata badges', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText(/Prep: 15 min/)).toBeInTheDocument();
      expect(screen.getByText(/Cook: 30 min/)).toBeInTheDocument();
      expect(screen.getByText('4 servings')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });

    it('should render description', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('A wonderful pasta recipe')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('button', { name: /add to favorites/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /share recipe/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /save to collection/i })
      ).toBeInTheDocument();
    });
  });

  describe('Ingredients Section', () => {
    it('should render ingredients heading', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('heading', { name: 'Ingredients' })
      ).toBeInTheDocument();
    });

    it('should render all ingredients', () => {
      const { container } = render(<RecipeViewPage recipeId={1} />);

      // Check that ingredient content is rendered
      expect(container.textContent).toContain('500');
      expect(container.textContent).toContain('Pasta');
      expect(container.textContent).toContain('Olive Oil');
    });

    it('should render servings scaler', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('Servings')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /decrease servings/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /increase servings/i })
      ).toBeInTheDocument();
    });

    it('should toggle ingredient checked state when clicked', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const ingredientButton = screen.getByRole('button', {
        name: /500.*g.*Pasta/i,
      });
      await userEvent.click(ingredientButton);

      expect(mockSetCheckedIngredients).toHaveBeenCalled();
    });

    it('should call setScaledServings when increasing servings', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const increaseButton = screen.getByRole('button', {
        name: /increase servings/i,
      });
      await userEvent.click(increaseButton);

      expect(mockSetScaledServings).toHaveBeenCalled();
    });

    it('should call setScaledServings when decreasing servings', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const decreaseButton = screen.getByRole('button', {
        name: /decrease servings/i,
      });
      await userEvent.click(decreaseButton);

      expect(mockSetScaledServings).toHaveBeenCalled();
    });
  });

  describe('Instructions Section', () => {
    it('should render instructions heading', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('heading', { name: 'Instructions' })
      ).toBeInTheDocument();
    });

    it('should render all steps', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('Boil water in a large pot')).toBeInTheDocument();
      expect(
        screen.getByText('Add pasta and cook until al dente')
      ).toBeInTheDocument();
    });

    it('should render timer for steps with timerSeconds', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('10 min')).toBeInTheDocument();
    });

    it('should toggle step completion when clicked', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const stepButton = screen.getByRole('button', { name: /mark step 1/i });
      await userEvent.click(stepButton);

      expect(mockSetCompletedSteps).toHaveBeenCalled();
    });
  });

  describe('Tags Section', () => {
    it('should render tags heading', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByRole('heading', { name: 'Tags' })).toBeInTheDocument();
    });

    it('should render all tags as links', () => {
      render(<RecipeViewPage recipeId={1} />);

      const italianTag = screen.getByRole('link', { name: 'Italian' });
      const quickTag = screen.getByRole('link', { name: 'Quick' });

      expect(italianTag).toHaveAttribute('href', '/recipes?tag=Italian');
      expect(quickTag).toHaveAttribute('href', '/recipes?tag=Quick');
    });

    it('should not render tags section when no tags', () => {
      (useRecipeWithDetails as jest.Mock).mockReturnValue({
        recipe: { data: mockRecipe, isLoading: false, isError: false },
        ingredients: {
          data: { recipeId: 1, ingredients: mockIngredients },
          isLoading: false,
          isError: false,
        },
        steps: {
          data: { recipeId: 1, steps: mockSteps },
          isLoading: false,
          isError: false,
        },
        tags: {
          data: { tags: [] },
          isLoading: false,
          isError: false,
        },
        reviews: {
          data: { reviews: mockReviews },
          isLoading: false,
          isError: false,
        },
        media: { data: [], isLoading: false, isError: false },
        isLoading: false,
        hasError: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.queryByRole('heading', { name: 'Tags' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Reviews Section', () => {
    it('should render reviews heading with count', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('heading', { name: /Reviews \(2\)/i })
      ).toBeInTheDocument();
    });

    it('should render average rating', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText(/Based on 2 reviews/)).toBeInTheDocument();
    });

    it('should render individual reviews', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText('Amazing recipe!')).toBeInTheDocument();
    });

    it('should render empty state when no reviews', () => {
      (useRecipeWithDetails as jest.Mock).mockReturnValue({
        recipe: { data: mockRecipe, isLoading: false, isError: false },
        ingredients: {
          data: { recipeId: 1, ingredients: mockIngredients },
          isLoading: false,
          isError: false,
        },
        steps: {
          data: { recipeId: 1, steps: mockSteps },
          isLoading: false,
          isError: false,
        },
        tags: {
          data: { tags: mockTags },
          isLoading: false,
          isError: false,
        },
        reviews: {
          data: { reviews: [] },
          isLoading: false,
          isError: false,
        },
        media: { data: [], isLoading: false, isError: false },
        isLoading: false,
        hasError: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(screen.getByText(/No reviews yet/)).toBeInTheDocument();
    });

    it('should show Write a Review button for authenticated non-owner', () => {
      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.getByRole('button', { name: /Write a Review/i })
      ).toBeInTheDocument();
    });

    it('should hide Write a Review button for recipe owner', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: { user_id: 'user-123' }, // Same as recipe owner (mockRecipe.userId)
        isAuthenticated: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(
        screen.queryByRole('button', { name: /Write a Review/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Favorite Functionality', () => {
    it('should call favorite mutation when clicking unfavorited heart', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const favoriteButton = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      await userEvent.click(favoriteButton);

      await waitFor(() => {
        expect(mockFavoriteMutate).toHaveBeenCalledWith(1);
      });
    });

    it('should call unfavorite mutation when clicking favorited heart', async () => {
      (useIsRecipeFavorited as jest.Mock).mockReturnValue({
        data: true,
        isLoading: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      const favoriteButton = screen.getByRole('button', {
        name: /remove from favorites/i,
      });
      await userEvent.click(favoriteButton);

      await waitFor(() => {
        expect(mockUnfavoriteMutate).toHaveBeenCalledWith(1);
      });
    });

    it('should show error toast when not authenticated', async () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: null,
        isAuthenticated: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      const favoriteButton = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      await userEvent.click(favoriteButton);

      expect(mockAddErrorToast).toHaveBeenCalledWith(
        'Please sign in to favorite recipes'
      );
    });

    it('should show success toast when favoriting', async () => {
      render(<RecipeViewPage recipeId={1} />);

      const favoriteButton = screen.getByRole('button', {
        name: /add to favorites/i,
      });
      await userEvent.click(favoriteButton);

      await waitFor(() => {
        expect(mockAddSuccessToast).toHaveBeenCalledWith(
          'Recipe added to favorites'
        );
      });
    });
  });

  describe('Share Functionality', () => {
    it('should copy link when share is not supported', async () => {
      // Mock clipboard API
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
        share: undefined,
      });

      render(<RecipeViewPage recipeId={1} />);

      const shareButton = screen.getByRole('button', { name: /share recipe/i });
      await userEvent.click(shareButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled();
        expect(mockAddSuccessToast).toHaveBeenCalledWith(
          'Link copied to clipboard'
        );
      });
    });
  });

  describe('Props', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <RecipeViewPage recipeId={1} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Review Modal', () => {
    it('should show Write a Review button for authenticated non-owner', () => {
      render(<RecipeViewPage recipeId={1} />);

      const reviewButton = screen.getByTestId('review-button');
      expect(reviewButton).toHaveTextContent('Write a Review');
    });

    it('should not show review button for recipe owner', () => {
      // Set current user as the recipe owner
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: { user_id: 'user-123' }, // Same as mockRecipe.userId
        isAuthenticated: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(screen.queryByTestId('review-button')).not.toBeInTheDocument();
    });

    it('should not show review button for unauthenticated users', () => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: null,
        isAuthenticated: false,
      });

      render(<RecipeViewPage recipeId={1} />);

      expect(screen.queryByTestId('review-button')).not.toBeInTheDocument();
    });

    it('should show Edit Review button when user has existing review', () => {
      // Set current user to be one of the reviewers
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: { user_id: 'reviewer-1' }, // Same as mockReviews[0].userId
        isAuthenticated: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      const reviewButton = screen.getByTestId('review-button');
      expect(reviewButton).toHaveTextContent('Edit Review');
    });

    it('should open review modal when button is clicked', async () => {
      render(<RecipeViewPage recipeId={1} />);

      // Modal should not be visible initially
      expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();

      // Click the review button
      const reviewButton = screen.getByTestId('review-button');
      await userEvent.click(reviewButton);

      // Modal should now be visible
      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-recipe-id')).toHaveTextContent('1');
    });

    it('should open modal in edit mode when user has existing review', async () => {
      // Set current user to be one of the reviewers
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        authUser: { user_id: 'reviewer-1' },
        isAuthenticated: true,
      });

      render(<RecipeViewPage recipeId={1} />);

      const reviewButton = screen.getByTestId('review-button');
      await userEvent.click(reviewButton);

      // Modal should be in edit mode
      expect(screen.getByTestId('review-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-edit-mode')).toBeInTheDocument();
    });
  });
});
