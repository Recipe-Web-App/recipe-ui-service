import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegister } from '@/hooks/auth/useRegister';
import { useAuthStore } from '@/stores/auth-store';
import { userAuthApi } from '@/lib/api/auth';
import type { UserRegistrationResponse } from '@/types/auth';

// Mock the API
jest.mock('@/lib/api/auth', () => ({
  userAuthApi: {
    register: jest.fn(),
  },
}));

const mockedUserAuthApi = userAuthApi as jest.Mocked<typeof userAuthApi>;

// Create wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRegister', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it('should register user successfully and update auth store', async () => {
    const mockResponse: UserRegistrationResponse = {
      user: {
        user_id: '123',
        username: 'newuser',
        email: 'new@example.com',
        full_name: 'New User',
        is_active: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      token: {
        access_token: 'registration-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    };

    mockedUserAuthApi.register.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123', // pragma: allowlist secret
      full_name: 'New User',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedUserAuthApi.register).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123', // pragma: allowlist secret
      full_name: 'New User',
    });

    // Check auth store was updated
    const authState = useAuthStore.getState();
    expect(authState.authUser).toEqual(mockResponse.user);
    expect(authState.token).toBe('registration-token');
    expect(authState.isAuthenticated).toBe(true);
  });

  it('should register user without token and only set user data', async () => {
    const mockResponse: UserRegistrationResponse = {
      user: {
        user_id: '123',
        username: 'newuser',
        email: 'new@example.com',
        is_active: false, // Account needs verification
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      // No token returned - user needs to verify email first
    };

    mockedUserAuthApi.register.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123', // pragma: allowlist secret
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check auth store was updated with user but no token
    const authState = useAuthStore.getState();
    expect(authState.authUser).toEqual(mockResponse.user);
    expect(authState.token).toBeNull();
    expect(authState.isAuthenticated).toBe(true); // Still authenticated because user is set
  });

  it('should handle registration error', async () => {
    const error = new Error('Username already exists');
    mockedUserAuthApi.register.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123', // pragma: allowlist secret
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);

    // Check auth store was not updated
    const authState = useAuthStore.getState();
    expect(authState.authUser).toBeNull();
    expect(authState.token).toBeNull();
    expect(authState.isAuthenticated).toBe(false);
  });

  it('should handle registration with validation errors', async () => {
    const error = new Error('Password too weak');
    mockedUserAuthApi.register.mockRejectedValue(error);

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      username: 'newuser',
      email: 'new@example.com',
      password: '123', // Weak password
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(error);
  });
});
