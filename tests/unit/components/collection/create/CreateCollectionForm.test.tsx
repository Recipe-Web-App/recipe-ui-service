import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CollectionVisibility,
  CollaborationMode,
} from '@/types/recipe-management/common';

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock the APIs first
const mockAddRecipeToCollection = jest.fn();
const mockReorderRecipes = jest.fn();
const mockAddCollaborator = jest.fn();

jest.mock('@/lib/api/recipe-management/collection-recipes', () => ({
  collectionRecipesApi: {
    addRecipeToCollection: (...args: unknown[]) =>
      mockAddRecipeToCollection(...args),
    reorderRecipes: (...args: unknown[]) => mockReorderRecipes(...args),
  },
}));

jest.mock('@/lib/api/recipe-management/collection-collaborators', () => ({
  collectionCollaboratorsApi: {
    addCollaborator: (...args: unknown[]) => mockAddCollaborator(...args),
  },
}));

// Mock the hooks
const mockMutateAsync = jest.fn();
const mockUseDebouncedRecipeSearch = jest.fn();
const mockUseSearchUsers = jest.fn();

jest.mock('@/hooks/recipe-management', () => ({
  useCreateCollection: () => ({
    mutateAsync: mockMutateAsync,
    isLoading: false,
    error: null,
  }),
  useDebouncedRecipeSearch: (...args: unknown[]) =>
    mockUseDebouncedRecipeSearch(...args),
  useSuggestedRecipes: () => ({
    data: { recipes: [], totalElements: 0 },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/hooks/user-management', () => ({
  useSearchUsers: (...args: unknown[]) => mockUseSearchUsers(...args),
  useSuggestedUsers: () => ({
    data: { results: [], totalCount: 0 },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    user: {
      id: 'current-user-id',
      name: 'Current User',
      email: 'current@test.com',
    },
    authUser: null,
  }),
}));

// Mock collection store
const mockHasUnsavedDraft = jest.fn().mockReturnValue(false);
const mockSetDraftCollection = jest.fn();
const mockClearDraftCollection = jest.fn();
const mockSetDraftSaving = jest.fn();

const mockCollectionStoreState = {
  draftCollection: null as {
    name: string;
    description: string;
    visibility: CollectionVisibility;
    collaborationMode: CollaborationMode;
    tags: string[];
    recipes: {
      id: string;
      recipeId: number;
      recipeTitle: string;
      recipeDescription: string;
      displayOrder: number;
    }[];
    collaborators: {
      id: string;
      userId: string;
      userName: string;
      userEmail: string;
    }[];
  } | null,
  draftCollectionId: null as string | null,
  draftLastModified: null as Date | null,
  hasUnsavedDraft: mockHasUnsavedDraft,
  setDraftCollection: mockSetDraftCollection,
  clearDraftCollection: mockClearDraftCollection,
  setDraftSaving: mockSetDraftSaving,
};

jest.mock('@/stores/collection-store', () => ({
  useCollectionStore: () => mockCollectionStoreState,
}));

// Mock toast store
const mockAddSuccessToast = jest.fn();
const mockAddErrorToast = jest.fn();

jest.mock('@/stores/ui/toast-store', () => ({
  useToastStore: () => ({
    addSuccessToast: mockAddSuccessToast,
    addErrorToast: mockAddErrorToast,
  }),
}));

// Import component after mocks are set up
import { CreateCollectionForm } from '@/components/collection/create/CreateCollectionForm';

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

describe('CreateCollectionForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset collection store mocks
    mockHasUnsavedDraft.mockReturnValue(false);
    mockCollectionStoreState.draftCollection = null;
    mockCollectionStoreState.draftCollectionId = null;
    mockCollectionStoreState.draftLastModified = null;

    // Default mock implementations
    mockUseDebouncedRecipeSearch.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    mockUseSearchUsers.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    mockMutateAsync.mockResolvedValue({
      collectionId: 1,
      name: 'Test Collection',
      visibility: CollectionVisibility.PRIVATE,
      collaborationMode: CollaborationMode.OWNER_ONLY,
    });

    mockAddRecipeToCollection.mockResolvedValue({
      recipeId: 1,
      recipeTitle: 'Test Recipe',
      displayOrder: 0,
      addedBy: 'user',
      addedAt: new Date().toISOString(),
    });
  });

  describe('Rendering', () => {
    it('should render the form with title and description', async () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      await waitFor(() => {
        // The title is in a heading element
        expect(
          screen.getByRole('heading', { name: 'Create Collection' })
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          'Create a new collection to organize and share your favorite recipes.'
        )
      ).toBeInTheDocument();
    });

    it('should render all form sections', () => {
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Basic Info Section
      expect(screen.getByLabelText(/collection name/i)).toBeInTheDocument();

      // Recipe Picker Section
      expect(screen.getByText('Add Recipes')).toBeInTheDocument();

      // Create button
      expect(
        screen.getByRole('button', { name: /create collection/i })
      ).toBeInTheDocument();
    });

    it('should render cancel button when onCancel provided', () => {
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm onCancel={mockOnCancel} />
        </Wrapper>
      );

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('should not render cancel button when onCancel not provided', () => {
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      expect(
        screen.queryByRole('button', { name: /cancel/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when form is invalid', () => {
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      const submitButton = screen.getByRole('button', {
        name: /create collection/i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should show validation error for short name', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'ab');
      await user.tab(); // Trigger blur validation

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 3 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Collaborator Section Visibility', () => {
    it('should not show collaborator picker by default (OWNER_ONLY mode)', () => {
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Should not show Add Collaborators section content
      expect(screen.queryByText('Add Collaborators')).not.toBeInTheDocument();
    });

    it('should show collaborator picker when SPECIFIC_USERS mode is selected', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Find and click the Specific Users radio button
      const specificUsersRadio = screen.getByRole('radio', {
        name: /specific users/i,
      });
      await user.click(specificUsersRadio);

      await waitFor(() => {
        expect(screen.getByText('Add Collaborators')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    // Pre-defined valid recipe for initial values
    const validInitialRecipe = {
      id: 'recipe-1-123',
      recipeId: 1,
      recipeTitle: 'Test Recipe',
      recipeDescription: 'Delicious',
      displayOrder: 0,
    };

    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      mockAddRecipeToCollection.mockResolvedValue({
        recipeId: 1,
        recipeTitle: 'Test Recipe',
        displayOrder: 0,
        addedBy: 'user',
        addedAt: new Date().toISOString(),
      });

      render(
        <Wrapper>
          <CreateCollectionForm
            onSuccess={mockOnSuccess}
            initialValues={{
              name: 'My Test Collection',
              recipes: [validInitialRecipe],
            }}
          />
        </Wrapper>
      );

      // Submit form - should be valid with initial values
      const submitButton = screen.getByRole('button', {
        name: /create collection/i,
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          name: 'My Test Collection',
          description: undefined,
          visibility: CollectionVisibility.PRIVATE,
          collaborationMode: CollaborationMode.OWNER_ONLY,
        });
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      // Create a promise that we can control
      let resolvePromise: (value: unknown) => void;
      mockMutateAsync.mockReturnValue(
        new Promise(resolve => {
          resolvePromise = resolve;
        })
      );

      render(
        <Wrapper>
          <CreateCollectionForm
            initialValues={{
              name: 'My Test Collection',
              recipes: [validInitialRecipe],
            }}
          />
        </Wrapper>
      );

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /create collection/i,
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
      });

      // Resolve the promise
      resolvePromise!({
        collectionId: 1,
        name: 'My Test Collection',
      });
    });

    it('should show error message on submission failure', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      mockMutateAsync.mockRejectedValue(new Error('Network error'));

      render(
        <Wrapper>
          <CreateCollectionForm
            onError={mockOnError}
            initialValues={{
              name: 'My Test Collection',
              recipes: [validInitialRecipe],
            }}
          />
        </Wrapper>
      );

      // Submit
      const submitButton = screen.getByRole('button', {
        name: /create collection/i,
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      expect(mockOnError).toHaveBeenCalled();
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button clicked (no changes)', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm onCancel={mockOnCancel} />
        </Wrapper>
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should show confirmation when canceling with unsaved changes', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(
        <Wrapper>
          <CreateCollectionForm onCancel={mockOnCancel} />
        </Wrapper>
      );

      // Make changes
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'Some changes');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      expect(mockOnCancel).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should call onCancel when user confirms cancellation', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      // Mock window.confirm to return true
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(
        <Wrapper>
          <CreateCollectionForm onCancel={mockOnCancel} />
        </Wrapper>
      );

      // Make changes
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'Some changes');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Initial Values', () => {
    it('should pre-populate form with initial values', () => {
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm
            initialValues={{
              name: 'Pre-filled Name',
              description: 'Pre-filled description',
              visibility: CollectionVisibility.PUBLIC,
            }}
          />
        </Wrapper>
      );

      const nameInput = screen.getByLabelText(/collection name/i);
      expect(nameInput).toHaveValue('Pre-filled Name');

      // Description textarea - use placeholder text since label association differs
      const descInput = screen.getByPlaceholderText(
        /describe what makes this collection special/i
      );
      expect(descInput).toHaveValue('Pre-filled description');

      // Public visibility should be selected - the radio input has aria-label
      const publicRadio = screen.getByRole('radio', { name: /public/i });
      expect(publicRadio).toBeChecked();
    });
  });

  describe('Draft Functionality', () => {
    it('should show restore dialog when draft exists', async () => {
      mockHasUnsavedDraft.mockReturnValue(true);
      mockCollectionStoreState.draftCollection = {
        name: 'My Draft Collection',
        description: 'Draft description',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
        recipes: [],
        collaborators: [],
      };
      mockCollectionStoreState.draftLastModified = new Date();

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Restore Draft?')).toBeInTheDocument();
      });
    });

    it('should not show restore dialog when no draft exists', async () => {
      mockHasUnsavedDraft.mockReturnValue(false);

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText('Restore Draft?')).not.toBeInTheDocument();
      });
    });

    it('should not show restore dialog when initialValues provided', async () => {
      mockHasUnsavedDraft.mockReturnValue(true);
      mockCollectionStoreState.draftCollection = {
        name: 'My Draft Collection',
        description: '',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
        recipes: [],
        collaborators: [],
      };

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm
            initialValues={{
              name: 'Provided Name',
            }}
          />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.queryByText('Restore Draft?')).not.toBeInTheDocument();
        expect(screen.getByLabelText(/collection name/i)).toHaveValue(
          'Provided Name'
        );
      });
    });

    it('should restore draft when "Restore Draft" is clicked', async () => {
      const user = userEvent.setup();

      mockHasUnsavedDraft.mockReturnValue(true);
      mockCollectionStoreState.draftCollection = {
        name: 'My Draft Collection',
        description: 'Draft description',
        visibility: CollectionVisibility.PUBLIC,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: ['tag1'],
        recipes: [],
        collaborators: [],
      };
      mockCollectionStoreState.draftLastModified = new Date();

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Restore Draft?')).toBeInTheDocument();
      });

      const restoreButton = screen.getByRole('button', {
        name: /restore draft/i,
      });
      await user.click(restoreButton);

      await waitFor(() => {
        expect(screen.queryByText('Restore Draft?')).not.toBeInTheDocument();
        expect(screen.getByLabelText(/collection name/i)).toHaveValue(
          'My Draft Collection'
        );
      });
    });

    it('should clear draft when "Start Fresh" is clicked', async () => {
      const user = userEvent.setup();

      mockHasUnsavedDraft.mockReturnValue(true);
      mockCollectionStoreState.draftCollection = {
        name: 'My Draft Collection',
        description: '',
        visibility: CollectionVisibility.PRIVATE,
        collaborationMode: CollaborationMode.OWNER_ONLY,
        tags: [],
        recipes: [],
        collaborators: [],
      };
      mockCollectionStoreState.draftLastModified = new Date();

      const Wrapper = createTestWrapper();
      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Restore Draft?')).toBeInTheDocument();
      });

      const startFreshButton = screen.getByRole('button', {
        name: /start fresh/i,
      });
      await user.click(startFreshButton);

      await waitFor(() => {
        expect(mockClearDraftCollection).toHaveBeenCalled();
        expect(screen.queryByText('Restore Draft?')).not.toBeInTheDocument();
      });
    });

    it('should show Save Draft button when form has changes', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Initially no Save Draft button
      expect(
        screen.queryByRole('button', { name: /save draft/i })
      ).not.toBeInTheDocument();

      // Make changes
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'New Collection');

      // Save Draft button should appear
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /save draft/i })
        ).toBeInTheDocument();
      });
    });

    it('should save draft when Save Draft button is clicked', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Make changes
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'New Collection');

      // Click Save Draft
      const saveDraftButton = await screen.findByRole('button', {
        name: /save draft/i,
      });
      await user.click(saveDraftButton);

      await waitFor(() => {
        expect(mockSetDraftSaving).toHaveBeenCalledWith(true);
        expect(mockSetDraftCollection).toHaveBeenCalled();
        expect(mockAddSuccessToast).toHaveBeenCalledWith(
          'Draft saved successfully'
        );
      });
    });

    it('should clear draft on successful form submission', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      const validInitialRecipe = {
        id: 'recipe-1-123',
        recipeId: 1,
        recipeTitle: 'Test Recipe',
        recipeDescription: 'Delicious',
        displayOrder: 0,
      };

      render(
        <Wrapper>
          <CreateCollectionForm
            onSuccess={mockOnSuccess}
            initialValues={{
              name: 'My Test Collection',
              recipes: [validInitialRecipe],
            }}
          />
        </Wrapper>
      );

      const submitButton = screen.getByRole('button', {
        name: /create collection/i,
      });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockClearDraftCollection).toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should show unsaved changes indicator when form is dirty', async () => {
      const user = userEvent.setup();
      const Wrapper = createTestWrapper();

      render(
        <Wrapper>
          <CreateCollectionForm />
        </Wrapper>
      );

      // Make changes
      const nameInput = screen.getByLabelText(/collection name/i);
      await user.type(nameInput, 'New Collection');

      // Should show unsaved changes indicator
      await waitFor(() => {
        expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
      });
    });
  });
});
