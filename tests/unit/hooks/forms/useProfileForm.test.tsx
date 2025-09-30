import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfileForm } from '@/hooks/forms/useProfileForm';
import * as useUserHook from '@/hooks/user-management/useUser';
import * as usersApiModule from '@/lib/api/user-management/users';
import type { UserProfileResponse } from '@/types/user-management';

// Mock the user hooks and API
jest.mock('@/hooks/user-management/useUser');
jest.mock('@/lib/api/user-management/users');

const mockCurrentUser: UserProfileResponse = {
  userId: '123',
  username: 'john_doe',
  email: 'john@example.com',
  fullName: 'John Doe',
  bio: 'I love cooking!',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

const mockUpdatedUser: UserProfileResponse = {
  ...mockCurrentUser,
  username: 'jane_doe',
  email: 'jane@example.com',
};

describe('useProfileForm', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Setup default mocks
    (useUserHook.useCurrentUser as jest.Mock).mockReturnValue({
      data: mockCurrentUser,
      isLoading: false,
      error: null,
    });

    (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
      error: null,
    });

    (
      usersApiModule.usersApi.isUsernameAvailable as jest.Mock
    ).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.form).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.resetForm).toBeDefined();
      expect(result.current.validateUsername).toBeDefined();
    });

    it('should load current user data into form', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        const values = result.current.form.getValues();
        expect(values.username).toBe('john_doe');
        expect(values.email).toBe('john@example.com');
        expect(values.fullName).toBe('John Doe');
        expect(values.bio).toBe('I love cooking!');
      });
    });

    it('should handle loading state', () => {
      (useUserHook.useCurrentUser as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle null values from user profile', async () => {
      const userWithNulls: UserProfileResponse = {
        ...mockCurrentUser,
        email: null,
        fullName: null,
        bio: null,
      };

      (useUserHook.useCurrentUser as jest.Mock).mockReturnValue({
        data: userWithNulls,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        const values = result.current.form.getValues();
        expect(values.username).toBe('john_doe');
        expect(values.email).toBe('');
        expect(values.fullName).toBe('');
        expect(values.bio).toBe('');
      });
    });
  });

  describe('form submission', () => {
    it('should submit form with updated data', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue(mockUpdatedUser);
      (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: null,
      });

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onSuccess }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('john_doe');
      });

      act(() => {
        result.current.form.setValue('username', 'jane_doe');
        result.current.form.setValue('email', 'jane@example.com');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: 'jane_doe',
        email: 'jane@example.com',
        fullName: 'John Doe',
        bio: 'I love cooking!',
      });

      expect(onSuccess).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should handle submission errors', async () => {
      const mockError = new Error('Update failed');
      const mockMutateAsync = jest.fn().mockRejectedValue(mockError);
      (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: null,
      });

      const onError = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onError }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('john_doe');
      });

      act(() => {
        result.current.form.setValue('username', 'new_username');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should update initial values after successful submit', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue(mockUpdatedUser);
      (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
        error: null,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('john_doe');
      });

      act(() => {
        result.current.form.setValue('username', 'jane_doe');
        result.current.form.setValue('email', 'jane@example.com');
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      // After submit, form should be reset to new values
      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('jane_doe');
        expect(result.current.form.getValues().email).toBe('jane@example.com');
      });
    });
  });

  describe('username validation', () => {
    it('should validate username availability', async () => {
      (
        usersApiModule.usersApi.isUsernameAvailable as jest.Mock
      ).mockResolvedValue(true);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentUser).toBeDefined();
      });

      let isAvailable = false;
      await act(async () => {
        isAvailable = await result.current.validateUsername('new_username');
      });

      expect(isAvailable).toBe(true);
      expect(usersApiModule.usersApi.isUsernameAvailable).toHaveBeenCalledWith(
        'new_username'
      );
    });

    it('should return true for current username', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentUser).toBeDefined();
      });

      let isAvailable = false;
      await act(async () => {
        isAvailable = await result.current.validateUsername('john_doe');
      });

      expect(isAvailable).toBe(true);
      expect(
        usersApiModule.usersApi.isUsernameAvailable
      ).not.toHaveBeenCalled();
    });

    it('should return false for unavailable username', async () => {
      (
        usersApiModule.usersApi.isUsernameAvailable as jest.Mock
      ).mockResolvedValue(false);

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentUser).toBeDefined();
      });

      let isAvailable = true;
      await act(async () => {
        isAvailable = await result.current.validateUsername('taken_username');
      });

      expect(isAvailable).toBe(false);
    });

    it('should handle validation errors gracefully', async () => {
      (
        usersApiModule.usersApi.isUsernameAvailable as jest.Mock
      ).mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentUser).toBeDefined();
      });

      let isAvailable = true;
      await act(async () => {
        isAvailable = await result.current.validateUsername('test_username');
      });

      // Should return false on error to be safe
      expect(isAvailable).toBe(false);
    });
  });

  describe('reset functionality', () => {
    it('should reset form to initial values', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('john_doe');
      });

      act(() => {
        result.current.form.setValue('username', 'changed_username');
        result.current.form.setValue('email', 'changed@example.com');
      });

      expect(result.current.form.getValues().username).toBe('changed_username');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.form.getValues().username).toBe('john_doe');
      expect(result.current.form.getValues().email).toBe('john@example.com');
    });

    it('should call onCancel when cancelChanges is called', async () => {
      const onCancel = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onCancel }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.form.getValues().username).toBe('john_doe');
      });

      act(() => {
        result.current.form.setValue('username', 'changed_username');
      });

      act(() => {
        result.current.cancelChanges();
      });

      expect(result.current.form.getValues().username).toBe('john_doe');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('unsaved changes tracking', () => {
    it('should detect unsaved changes', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.hasUnsavedChanges).toBe(false);
      });

      act(() => {
        result.current.form.setValue('username', 'new_username');
      });

      await waitFor(() => {
        expect(result.current.hasUnsavedChanges).toBe(true);
      });
    });

    it('should return false when no changes', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.hasUnsavedChanges).toBe(false);
      });

      // Set to same value
      act(() => {
        result.current.form.setValue('username', 'john_doe');
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('should return false after reset', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.hasUnsavedChanges).toBe(false);
      });

      act(() => {
        result.current.form.setValue('username', 'new_username');
      });

      await waitFor(() => {
        expect(result.current.hasUnsavedChanges).toBe(true);
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });
  });

  describe('loading and error states', () => {
    it('should expose updating state', () => {
      (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true,
        error: null,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.isUpdating).toBe(true);
    });

    it('should expose update error', () => {
      const mockError = new Error('Update failed');
      (useUserHook.useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: false,
        error: mockError,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.updateError).toBe(mockError);
    });

    it('should call onError when fetch fails', () => {
      const mockError = new Error('Fetch failed');
      const onError = jest.fn();

      (useUserHook.useCurrentUser as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
      });

      renderHook(() => useProfileForm({ onError }), { wrapper });

      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('callbacks', () => {
    it('should accept onSuccess callback', () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onSuccess }), {
        wrapper,
      });

      expect(result.current.handleSubmit).toBeDefined();
    });

    it('should accept onError callback', () => {
      const onError = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onError }), {
        wrapper,
      });

      expect(result.current.handleSubmit).toBeDefined();
    });

    it('should accept onCancel callback', () => {
      const onCancel = jest.fn();
      const { result } = renderHook(() => useProfileForm({ onCancel }), {
        wrapper,
      });

      expect(result.current.cancelChanges).toBeDefined();
    });
  });

  describe('current user exposure', () => {
    it('should expose current user data', async () => {
      const { result } = renderHook(() => useProfileForm(), { wrapper });

      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockCurrentUser);
      });
    });

    it('should return undefined when user is not loaded', () => {
      (useUserHook.useCurrentUser as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useProfileForm(), { wrapper });

      expect(result.current.currentUser).toBeUndefined();
    });
  });
});
