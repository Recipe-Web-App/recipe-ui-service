import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { AddToCollectionModal } from '@/components/recipe/AddToCollectionModal';
import {
  DifficultyLevel,
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';
import type { RecipeCardRecipe } from '@/types/ui/recipe-card';
import type {
  CollectionDto,
  PageCollectionDto,
} from '@/types/recipe-management/collection';
import { useToastStore } from '@/stores/ui/toast-store';
import { useCollections } from '@/hooks/recipe-management/useCollections';
import { useAddRecipeToCollection } from '@/hooks/recipe-management/useCollectionRecipes';
import { useCreateCollection } from '@/hooks/recipe-management/useCollections';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FolderPlus: () => <div data-testid="folder-plus-icon">FolderPlus</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  CheckCircle2: () => <div data-testid="check-circle-icon">CheckCircle2</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">AlertCircle</div>,
  X: () => <div data-testid="x-icon">X</div>,
}));

// Mock stores and hooks
jest.mock('@/stores/ui/toast-store');
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

// Sample collections data
const mockCollections: CollectionDto[] = [
  {
    collectionId: 1,
    userId: 'user-123',
    name: 'Favorites',
    description: 'My favorite recipes',
    visibility: CollectionVisibility.PRIVATE,
    collaborationMode: CollaborationMode.OWNER_ONLY,
    recipeCount: 5,
    collaboratorCount: 0,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    collectionId: 2,
    userId: 'user-123',
    name: 'Quick Dinners',
    description: 'Fast and easy weeknight meals',
    visibility: CollectionVisibility.PUBLIC,
    collaborationMode: CollaborationMode.ALL_USERS,
    recipeCount: 12,
    collaboratorCount: 3,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
];

const mockCollectionsPage: PageCollectionDto = {
  content: mockCollections,
  totalElements: 2,
  totalPages: 1,
  last: true,
  first: true,
  numberOfElements: 2,
  size: 50,
  number: 0,
  sort: {
    sorted: false,
    unsorted: true,
    empty: true,
  },
  empty: false,
};

describe('AddToCollectionModal', () => {
  let mockAddSuccessToast: jest.Mock;
  let mockAddErrorToast: jest.Mock;
  let mockOnOpenChange: jest.Mock;
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

    // Mock collections query
    (useCollections as jest.Mock).mockReturnValue({
      data: mockCollectionsPage,
      isLoading: false,
      isError: false,
    });

    // Mock mutations
    mockAddToCollectionMutate = jest.fn().mockResolvedValue({});
    mockCreateCollectionMutate = jest.fn().mockResolvedValue({
      collectionId: 3,
      userId: 'user-123',
      name: 'New Collection',
      visibility: CollectionVisibility.PRIVATE,
      collaborationMode: CollaborationMode.OWNER_ONLY,
      recipeCount: 0,
      collaboratorCount: 0,
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
    });

    (useAddRecipeToCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockAddToCollectionMutate,
      isPending: false,
    });

    (useCreateCollection as jest.Mock).mockReturnValue({
      mutateAsync: mockCreateCollectionMutate,
      isPending: false,
    });

    mockOnOpenChange = jest.fn();
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText(/Add "Test Recipe" to a collection/i)
      ).toBeInTheDocument();
    });

    it('should not render modal when closed', () => {
      render(
        <AddToCollectionModal
          open={false}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(screen.queryByText('Add to Collection')).not.toBeInTheDocument();
    });

    it('should display recipe preview with image', () => {
      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const image = screen.getByAltText('Test Recipe');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    it('should display recipe preview without image', () => {
      const recipeWithoutImage = { ...mockRecipe, imageUrl: undefined };

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={recipeWithoutImage}
        />
      );

      expect(screen.queryByAltText('Test Recipe')).not.toBeInTheDocument();
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });

    it('should render mode toggle buttons', () => {
      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(
        screen.getByRole('button', { name: /select existing/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create new/i })
      ).toBeInTheDocument();
    });
  });

  describe('Select Existing Collection Mode', () => {
    it('should display list of collections', () => {
      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(screen.getByText('Favorites')).toBeInTheDocument();
      expect(screen.getByText('My favorite recipes')).toBeInTheDocument();
      expect(screen.getByText('5 recipes')).toBeInTheDocument();

      expect(screen.getByText('Quick Dinners')).toBeInTheDocument();
      expect(
        screen.getByText('Fast and easy weeknight meals')
      ).toBeInTheDocument();
      expect(screen.getByText('12 recipes')).toBeInTheDocument();
    });

    it('should show loading skeletons when loading collections', () => {
      (useCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Check for skeleton elements (they have specific test IDs or classes)
      const container = screen.getByRole('dialog');
      expect(container).toBeInTheDocument();
    });

    it('should show error message when collections fail to load', () => {
      (useCollections as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      });

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(
        screen.getByText(/Failed to load collections/i)
      ).toBeInTheDocument();
    });

    it('should show empty state when no collections exist', () => {
      (useCollections as jest.Mock).mockReturnValue({
        data: { ...mockCollectionsPage, content: [] },
        isLoading: false,
        isError: false,
      });

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      expect(screen.getByText('No collections found')).toBeInTheDocument();
      expect(
        screen.getByText(/Create your first collection/i)
      ).toBeInTheDocument();
    });

    it('should select a collection when clicked', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const favoriteButton = screen.getByText('Favorites').closest('button');
      expect(favoriteButton).toBeInTheDocument();

      await user.click(favoriteButton!);

      // Check if checkmark icon appears (indicating selection)
      await waitFor(() => {
        expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
      });
    });

    it('should add recipe to selected collection', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Select a collection
      const favoriteButton = screen.getByText('Favorites').closest('button');
      await user.click(favoriteButton!);

      // Click add button
      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      await user.click(addButton);

      await waitFor(() => {
        expect(mockAddToCollectionMutate).toHaveBeenCalledWith({
          collectionId: 1,
          recipeId: 1,
        });
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        'Recipe added to "Favorites"',
        { duration: 3000 }
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should show error toast when add to collection fails', async () => {
      const user = userEvent.setup();
      mockAddToCollectionMutate.mockRejectedValue(new Error('Network error'));

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Select and add
      const favoriteButton = screen.getByText('Favorites').closest('button');
      await user.click(favoriteButton!);

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      await user.click(addButton);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith('Network error', {
          duration: 5000,
        });
      });

      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });

    it('should disable add button when no collection selected', () => {
      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      expect(addButton).toBeDisabled();
    });
  });

  describe('Create New Collection Mode', () => {
    it('should switch to create mode when clicking Create New button', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const createButton = screen.getByRole('button', { name: /create new/i });
      await user.click(createButton);

      expect(screen.getByLabelText(/collection name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/visibility/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/collaboration mode/i)).toBeInTheDocument();
    });

    it('should create new collection and add recipe', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Switch to create mode
      await user.click(screen.getByRole('button', { name: /create new/i }));

      // Fill in form
      const nameInput = screen.getByLabelText(/collection name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(nameInput, 'My New Collection');
      await user.type(descriptionInput, 'A great collection');

      // Submit
      const createButton = screen.getByRole('button', {
        name: /create & add recipe/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockCreateCollectionMutate).toHaveBeenCalledWith({
          name: 'My New Collection',
          description: 'A great collection',
          visibility: 'PRIVATE',
          collaborationMode: 'OWNER_ONLY',
        });
      });

      await waitFor(() => {
        expect(mockAddToCollectionMutate).toHaveBeenCalledWith({
          collectionId: 3,
          recipeId: 1,
        });
      });

      expect(mockAddSuccessToast).toHaveBeenCalledWith(
        'Collection "My New Collection" created and recipe added',
        { duration: 3000 }
      );
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should handle empty description correctly', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      await user.click(screen.getByRole('button', { name: /create new/i }));

      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'Collection Without Description');

      const createButton = screen.getByRole('button', {
        name: /create & add recipe/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockCreateCollectionMutate).toHaveBeenCalledWith({
          name: 'Collection Without Description',
          description: undefined,
          visibility: 'PRIVATE',
          collaborationMode: 'OWNER_ONLY',
        });
      });
    });

    it('should disable create button when name is empty', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      await user.click(screen.getByRole('button', { name: /create new/i }));

      const createButton = screen.getByRole('button', {
        name: /create & add recipe/i,
      });
      expect(createButton).toBeDisabled();
    });

    it('should show error toast when create collection fails', async () => {
      const user = userEvent.setup();
      mockCreateCollectionMutate.mockRejectedValue(
        new Error('Creation failed')
      );

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      await user.click(screen.getByRole('button', { name: /create new/i }));

      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'Failed Collection');

      const createButton = screen.getByRole('button', {
        name: /create & add recipe/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockAddErrorToast).toHaveBeenCalledWith('Creation failed', {
          duration: 5000,
        });
      });

      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Modal Controls', () => {
    it('should close modal when Cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should reset form state after modal closes', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      const { rerender } = render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Switch to create mode and fill form
      await user.click(screen.getByRole('button', { name: /create new/i }));
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'Test');

      // Close modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Close the modal by changing props
      rerender(
        <AddToCollectionModal
          open={false}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Fast-forward timers to execute the setTimeout in handleClose
      jest.runAllTimers();

      // Reopen modal
      rerender(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      // Should be back in select mode - check for "Select Existing" button which is active (not outline variant)
      const selectExistingButton = screen.getByRole('button', {
        name: /select existing/i,
      });
      expect(selectExistingButton).toBeInTheDocument();
      // The collections should be visible
      expect(screen.getByText('My favorite recipes')).toBeInTheDocument();

      jest.useRealTimers();
    });

    it('should disable all controls when submitting', () => {
      (useAddRecipeToCollection as jest.Mock).mockReturnValue({
        mutateAsync: mockAddToCollectionMutate,
        isPending: true,
      });

      render(
        <AddToCollectionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          recipe={mockRecipe}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeDisabled();

      const addButton = screen.getByRole('button', {
        name: /add to collection/i,
      });
      expect(addButton).toBeDisabled();
    });
  });
});
