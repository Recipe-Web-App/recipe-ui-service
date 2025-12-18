import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CollaboratorPickerSection } from '@/components/collection/create/CollaboratorPickerSection';
import { createCollectionFormSchema } from '@/lib/validation/create-collection-schemas';
import {
  CREATE_COLLECTION_DEFAULT_VALUES,
  CREATE_COLLECTION_LIMITS,
  type CreateCollectionFormData,
} from '@/types/collection/create-collection-form';
import { CollaborationMode } from '@/types/recipe-management/common';

// Mock the user management hooks
jest.mock('@/hooks/user-management', () => ({
  useSearchUsers: jest.fn(),
  useSuggestedUsers: jest.fn(),
}));

// Mock the auth store
jest.mock('@/stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

import { useSearchUsers, useSuggestedUsers } from '@/hooks/user-management';
import { useAuthStore } from '@/stores/auth-store';

const mockUseSearchUsers = useSearchUsers as jest.Mock;
const mockUseSuggestedUsers = useSuggestedUsers as jest.Mock;
const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

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

describe('CollaboratorPickerSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchUsers.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockUseSuggestedUsers.mockReturnValue({
      data: { results: [], totalCount: 0 },
      isLoading: false,
      error: null,
    });
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 'current-user-id',
        name: 'Current User',
        email: 'current@test.com',
      },
      authUser: null,
    });
  });

  describe('Visibility based on collaboration mode', () => {
    it('should show informational message when not in SPECIFIC_USERS mode', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.OWNER_ONLY,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Collaborators')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Collaborator selection is only available in "Specific Users" mode.'
        )
      ).toBeInTheDocument();
    });

    it('should show search UI when in SPECIFIC_USERS mode', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('Add Collaborators')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/search by username/i)
      ).toBeInTheDocument();
    });

    it('should not render when inactive', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={false} />}
        </TestWrapper>
      );

      expect(screen.queryByText('Add Collaborators')).not.toBeInTheDocument();
    });
  });

  describe('Rendering in SPECIFIC_USERS mode', () => {
    const defaultValues: CreateCollectionFormData = {
      ...CREATE_COLLECTION_DEFAULT_VALUES,
      collaborationMode: CollaborationMode.SPECIFIC_USERS,
    };

    it('should show collaborator count', () => {
      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(
          `0 / ${CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS} collaborators selected`
        )
      ).toBeInTheDocument();
    });

    it('should show requirement message when no collaborators', () => {
      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText('At least 1 collaborator required')
      ).toBeInTheDocument();
    });

    it('should show empty state for selected collaborators', () => {
      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(
        screen.getByText(
          'No collaborators selected. Search and add users above.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    const defaultValues: CreateCollectionFormData = {
      ...CREATE_COLLECTION_DEFAULT_VALUES,
      collaborationMode: CollaborationMode.SPECIFIC_USERS,
    };

    it('should update search input when typing', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'john');

      expect(searchInput).toHaveValue('john');
    });

    it('should disable search button when input is less than 2 characters', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchButton = screen.getByRole('button', {
        name: /search users/i,
      });
      expect(searchButton).toBeDisabled();

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'j');

      expect(searchButton).toBeDisabled();
    });

    it('should enable search button when input has 2+ characters', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'jo');

      const searchButton = screen.getByRole('button', {
        name: /search users/i,
      });
      expect(searchButton).toBeEnabled();
    });

    it('should show search results section when search button is clicked', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: { results: [], totalCount: 0 },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'test');

      const searchButton = screen.getByRole('button', {
        name: /search users/i,
      });
      await user.click(searchButton);

      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show search results when Enter is pressed', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: { results: [], totalCount: 0 },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'test{enter}');

      expect(screen.getByText('Search Results')).toBeInTheDocument();
    });

    it('should show loading state when searching', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'test{enter}');

      expect(
        screen.getByLabelText('Loading user search results')
      ).toBeInTheDocument();
    });

    it('should display search results', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: {
          results: [
            { userId: '1', username: 'john_doe', fullName: 'John Doe' },
            { userId: '2', username: 'jane_doe', fullName: 'Jane Doe' },
          ],
          totalCount: 2,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'doe{enter}');

      expect(screen.getByText('john_doe')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane_doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should show error state when search fails', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Search failed' },
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'test{enter}');

      expect(screen.getByText('Search failed')).toBeInTheDocument();
    });

    it('should filter out the current user from search results', async () => {
      const user = userEvent.setup();

      mockUseAuthStore.mockReturnValue({
        user: {
          id: 'current-user-id',
          name: 'Current User',
          email: 'current@test.com',
        },
        authUser: null,
      });

      mockUseSearchUsers.mockReturnValue({
        data: {
          results: [
            {
              userId: 'current-user-id',
              username: 'currentuser',
              fullName: 'Current User',
            },
            { userId: '2', username: 'other_user', fullName: 'Other User' },
          ],
          totalCount: 2,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'user{enter}');

      // Current user should not be displayed
      expect(screen.queryByText('currentuser')).not.toBeInTheDocument();
      // Other user should be displayed
      expect(screen.getByText('other_user')).toBeInTheDocument();
      expect(screen.getByText('Other User')).toBeInTheDocument();
    });
  });

  describe('Adding Collaborators', () => {
    const defaultValues: CreateCollectionFormData = {
      ...CREATE_COLLECTION_DEFAULT_VALUES,
      collaborationMode: CollaborationMode.SPECIFIC_USERS,
    };

    it('should add a collaborator when clicking add button', async () => {
      const user = userEvent.setup();

      mockUseSearchUsers.mockReturnValue({
        data: {
          results: [
            { userId: '1', username: 'john_doe', fullName: 'John Doe' },
          ],
          totalCount: 1,
        },
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      await user.type(searchInput, 'john{enter}');

      const addButton = screen.getByRole('button', { name: 'Add john_doe' });
      await user.click(addButton);

      // Collaborator should appear in selected list
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove john_doe' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Removing Collaborators', () => {
    it('should remove a collaborator when clicking remove button', async () => {
      const user = userEvent.setup();

      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        collaborators: [
          {
            id: 'collab-1',
            userId: '1',
            username: 'user_to_remove',
            displayName: 'User to Remove',
          },
        ],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('user_to_remove')).toBeInTheDocument();

      const removeButton = screen.getByRole('button', {
        name: 'Remove user_to_remove',
      });
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('user_to_remove')).not.toBeInTheDocument();
      });
    });
  });

  describe('Maximum Collaborators Limit', () => {
    it('should disable search when max collaborators reached', () => {
      const collaborators = Array.from(
        { length: CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS },
        (_, i) => ({
          id: `collab-${i}`,
          userId: String(i),
          username: `user_${i}`,
        })
      );

      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        collaborators,
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText(/search by username/i);
      expect(searchInput).toBeDisabled();
      expect(
        screen.getByText(
          'Maximum collaborators reached. Remove some to add more.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Pre-populated Collaborators', () => {
    it('should display pre-populated collaborators', () => {
      const defaultValues: CreateCollectionFormData = {
        ...CREATE_COLLECTION_DEFAULT_VALUES,
        collaborationMode: CollaborationMode.SPECIFIC_USERS,
        collaborators: [
          {
            id: 'collab-1',
            userId: '1',
            username: 'pre_user_1',
            displayName: 'Pre User 1',
          },
          {
            id: 'collab-2',
            userId: '2',
            username: 'pre_user_2',
          },
        ],
      };

      render(
        <TestWrapper defaultValues={defaultValues}>
          {form => <CollaboratorPickerSection form={form} isActive={true} />}
        </TestWrapper>
      );

      expect(screen.getByText('pre_user_1')).toBeInTheDocument();
      expect(screen.getByText('Pre User 1')).toBeInTheDocument();
      expect(screen.getByText('pre_user_2')).toBeInTheDocument();
      expect(
        screen.getByText(
          `2 / ${CREATE_COLLECTION_LIMITS.MAX_COLLABORATORS} collaborators selected`
        )
      ).toBeInTheDocument();
    });
  });
});
