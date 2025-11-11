import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RecipeQuickActions } from '@/components/recipe/RecipeQuickActions';
import { DifficultyLevel } from '@/types/recipe-management/common';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import { useToastStore } from '@/stores/ui/toast-store';
import {
  useFavoriteRecipe,
  useUnfavoriteRecipe,
  useIsRecipeFavorited,
} from '@/hooks/recipe-management/useFavorites';
import { useCollections } from '@/hooks/recipe-management/useCollections';
import { useAddRecipeToCollection } from '@/hooks/recipe-management/useCollectionRecipes';
import { useCreateCollection } from '@/hooks/recipe-management/useCollections';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share-icon">Share2</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  MoreVertical: () => <div data-testid="more-icon">MoreVertical</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  ChefHat: () => <div data-testid="chef-hat-icon">ChefHat</div>,
  Info: () => <div data-testid="info-icon">Info</div>,
  Link: () => <div data-testid="link-icon">Link</div>,
  X: () => <div data-testid="x-icon">X</div>,
  FolderPlus: () => <div data-testid="folder-plus-icon">FolderPlus</div>,
  CheckCircle2: () => <div data-testid="check-circle-icon">CheckCircle2</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
}));

// Mock stores and hooks
jest.mock('@/stores/ui/toast-store');
jest.mock('@/hooks/recipe-management/useFavorites');
jest.mock('@/hooks/recipe-management/useCollections');
jest.mock('@/hooks/recipe-management/useCollectionRecipes');

// Sample recipe data
const mockRecipe: RecipeCardRecipe = {
  recipeId: 1,
  title: 'Test Recipe',
  description: 'A test recipe description',
  imageUrl: 'https://example.com/image.jpg',
  servings: 4,
  preparationTime: 10,
  cookingTime: 20,
  difficulty: DifficultyLevel.EASY,
  rating: 4.5,
  reviewCount: 100,
  isFavorite: false,
  createdAt: '2024-01-01T10:00:00Z',
};

describe('RecipeQuickActions', () => {
  let mockAddSuccessToast: jest.Mock;
  let mockAddErrorToast: jest.Mock;
  let mockFavoriteMutate: jest.Mock;
  let mockUnfavoriteMutate: jest.Mock;
  let mockAddToCollectionMutate: jest.Mock;
  let mockCreateCollectionMutate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock toast store
    mockAddSuccessToast = jest.fn();
    mockAddErrorToast = jest.fn();
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      addSuccessToast: mockAddSuccessToast,
      addErrorToast: mockAddErrorToast,
    });

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

    // Mock collections hooks
    (useCollections as jest.Mock).mockReturnValue({
      data: {
        content: [],
        page: 0,
        size: 50,
        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
      },
      isLoading: false,
      isError: false,
    });

    mockAddToCollectionMutate = jest.fn().mockResolvedValue({});
    mockCreateCollectionMutate = jest.fn().mockResolvedValue({
      collectionId: 1,
      name: 'New Collection',
    });

    (useAddRecipeToCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockAddToCollectionMutate,
      isPending: false,
    });

    (useCreateCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateCollectionMutate,
      isPending: false,
    });
  });

  describe('Rendering', () => {
    it('should render quick actions toolbar', () => {
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const toolbar = screen.getByRole('toolbar', {
        name: /recipe quick actions/i,
      });
      expect(toolbar).toBeInTheDocument();
    });

    it('should render all action buttons by default', () => {
      render(<RecipeQuickActions recipe={mockRecipe} />);

      // Check for action buttons (they have aria-label attributes)
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should not render when no actions available', () => {
      // If somehow no actions are built (edge case)
      const { container } = render(
        <RecipeQuickActions recipe={mockRecipe} handlers={{}} />
      );

      // Should still render because all handlers have default behavior
      expect(container.querySelector('[role="toolbar"]')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <RecipeQuickActions recipe={mockRecipe} className="custom-class" />
      );

      const toolbar = container.querySelector('.custom-class');
      expect(toolbar).toBeInTheDocument();
    });

    it('should render at different positions', () => {
      const positions = [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
      ] as const;

      positions.forEach(position => {
        const { unmount } = render(
          <RecipeQuickActions recipe={mockRecipe} position={position} />
        );

        const toolbar = screen.getByRole('toolbar');
        expect(toolbar).toBeInTheDocument();
        unmount();
      });
    });

    it('should render with different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { unmount } = render(
          <RecipeQuickActions recipe={mockRecipe} size={size} />
        );

        const toolbar = screen.getByRole('toolbar');
        expect(toolbar).toBeInTheDocument();
        unmount();
      });
    });

    it('should render with custom maxVisible prop', () => {
      render(<RecipeQuickActions recipe={mockRecipe} maxVisible={2} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('should render with custom ARIA label', () => {
      render(
        <RecipeQuickActions
          recipe={mockRecipe}
          aria-label="Custom actions label"
        />
      );

      const toolbar = screen.getByRole('toolbar', {
        name: /custom actions label/i,
      });
      expect(toolbar).toBeInTheDocument();
    });
  });

  describe('Favorite Action', () => {
    it('should show "Favorite" label when recipe is not favorited', async () => {
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should show "Unfavorite" label when recipe is favorited', async () => {
      (useIsRecipeFavorited as jest.Mock).mockReturnValue({
        data: true,
        isLoading: false,
      });

      render(<RecipeQuickActions recipe={mockRecipe} />);

      const unfavoriteButton = screen.getByRole('button', {
        name: /unfavorite/i,
      });
      expect(unfavoriteButton).toBeInTheDocument();
    });

    it('should favorite recipe when favorite button is clicked', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      await user.click(favoriteButton);

      await waitFor(() => {
        expect(mockFavoriteMutate).toHaveBeenCalledWith(mockRecipe.recipeId);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        `Added "${mockRecipe.title}" to favorites`,
        { duration: 3000 }
      );
    });

    it('should unfavorite recipe when unfavorite button is clicked', async () => {
      const user = userEvent.setup();

      (useIsRecipeFavorited as jest.Mock).mockReturnValue({
        data: true,
        isLoading: false,
      });

      render(<RecipeQuickActions recipe={mockRecipe} />);

      const unfavoriteButton = screen.getByRole('button', {
        name: /unfavorite/i,
      });
      await user.click(unfavoriteButton);

      await waitFor(() => {
        expect(mockUnfavoriteMutate).toHaveBeenCalledWith(mockRecipe.recipeId);
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        `Removed "${mockRecipe.title}" from favorites`,
        { duration: 3000 }
      );
    });

    it('should show error toast when favorite action fails', async () => {
      const user = userEvent.setup();
      mockFavoriteMutate.mockRejectedValue(new Error('Network error'));

      render(<RecipeQuickActions recipe={mockRecipe} />);

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      await user.click(favoriteButton);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith('Network error', {
          duration: 5000,
        });
      });
    });

    it('should call custom onFavorite handler when provided', async () => {
      const user = userEvent.setup();
      const onFavorite = jest.fn();

      render(
        <RecipeQuickActions recipe={mockRecipe} handlers={{ onFavorite }} />
      );

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      await user.click(favoriteButton);

      await waitFor(() => {
        expect(onFavorite).toHaveBeenCalledWith(mockRecipe);
        expect(mockFavoriteMutate).not.toHaveBeenCalled();
      });
    });

    it('should disable favorite button when mutation is pending', () => {
      (useFavoriteRecipe as jest.Mock).mockReturnValue({
        mutateAsync: mockFavoriteMutate,
        isPending: true,
      });

      render(<RecipeQuickActions recipe={mockRecipe} />);

      const favoriteButton = screen.getByRole('button', { name: /favorite/i });
      expect(favoriteButton).toBeDisabled();
    });
  });

  describe('Share Action', () => {
    it('should open share modal when share is clicked without handler', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      // Modal should open - check for modal title
      await waitFor(() => {
        expect(screen.getByText('Share Recipe')).toBeInTheDocument();
      });
    });

    it('should call custom onShare handler when provided', async () => {
      const user = userEvent.setup();
      const onShare = jest.fn();

      render(<RecipeQuickActions recipe={mockRecipe} handlers={{ onShare }} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      await waitFor(() => {
        expect(onShare).toHaveBeenCalledWith(mockRecipe);
      });
    });

    it('should display recipe info in share modal', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      await waitFor(() => {
        expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
      });
    });

    it('should close share modal when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      // Open modal
      const shareButton = screen.getByRole('button', { name: /share/i });
      await user.click(shareButton);

      await waitFor(() => {
        expect(screen.getByText('Share Recipe')).toBeInTheDocument();
      });

      // Close modal - there are multiple close buttons (X and footer Close button)
      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      await user.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Share Recipe')).not.toBeInTheDocument();
      });
    });
  });

  describe('Add to Collection Action', () => {
    it('should open add to collection modal when clicked', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(
          screen.getByText(/Add "Test Recipe" to a collection/i)
        ).toBeInTheDocument();
      });
    });

    it('should call custom onAddToCollection handler when provided', async () => {
      const user = userEvent.setup();
      const onAddToCollection = jest.fn();

      render(
        <RecipeQuickActions
          recipe={mockRecipe}
          handlers={{ onAddToCollection }}
        />
      );

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      await user.click(addButton);

      await waitFor(() => {
        expect(onAddToCollection).toHaveBeenCalledWith(mockRecipe);
      });

      // Modal should not open when custom handler is provided
      expect(screen.queryByText('Add to Collection')).not.toBeInTheDocument();
    });

    it('should display recipe in add to collection modal', async () => {
      const user = userEvent.setup();
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      await user.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Add "Test Recipe" to a collection/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Quick View Action', () => {
    it('should call custom onQuickView handler when provided', async () => {
      const user = userEvent.setup();
      const onQuickView = jest.fn();

      render(
        <RecipeQuickActions
          recipe={mockRecipe}
          handlers={{ onQuickView }}
          maxVisible={4}
        />
      );

      const quickViewButton = screen.getByRole('button', {
        name: /quick view/i,
      });
      await user.click(quickViewButton);

      await waitFor(() => {
        expect(onQuickView).toHaveBeenCalledWith(mockRecipe);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle recipe without image', async () => {
      const recipeWithoutImage = { ...mockRecipe, imageUrl: undefined };
      render(<RecipeQuickActions recipe={recipeWithoutImage} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('should handle recipe without rating', async () => {
      const recipeWithoutRating = { ...mockRecipe, rating: undefined };
      render(<RecipeQuickActions recipe={recipeWithoutRating} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('should handle recipe with minimal data', async () => {
      const minimalRecipe: RecipeCardRecipe = {
        recipeId: 999,
        title: 'Minimal Recipe',
        servings: 1,
        createdAt: '2024-01-01T00:00:00Z',
      };

      render(<RecipeQuickActions recipe={minimalRecipe} />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('should handle multiple quick actions on same page', () => {
      const recipe1 = { ...mockRecipe, recipeId: 1 };
      const recipe2 = { ...mockRecipe, recipeId: 2 };

      const { container } = render(
        <>
          <RecipeQuickActions recipe={recipe1} />
          <RecipeQuickActions recipe={recipe2} />
        </>
      );

      const toolbars = container.querySelectorAll('[role="toolbar"]');
      expect(toolbars.length).toBe(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA label', () => {
      render(<RecipeQuickActions recipe={mockRecipe} />);

      const toolbar = screen.getByRole('toolbar', {
        name: /recipe quick actions/i,
      });
      expect(toolbar).toBeInTheDocument();
    });
  });
});
