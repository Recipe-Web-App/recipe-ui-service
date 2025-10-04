import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useRegister } from '@/hooks/auth/useRegister';

// Mock the hooks
jest.mock('@/hooks/auth/useRegister');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseRegister = useRegister as jest.MockedFunction<typeof useRegister>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RegisterForm', () => {
  const mockPush = jest.fn();
  const mockMutateAsync = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    mockUseRegister.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: 'idle',
      submittedAt: 0,
    } as any);
  });

  it('renders registration form fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    await user.click(usernameInput);
    await user.tab(); // Blur the username field

    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('validates username format', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, '123invalid');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/username must start with a letter/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^password/i);
    await user.type(passwordInput, 'weak');
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({
      user: {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      token: {
        access_token: 'token',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      },
    });

    render(<RegisterForm onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password123');
    await user.type(screen.getByLabelText(/full name/i), 'Test User');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
        full_name: 'Test User',
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('omits empty optional fields from submission', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValue({
      user: {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      token: {
        access_token: 'token',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      },
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123', // pragma: allowlist secret
      });
    });
  });

  it('displays error message on registration failure', async () => {
    const errorMessage = 'Username already exists';

    mockUseRegister.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: true,
      error: new Error(errorMessage),
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 1,
      failureReason: new Error(errorMessage),
      isPaused: false,
      status: 'error',
      submittedAt: 0,
    } as any);

    render(<RegisterForm />);

    expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables form fields while submitting', async () => {
    mockUseRegister.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
      error: null,
      isSuccess: false,
      data: undefined,
      reset: jest.fn(),
      mutate: jest.fn(),
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: 'pending',
      submittedAt: Date.now(),
    } as any);

    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/^password/i)).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /creating account/i })
    ).toBeDisabled();
  });

  it('redirects to custom URL on success', async () => {
    const user = userEvent.setup();
    const customRedirect = '/dashboard';

    mockMutateAsync.mockResolvedValue({
      user: {
        user_id: '123',
        username: 'testuser',
        email: 'test@example.com',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      },
      token: {
        access_token: 'token',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      },
    });

    render(<RegisterForm redirectUrl={customRedirect} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password123');

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(customRedirect);
    });
  });
});
